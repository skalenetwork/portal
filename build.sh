#!/usr/bin/env bash

set -e

: "${NETWORK_NAME?Need to set NETWORK_NAME}"

export DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

METAPORT_CONFIG_PATH=$DIR/env/$NETWORK_NAME/metaportConfig.ts
METAPORT_CONFIG_PATH_SRC=$DIR/src/metadata/metaportConfig.ts

echo "Copying ${METAPORT_CONFIG_PATH} -> ${METAPORT_CONFIG_PATH_SRC}..."
cp $METAPORT_CONFIG_PATH $METAPORT_CONFIG_PATH_SRC

echo "Building..."
yarn build
