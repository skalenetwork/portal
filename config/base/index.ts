import { type types } from '@/core'

export const METAPORT_CONFIG: types.mp.Config = {
  skaleNetwork: 'base',
  mainnetEndpoint: 'https://base-rpc.publicnode.com/',
  openOnLoad: true,
  openButton: true,
  debug: false,

  chains: [
    'mainnet',
    'winged-bubbly-grumium' // SKALE Base Mainnet
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
    }
  },

  connections: {
    mainnet: {
      eth: {
        eth: {
          chains: {
            'winged-bubbly-grumium': {}
          }
        }
      },
      erc20: {
        usdc: {
          address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
          chains: {
            'winged-bubbly-grumium': {}
          }
        },
        skl: {
          address: '0xb49A02585E2BeB912027D8876DC1cdbE8F97C1A3',
          chains: {
            'winged-bubbly-grumium': {}
          }
        },
        usdt: {
          address: '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2',
          chains: {
            'winged-bubbly-grumium': {}
          }
        },
        wbtc: {
          address: '0x0555E30da8f98308EdB960aa94C0Db47230d2B9c',
          chains: {
            'winged-bubbly-grumium': {}
          }
        },
        weth: {
          address: '0x4200000000000000000000000000000000000006',
          chains: {
            'winged-bubbly-grumium': {}
          }
        }
      }
    },
    'winged-bubbly-grumium': {
      eth: {
        eth: {
          address: '0xD2Aaa00700000000000000000000000000000000',
          chains: {
            mainnet: {
              clone: true
            }
          }
        }
      },
      erc20: {
        usdt: {
          address: '0x2bf5bf154b515eaa82c31a65ec11554ff5af7fca',
          chains: {
            mainnet: {
              clone: true
            }
          }
        },
        wbtc: {
          address: '0x1aeecfe5454c83b42d8a316246cac9739e7f690e',
          chains: {
            mainnet: {
              clone: true
            }
          }
        },
        weth: {
          address: '0x7bd39abbd0dd13103542cae3276c7fa332bca486',
          chains: {
            mainnet: {
              clone: true
            }
          }
        },
        skl: {
          address: '0x9710566Cb041bD4cDa6CB24336bc887221d11a6e',
          chains: {
            mainnet: {
              clone: true
            }
          }
        },
        usdc: {
          address: '0x85889c8c714505E0c94b30fcfcF64fE3Ac8FCb20',
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
    background: '#000000'
  }
}
