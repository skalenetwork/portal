#!/usr/bin/env bash

: "${NETWORK_NAME?Need to set NETWORK_NAME}"

export DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

META_DIR_EXTERNAL=$DIR/skale-network/metadata/$NETWORK_NAME/
META_DIR=$DIR/src/meta/

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
    cp -R $DIR/skale-network/metadata/mainnet/ $META_DIR
    echo "${META_DIR_EXTERNAL} not found, copying Mainnet meta"
fi
