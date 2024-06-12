# SKALE Portal

[![Discord](https://img.shields.io/discord/534485763354787851.svg)](https://discord.gg/vvUtWJB)

The SKALE Portal is a web-based interface that allows users to interact with the SKALE IMA contracts. SKALE Portal provides a user-friendly way for users to transfer assets and data between different SKALE chains and Ethereum Mainnet, enabling greater flexibility and scalability for decentralized applications.

## How It Works

The SKALE Interchain Bridge UI is built on top of the [SKALE IMA contracts](https://github.com/skalenetwork/IMA) and uses [Metaport](https://github.com/skalenetwork/metaport). The IMA contracts enable the SKALE Chains to communicate between each onther and Ethereum Mainnet.

The Interchain Bridge UI consists of a user interface that allows users to initiate and track transfers of assets and data between different blockchain networks. Users can connect their wallets to the Interchain Bridge UI and select the source and destination blockchains for their transfers.

## Bridge link integration

It's possible to embed Bridge link with fallback into your dApp.

#### Directing users to the particular pair of chains

```
http://[BASE_BRIDGE_URL]/?from=[FROM_CHAIN_NAME]&to=[TO_CHAIN_NAME]&token=[TOKEN_SYMBOL]&type=[TOKEN_TYPE]&from-app=[FROM_APP_NAME]&to-app=[TO_APP_NAME]
```

Example:

```
http://[BASE_BRIDGE_URL]/?from=elated-tan-skat&to=green-giddy-denebola&token=skl&type=erc20&from-app=ruby&to-app=nftb
```

#### Customizing transfer parameters

You can customize the link with the following parameters:

Required params:

- `from` - from chain name
- `to` - to chain name

Optional params:

- `token` - symbol of the token to transfer
- `type` - token type (only `erc20` and `eth` are supported for now)
- `from-app` - when transfering from a Hub chain, it's possible to specify the name of the app to transfer from
- `to-app` - when transfering to a Hub chain, it's possible to specify the name of the app to transfer to


Will be available in the future:

- `fallback-url` - URL with fallback link to redirect user after the transfer is completed (should be encoded)
- `fallback-text` - Text to display on the fallback button (should be encoded)


In JS you can use the following function to encode the URL:

```js
function encodeUrl(url) {
  return encodeURIComponent('https://www.example.com/some/path')
}
```

## Getting Started
To get started with the SKALE Portal, users can visit the [SKALE Portal](https://portal.skale.space/) website and click on the "Connect wallet" button. Users can then connect their wallets and select the source and destination blockchains for their transfers.

## Development Setup
If you're interested in contributing to the SKALE Portal, follow these steps to set up your development environment:

1. Clone the repository: `git clone --recurse-submodules https://github.com/skalenetwork/portal.git`
2. Install dependencies: `cd portal && yarn install`
3. Prepare metadata: `NETWORK_NAME=[SKALE NETWORK NAME - mainnet or staging] bash build.sh`
4. Export Mainnet Ethereum endpoint to your env: `export VITE_MAINNET_ENDPOINT=XXX` or create `.env` file in the root dir
5. Start the development server: `yarn start`

The SKALE Portal is built using the Create React App TypeScript template and uses [Metaport](https://github.com/skalenetwork/metaport) and [ima-js](https://github.com/skalenetwork/ima-js) libraries.

To contribute to the project, create a new branch with a descriptive name for your changes, make your changes, and submit a pull request.

## Environment Variables

```bash
VITE_MAINNET_ENDPOINT= # mainnet endpoint, required
VITE_WC_PROJECT_ID= # walletconnect project ID, optional
VITE_TRANSAK_STAGING_ENV=true # set test env for transak, optional
VITE_TRANSAK_API_KEY= # onramp API key, optional
```


## Security and Liability

The SKALE Portal and code is WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

## License

![GitHub](https://img.shields.io/github/license/skalenetwork/portal.svg)

All contributions are made under the [GNU Lesser General Public License v3](https://www.gnu.org/licenses/lgpl-3.0.en.html). See [LICENSE](LICENSE).
