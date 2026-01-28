import { type types } from '@/core'

export const METAPORT_CONFIG: types.mp.Config = {
  skaleNetwork: 'base-sepolia-testnet',
  mainnetEndpoint: 'https://base-sepolia-rpc.publicnode.com/',
  openOnLoad: true,
  openButton: true,
  debug: false,

  chains: [
    'mainnet',
    'jubilant-horrible-ancha'
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
            'jubilant-horrible-ancha': {}
          }
        }
      },
      erc20: {
        skl: {
          address: '0xBeBb7CA7D7FFB39ad2d87C51c742E29B3C12C2b2',
          chains: {
            'jubilant-horrible-ancha': {}
          }
        },
        usdc: {
          address: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
          chains: {
            'jubilant-horrible-ancha': {}
          }
        },
        usdt: {
          address: '0x0eda7df37785f570560dA74ceCFD435AB60D84a8',
          chains: {
            'jubilant-horrible-ancha': {}
          }
        },
        wbtc: {
          address: '0xC3893AEC98b41c198A11AcD9db17688D858588Bc',
          chains: {
            'jubilant-horrible-ancha': {}
          }
        },
        weth: {
          address: '0x4200000000000000000000000000000000000006',
          chains: {
            'jubilant-horrible-ancha': {}
          }
        },
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
      },
      erc20: {
        usdt: {
          address: '0x3ca0a49f511c2c89c4dcbbf1731120d8919050bf',
          chains: {
            mainnet: {
              clone: true
            }
          }
        },
        wbtc: {
          address: '0x4512eacd4186b025186e1cf6cc0d89497c530e87',
          chains: {
            mainnet: {
              clone: true
            }
          }
        },
        weth: {
          address: '0xf94056bd7f6965db3757e1b145f200b7346b4fc0',
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
          address: '0x2e08028E3C4c2356572E096d8EF835cD5C6030bD',
          chains: {
            mainnet: {
              clone: true
            }
          }
        },
        axiosusd: {
          address: '0x61a26022927096f444994dA1e53F0FD9487EAfcf',
          chains: {
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

