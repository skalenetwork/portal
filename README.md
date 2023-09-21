# SKALE Bridge UI

[![Discord](https://img.shields.io/discord/534485763354787851.svg)](https://discord.gg/vvUtWJB)

The SKALE Bridge UI is a web-based interface that allows users to interact with the SKALE IMA contracts. The Bridge UI provides a user-friendly way for users to transfer assets and data between different SKALE chains and Ethereum Mainnet, enabling greater flexibility and scalability for decentralized applications.

## How It Works

The SKALE Interchain Bridge UI is built on top of the [SKALE IMA contracts](https://github.com/skalenetwork/IMA) and uses [Metaport](https://github.com/skalenetwork/metaport). The IMA contracts enable the SKALE Chains to communicate between each onther and Ethereum Mainnet.

The Interchain Bridge UI consists of a user interface that allows users to initiate and track transfers of assets and data between different blockchain networks. Users can connect their wallets to the Interchain Bridge UI and select the source and destination blockchains for their transfers.

## Bridge integration

It's possible to embed Bridge UI link with fallback into your dApp.

#### Directing users to the particular source chain

```
https://[BASE_BRIDGE_URL]/#/bridge/transfer/[FROM_CHAIN_NAME]
```

#### Directing users to the particular pair of chains

```
https://[BASE_BRIDGE_URL]/#/bridge/transfer/[FROM_CHAIN_NAME]/[TO_CHAIN_NAME]
```

#### Customizing transfer parameters

You can customize the link with the following parameters:

All params are optional.

- `amount` - amount of tokens to transfer
- `token` - symbol of the token to transfer
- `from-app` - when transfering from a Hub chain, it's possible to specify the name of the app to transfer from
- `to-app` - when transfering to a Hub chain, it's possible to specify the name of the app to transfer to
- `fallback-url` - URL with fallback link to redirect user after the transfer is completed (should be encoded)
- `fallback-text` - Text to display on the fallback button (should be encoded)

Example of the link with all params:

```
http://[BASE_BRIDGE_URL]/#/bridge/transfer/staging-perfect-parallel-gacrux/staging-severe-violet-wezen?to-app=nftrade&from-app=ruby&token=skl&amount=250&fallback-url=https%3A%2F%2Fnftrade.com%2Fassets%2Fskale%2F0x3b6f8d50938900ef14fbac48575c33a849ffd683%2F1&fallback-text=Return%20to%20NFT%20%22Solitude%22
```

In JS you can use the following function to encode the URL:

```js
function encodeUrl(url) {
  return encodeURIComponent('https://www.example.com/some/path')
}
```

## Getting Started
To get started with the SKALE Bridge UI, users can visit the [SKALE Bridge UI](https://bridge.skale.network/) website and click on the "Connect wallet" button. Users can then connect their wallets and select the source and destination blockchains for their transfers.

## Development Setup
If you're interested in contributing to the SKALE Bridge UI, follow these steps to set up your development environment:

1. Clone the repository: `git clone --recurse-submodules https://github.com/skalenetwork/bridge-ui.git`
2. Install dependencies: `cd bridge-ui && yarn install`
3. Prepare metadata: `NETWORK_NAME=[SKALE NETWORK NAME - mainnet or staging] bash build.sh`
4. Export Mainnet Ethereum endpoint to your env: `export REACT_APP_MAINNET_ENDPOINT=XXX` or create `.env` file in the root dir
5. Start the development server: `yarn start`

The SKALE Interchain Bridge UI is built using the Create React App TypeScript template and uses [Metaport](https://github.com/skalenetwork/metaport) and [ima-js](https://github.com/skalenetwork/ima-js) libraries.

To contribute to the project, create a new branch with a descriptive name for your changes, make your changes, and submit a pull request.

## Security and Liability

The Bridge UI and code is WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

## License

![GitHub](https://img.shields.io/github/license/skalenetwork/bridge-ui.svg)

All contributions are made under the [GNU Lesser General Public License v3](https://www.gnu.org/licenses/lgpl-3.0.en.html). See [LICENSE](LICENSE).