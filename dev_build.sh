#!/usr/bin/env bash

set -e

rm -rf ./node_modules/

cd ../metaport/
yarn run build
cd ../bridge-ui
yarn install
yarn start
