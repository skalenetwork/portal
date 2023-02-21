# SKALE Bridge UI

[![Discord](https://img.shields.io/discord/534485763354787851.svg)](https://discord.gg/vvUtWJB)

The SKALE Bridge UI is a web-based interface that allows users to interact with the SKALE IMA contracts. The Bridge UI provides a user-friendly way for users to transfer assets and data between different SKALE chains and Ethereum Mainnet, enabling greater flexibility and scalability for decentralized applications.

## How It Works

The SKALE Interchain Bridge UI is built on top of the [SKALE IMA contracts](https://github.com/skalenetwork/IMA) and uses [Metaport](https://github.com/skalenetwork/metaport). The IMA contracts enable the SKALE Chains to communicate between each onther and Ethereum Mainnet.

The Interchain Bridge UI consists of a user interface that allows users to initiate and track transfers of assets and data between different blockchain networks. Users can connect their wallets to the Interchain Bridge UI and select the source and destination blockchains for their transfers.

## Getting Started
To get started with the SKALE Bridge UI, users can visit the [SKALE Bridge UI](https://bridge.skale.network/) website and click on the "Connect wallet" button. Users can then connect their wallets and select the source and destination blockchains for their transfers.

## Development Setup
If you're interested in contributing to the SKALE Bridge UI, follow these steps to set up your development environment:

1. Clone the repository: `git clone --recurse-submodules https://github.com/skalenetwork/bridge-ui.git`
2. Install dependencies: `cd bridge-ui && yarn install`
3. Prepare metadata: `NETWORK_NAME=[SKALE NETWORK NAME - mainnet or staging] bash build.sh`
4. Start the development server: `yarn start`

The SKALE Interchain Bridge UI is built using the Create React App TypeScript template and uses [Metaport](https://github.com/skalenetwork/metaport) and [ima-js](https://github.com/skalenetwork/ima-js) libraries.

To contribute to the project, create a new branch with a descriptive name for your changes, make your changes, and submit a pull request.

## Security and Liability

The Bridge UI and code is WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

## License

![GitHub](https://img.shields.io/github/license/skalenetwork/bridge-ui.svg)

All contributions are made under the [GNU Lesser General Public License v3](https://www.gnu.org/licenses/lgpl-3.0.en.html). See [LICENSE](LICENSE).