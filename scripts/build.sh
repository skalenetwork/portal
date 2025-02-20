#!/usr/bin/env bash

set -e

: "${NETWORK_NAME?Need to set NETWORK_NAME}"

export DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
export PORTAL_DIR="$DIR/../"

METAPORT_CONFIG_PATH=$PORTAL_DIR/config/$NETWORK_NAME.ts
METAPORT_CONFIG_PATH_SRC=$PORTAL_DIR/src/data/metaportConfig.ts

echo "Copying ${METAPORT_CONFIG_PATH} -> ${METAPORT_CONFIG_PATH_SRC}..."
cp $METAPORT_CONFIG_PATH $METAPORT_CONFIG_PATH_SRC

META_DIR_EXTERNAL=$PORTAL_DIR/skale-network/metadata/$NETWORK_NAME/
META_DIR=$PORTAL_DIR/src/meta/

if [ -d "$META_DIR" ]; then
    echo "Removing ${META_DIR}..."
    rm -rf $META_DIR
else
    echo "${META_DIR} not found, skipping"
fi

if [ -d "$META_DIR_EXTERNAL" ]; then
    echo "Copying ${META_DIR_EXTERNAL} -> ${META_DIR}..."
    cp -R $META_DIR_EXTERNAL $META_DIR
else
    cp -R $PORTAL_DIR/skale-network/metadata/mainnet/ $META_DIR
    echo "${META_DIR_EXTERNAL} not found, copying Mainnet meta"
fi

node $DIR/generate-imports.cjs ./src/meta/logos
node $DIR/generate-imports.cjs ./src/assets/validators

bash $DIR/generate_sitemap.sh

echo "Building packages..."

bun cleanup:portal

bun build:core
bun cleanup:core

bun build:metaport
bun cleanup:metaport

bun i

echo "Building..."
bun build:portal
