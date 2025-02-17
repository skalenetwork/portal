#!/usr/bin/env bash

set -e 

export DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
export PORTAL_DIR="$DIR/../../"
export SCRIPTS_DIR="$PORTAL_DIR/scripts/"

META_DIR_EXTERNAL=$PORTAL_DIR/skale-network/metadata/
META_DIR=$DIR/src/meta/

if [ -d "$META_DIR" ]; then
    echo "Removing ${META_DIR}..."
    rm -rf $META_DIR
else
    echo "${META_DIR} not found, skipping"
fi

echo "Copying ${META_DIR_EXTERNAL} -> ${META_DIR}..."
cp -R $META_DIR_EXTERNAL $META_DIR

cp $PORTAL_DIR/config/testnet.ts $DIR/src/meta/testnetConfig.ts

node $SCRIPTS_DIR/generate-imports.cjs ./src/meta

