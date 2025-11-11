import { type types } from '@/core'

export const METAPORT_CONFIG: types.mp.Config = {
  skaleNetwork: "base",
  mainnetEndpoint: 'https://base-rpc.publicnode.com/',
  openOnLoad: true,
  openButton: true,
  debug: false,

  chains: [
    'mainnet',
    'bold-ill-informed-jabbah'
  ],
  tokens: {
    eth: {
      symbol: 'ETH'
    },
    skl: {
      decimals: 18,
      name: 'SKALE',
      symbol: 'SKL'
    },
    usdc: {
      decimals: 6,
      symbol: 'USDC',
      name: 'USD Coin'
    },
    usdt: {
      decimals: 6,
      symbol: 'USDT',
      name: 'Tether USD'
    },
    wbtc: {
      decimals: 8,
      symbol: 'WBTC',
      name: 'Wrapped Bitcoin'
    },
    weth: {
      decimals: 18,
      symbol: 'WETH',
      name: 'Wrapped Ether',
      iconUrl: 'https://assets.coingecko.com/coins/images/2518/standard/weth.png?1696503332'
    },
    ntest: {
      decimals: 18,
      symbol: 'NTEST',
      name: 'Native Test Token',
      iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png'
    },
    axiosusd: {
      decimals: 6,
      symbol: 'AxiosUSD',
      name: 'Axios USD',
      iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png'
    }
  },

  connections: {
    mainnet: {
      eth: {
        eth: {
          chains: {
            'bold-ill-informed-jabbah': {}
          }
        }
      },
      erc20: {

      },
    },
    'jubilant-horrible-ancha': {
      eth: {
        eth: {
          address: '0xD2Aaa00700000000000000000000000000000000',
          chains: {
            mainnet: {
              clone: true
            }
          }
        }
      }
    }
  },
  theme: {
    mode: 'dark',
    vibrant: false,
    primary: '#93B8EC',
    background: '#000000',
  }
}

