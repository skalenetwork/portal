#!/usr/bin/env bash

set -euo pipefail

: "${NETWORK_NAME?Need to set NETWORK_NAME}"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
PORTAL_DIR="$DIR/../"

CONFIG_SRC_DIR="$PORTAL_DIR/config/$NETWORK_NAME"
CONFIG_DST_DIR="$PORTAL_DIR/src/data/metaportConfig"

echo "Preparing metaport config for ${NETWORK_NAME}..."
rm -rf "$CONFIG_DST_DIR"
mkdir -p "$CONFIG_DST_DIR"
if [ -d "$CONFIG_SRC_DIR" ]; then
    cp -R "$CONFIG_SRC_DIR/"* "$CONFIG_DST_DIR" 2>/dev/null || true
else
    echo "Config directory $CONFIG_SRC_DIR not found" >&2
    exit 1
fi

META_SRC_DIR="$PORTAL_DIR/skale-network/metadata/$NETWORK_NAME"
META_DST_DIR="$PORTAL_DIR/src/meta"

echo "Syncing metadata..."
rm -rf "$META_DST_DIR"
if [ -d "$META_SRC_DIR" ]; then
    cp -R "$META_SRC_DIR" "$META_DST_DIR"
else
    echo "Metadata for $NETWORK_NAME not found, falling back to mainnet"
    cp -R "$PORTAL_DIR/skale-network/metadata/mainnet" "$META_DST_DIR"
fi

node "$DIR/generate-imports.cjs" ./src/meta/logos
node "$DIR/generate-imports.cjs" ./src/assets/validators

bash "$DIR/generate_sitemap.sh"

if [ ! -d "$PORTAL_DIR/packages/core/dist" ] || [ ! -d "$PORTAL_DIR/packages/metaport/dist" ]; then
    echo "Building packages (core + metaport)..."
    bun run build:packages
else
    echo "Packages already built, skipping"
fi

echo "Building portal..."
bunx vite build
