#!/usr/bin/env bash
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$DIR/.."

if [ -z "${NETWORK_NAME:-}" ] && [ -f "$ROOT/.env" ]; then
  NETWORK_NAME="$(grep -E '^NETWORK_NAME=' "$ROOT/.env" | tail -1 | cut -d= -f2- | tr -d '"'"'"' ')"
fi
NETWORK_NAME="${NETWORK_NAME:-mainnet}"
METADATA="$ROOT/skale-network/metadata"

echo "Preparing metadata for $NETWORK_NAME..."

rm -rf "$ROOT/src/data/metaportConfig"
cp -R "$ROOT/config/$NETWORK_NAME" "$ROOT/src/data/metaportConfig"

rm -rf "$ROOT/src/meta"
cp -R "$METADATA/$NETWORK_NAME" "$ROOT/src/meta" 2>/dev/null ||
  cp -R "$METADATA/mainnet" "$ROOT/src/meta"

rm -rf "$ROOT/src/bridge/meta"
mkdir -p "$ROOT/src/bridge/meta"
for network in "$METADATA"/*/; do
  name="$(basename "$network")"
  mkdir -p "$ROOT/src/bridge/meta/$name"
  cp "$network/chains.json" "$ROOT/src/bridge/meta/$name/"
  cp -R "$network/icons" "$ROOT/src/bridge/meta/$name/"
done

node "$DIR/generate-imports.cjs" ./src/meta/logos
node "$DIR/generate-imports.cjs" ./src/assets/validators
node "$DIR/generate-imports.cjs" ./src/bridge/meta

bash "$DIR/generate_sitemap.sh"
