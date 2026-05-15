import { type types } from '@/core'

export const METAPORT_CONFIG: types.mp.Config = {
  skaleNetwork: 'base',
  mainnetEndpoint: 'https://base-rpc.publicnode.com/',
  openOnLoad: true,
  openButton: true,
  debug: false,

  chains: [
    'mainnet',
    'winged-bubbly-grumium', // SKALE Base Mainnet
    'ext-mainnet',
    'ext-arbitrum',
    'ext-arbitrum-nova',
    'ext-op-mainnet',
    'ext-avalanche',
    'ext-bsc',
    'ext-polygon',
    'ext-monad',
    'ext-gnosis'
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
    'ext-bsc': {
      erc20: {
        usdc: {
          address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
          decimals: 18,
          chains: {
            'winged-bubbly-grumium': {
              bridge: 'trails'
            }
          }
        },
        usdt: {
          address: '0x55d398326f99059fF775485246999027B3197955',
          decimals: 18,
          chains: {
            'winged-bubbly-grumium': {
              bridge: 'trails'
            }
          }
        },
        weth: {
          address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
          chains: {
            'winged-bubbly-grumium': {
              bridge: 'trails'
            }
          }
        },
        wbtc: {
          address: '0x0555E30da8f98308EdB960aa94C0Db47230d2B9c',
          chains: {
            'winged-bubbly-grumium': {
              bridge: 'trails'
            }
          }
        }
      }
    },
    'ext-avalanche': {
      erc20: {
        usdc: {
          address: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
          chains: {
            'winged-bubbly-grumium': {
              bridge: 'trails'
            }
          }
        },
        usdt: {
          address: '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7',
          chains: {
            'winged-bubbly-grumium': {
              bridge: 'trails'
            }
          }
        },
        wbtc: {
          address: '0x50b7545627a5162F82A992c33b87aDc75187B218',
          chains: {
            'winged-bubbly-grumium': {
              bridge: 'trails'
            }
          }
        },
        weth: {
          address: '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB',
          chains: {
            'winged-bubbly-grumium': {
              bridge: 'trails'
            }
          }
        }
      }
    },
    'ext-polygon': {
      erc20: {
        usdc: {
          address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
          chains: {
            'winged-bubbly-grumium': {
              bridge: 'trails'
            }
          }
        },
        usdt: {
          address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
          chains: {
            'winged-bubbly-grumium': {
              bridge: 'trails'
            }
          }
        },
        wbtc: {
          address: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6',
          chains: {
            'winged-bubbly-grumium': {
              bridge: 'trails'
            }
          }
        },
        weth: {
          address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          chains: {
            'winged-bubbly-grumium': {
              bridge: 'trails'
            }
          }
        }
      }
    },
    'ext-monad': {
      erc20: {
        usdc: {
          address: '0x754704Bc059F8C67012fEd69BC8A327a5aafb603',
          chains: {
            'winged-bubbly-grumium': {
              bridge: 'trails'
            }
          }
        },
        wbtc: {
          address: '0x0555E30da8f98308EdB960aa94C0Db47230d2B9c',
          chains: {
            'winged-bubbly-grumium': {
              bridge: 'trails'
            }
          }
        }
      }
    },
    'ext-gnosis': {
      erc20: {
        usdc: {
          address: '0xddafbb505ad214d7b80b1f830fccc89b60fb7a83',
          chains: {
            'winged-bubbly-grumium': {
              bridge: 'trails'
            }
          }
        },
        usdt: {
          address: '0x4ECaBa5870353805a9F068101A40E0f32ed605C6',
          chains: {
            'winged-bubbly-grumium': {
              bridge: 'trails'
            }
          }
        },
        wbtc: {
          address: '0x8e5bBbb09Ed1ebdE8674Cda39A0c169401db4252',
          chains: {
            'winged-bubbly-grumium': {
              bridge: 'trails'
            }
          }
        },
        weth: {
          address: '0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1',
          chains: {
            'winged-bubbly-grumium': {
              bridge: 'trails'
            }
          }
        }
      }
    },
    'ext-arbitrum': {
      erc20: {
        usdc: {
          address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
          chains: {
            'winged-bubbly-grumium': {
              bridge: 'trails'
            }
          }
        },
        usdt: {
          address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
          chains: {
            'winged-bubbly-grumium': {
              bridge: 'trails'
            }
          }
        },
        wbtc: {
          address: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
          chains: {
            'winged-bubbly-grumium': {
              bridge: 'trails'
            }
          }
        },
        weth: {
          address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
          chains: {
            'winged-bubbly-grumium': {
              bridge: 'trails'
            }
          }
        }
      }
    },
    'ext-op-mainnet': {
      erc20: {
        usdc: {
          address: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
          chains: {
            'winged-bubbly-grumium': {
              bridge: 'trails'
            }
          }
        },
        usdt: {
          address: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
          chains: {
            'winged-bubbly-grumium': {
              bridge: 'trails'
            }
          }
        },
        wbtc: {
          address: '0x68f180fcCe6836688e9084f035309E29Bf0A2095',
          chains: {
            'winged-bubbly-grumium': {
              bridge: 'trails'
            }
          }
        },
        weth: {
          address: '0x4200000000000000000000000000000000000006',
          chains: {
            'winged-bubbly-grumium': {
              bridge: 'trails'
            }
          }
        }
      }
    },
    'ext-mainnet': {
      erc20: {
        usdc: {
          address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          chains: {
            'winged-bubbly-grumium': {
              bridge: 'trails'
            }
          }
        },
        usdt: {
          address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          chains: {
            'winged-bubbly-grumium': {
              bridge: 'trails'
            }
          }
        },
        weth: {
          address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          chains: {
            'winged-bubbly-grumium': {
              bridge: 'trails'
            }
          }
        },
        wbtc: {
          address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
          chains: {
            'winged-bubbly-grumium': {
              bridge: 'trails'
            }
          }
        }
      }
    },
    'ext-arbitrum-nova': {
      erc20: {
        usdc: {
          address: '0x750ba8b76187092B0D1E87E28daaf484d1b5273b',
          chains: {
            'winged-bubbly-grumium': {
              bridge: 'trails'
            }
          }
        },
        weth: {
          address: '0x722E8BdD2ce80A4422E880164f2079488e115365',
          chains: {
            'winged-bubbly-grumium': {
              bridge: 'trails'
            }
          }
        }
      }
    },
    mainnet: {
      eth: {
        eth: {
          chains: {
            'winged-bubbly-grumium': {},
          }
        }
      },
      erc20: {
        usdc: {
          address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
          chains: {
            'winged-bubbly-grumium': {},
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
            },
            'ext-mainnet': {
              bridge: 'trails'
            },
            'ext-arbitrum': {
              bridge: 'trails'
            },
            'ext-op-mainnet': {
              bridge: 'trails'
            },
            'ext-bsc': {
              bridge: 'trails'
            },
            'ext-avalanche': {
              bridge: 'trails'
            },
            'ext-polygon': {
              bridge: 'trails'
            },
            'ext-gnosis': {
              bridge: 'trails'
            }
          }
        },
        wbtc: {
          address: '0x1aeecfe5454c83b42d8a316246cac9739e7f690e',
          chains: {
            mainnet: {
              clone: true
            },
            'ext-mainnet': {
              bridge: 'trails'
            },
            'ext-arbitrum': {
              bridge: 'trails'
            },
            'ext-op-mainnet': {
              bridge: 'trails'
            },
            'ext-bsc': {
              bridge: 'trails'
            },
            'ext-avalanche': {
              bridge: 'trails'
            },
            'ext-polygon': {
              bridge: 'trails'
            },
            'ext-monad': {
              bridge: 'trails'
            },
            'ext-gnosis': {
              bridge: 'trails'
            }
          }
        },
        weth: {
          address: '0x7bd39abbd0dd13103542cae3276c7fa332bca486',
          chains: {
            mainnet: {
              clone: true
            },
            'ext-mainnet': {
              bridge: 'trails'
            },
            'ext-arbitrum': {
              bridge: 'trails'
            },
            'ext-arbitrum-nova': {
              bridge: 'trails'
            },
            'ext-op-mainnet': {
              bridge: 'trails'
            },
            'ext-bsc': {
              bridge: 'trails'
            },
            'ext-avalanche': {
              bridge: 'trails'
            },
            'ext-polygon': {
              bridge: 'trails'
            },
            'ext-gnosis': {
              bridge: 'trails'
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
            },
            'ext-mainnet': {
              bridge: 'trails'
            },
            'ext-arbitrum': {
              bridge: 'trails'
            },
            'ext-arbitrum-nova': {
              bridge: 'trails'
            },
            'ext-op-mainnet': {
              bridge: 'trails'
            },
            'ext-bsc': {
              bridge: 'trails'
            },
            'ext-avalanche': {
              bridge: 'trails'
            },
            'ext-polygon': {
              bridge: 'trails'
            },
            'ext-monad': {
              bridge: 'trails'
            },
            'ext-gnosis': {
              bridge: 'trails'
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
