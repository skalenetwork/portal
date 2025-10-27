import { type types } from '@/core'

export const METAPORT_CONFIG: types.mp.Config = {
  skaleNetwork: "base-sepolia-testnet",
  mainnetEndpoint: 'https://base-rpc.publicnode.com',
  openOnLoad: true,
  openButton: true,
  debug: false,

  chains: [
    'mainnet',
    'skale-base-testnet'
  ],
  tokens: {
    eth: {
      symbol: 'ETH'
    }
  },

  connections: {
    mainnet: {
    }
  },
  theme: {
    mode: 'dark',
    vibrant: false,
    primary: '#93B8EC',
    background: '#000000',
  }
}

