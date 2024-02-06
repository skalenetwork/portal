import { type interfaces } from '@skalenetwork/metaport'

export const METAPORT_CONFIG: interfaces.MetaportConfig = {
  skaleNetwork: 'testnet',
  openOnLoad: true,
  openButton: true,
  debug: false,
  chains: [
    'mainnet',
    // 'juicy-low-small-testnet', // Europa
    // 'giant-half-dual-testnet', // Calypso
    // 'lanky-ill-funny-testnet', // Nebula
  ],
  tokens: {
    eth: {
      symbol: 'ETH'
    },
    skl: {
      decimals: '18',
      name: 'SKALE',
      symbol: 'SKL'
    },
    usdc: {
      decimals: '6',
      symbol: 'USDC',
      name: 'USD Coin'
    },
    usdt: {
      decimals: '6',
      symbol: 'USDT',
      name: 'Tether USD'
    },
    wbtc: {
      decimals: '8',
      symbol: 'WBTC',
      name: 'WBTC'
    },
    ruby: {
      name: 'Ruby Token',
      iconUrl: 'https://ruby.exchange/images/tokens/ruby-square.png',
      symbol: 'RUBY'
    },
    dai: {
      name: 'DAI Stablecoin',
      symbol: 'DAI'
    },
    usdp: {
      name: 'Pax Dollar',
      symbol: 'USDP',
      iconUrl: 'https://ruby.exchange/images/tokens/usdp-square.png'
    },
    hmt: {
      name: 'Human Token',
      symbol: 'HMT',
      iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/10347.png'
    },
    ubxs: {
      name: 'UBXS Token',
      symbol: 'UBXS',
      decimals: '6',
      iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/17242.png'
    }
  },
  connections: {
    mainnet: {
      eth: {
        eth: {
          chains: {
            'juicy-low-small-testnet': {},
            'giant-half-dual-testnet': {
              hub: 'juicy-low-small-testnet'
            }
          }
        }
      },
      erc20: {
        skl: {
          address: '0x',
          chains: {
            'juicy-low-small-testnet': {},
            'giant-half-dual-testnet': {
              hub: 'juicy-low-small-testnet'
            },
            'lanky-ill-funny-testnet': {
              hub: 'juicy-low-small-testnet'
            }
          }
        },
        ruby: {
          address: '0x',
          chains: {
            'juicy-low-small-testnet': {}
          }
        },
        dai: {
          address: '0x',
          chains: {
            'juicy-low-small-testnet': {}
          }
        },
        usdp: {
          address: '0x',
          chains: {
            'juicy-low-small-testnet': {}
          }
        },
        usdt: {
          address: '0x',
          chains: {
            'juicy-low-small-testnet': {}
          }
        },
        usdc: {
          address: '0x',
          chains: {
            'juicy-low-small-testnet': {},
            'giant-half-dual-testnet': {
              hub: 'juicy-low-small-testnet'
            },
            'lanky-ill-funny-testnet': {
              hub: 'juicy-low-small-testnet'
            }
          }
        },
        wbtc: {
          address: '0x',
          chains: {
            'juicy-low-small-testnet': {}
          }
        },
        hmt: {
          address: '0x',
          chains: {}
        },
        ubxs: {
          address: '0x',
          chains: {
            'juicy-low-small-testnet': {}
          }
        }
      },
      erc721meta: {
      },
      erc1155: {
      }
    },
    'giant-half-dual-testnet': {
      // Calypso connections
      eth: {
        eth: {
          address: '0x',
          chains: {
            'juicy-low-small-testnet': {
              clone: true
            },
            mainnet: {
              clone: true,
              hub: 'juicy-low-small-testnet'
            }
          }
        }
      },
      erc20: {
        skl: {
          address: '0x',
          chains: {
            'juicy-low-small-testnet': {
              clone: true
            },
            'lanky-ill-funny-testnet': {
              hub: 'juicy-low-small-testnet',
              clone: true
            },
            mainnet: {
              hub: 'juicy-low-small-testnet',
              clone: true
            }
          }
        },
        usdc: {
          address: '0x',
          chains: {
            'juicy-low-small-testnet': {
              clone: true
            },
            mainnet: {
              hub: 'juicy-low-small-testnet',
              clone: true
            }
          }
        }
      }
    },
    'lanky-ill-funny-testnet': { // nebula connections
      erc20: {
        skl: {
          address: '0x',
          chains: {
            'juicy-low-small-testnet': {
              clone: true
            },
            mainnet: {
              hub: 'juicy-low-small-testnet',
              clone: true
            },
            'giant-half-dual-testnet': {
              hub: 'juicy-low-small-testnet',
              clone: true
            }
          }
        },
        usdc: {
          address: '0x',
          chains: {
            'juicy-low-small-testnet': {
              clone: true
            },
            mainnet: {
              hub: 'juicy-low-small-testnet',
              clone: true
            }
          }
        }
      }
    },
    'juicy-low-small-testnet': {
      // Europa connections
      eth: {
        eth: {
          address: '0xD2Aaa00700000000000000000000000000000000',
          chains: {
            mainnet: {
              clone: true
            },
            'giant-half-dual-testnet': {
              wrapper: '0x'
            }
          }
        }
      },
      erc20: {
        skl: {
          address: '0x',
          chains: {
            mainnet: {
              clone: true
            },
            'giant-half-dual-testnet': {
              wrapper: '0x'
            },
            'lanky-ill-funny-testnet': {
              wrapper: '0x'
            }
          }
        },
        ruby: {
          address: '0x',
          chains: {
            mainnet: {
              clone: true
            }
          }
        },
        dai: {
          address: '0x',
          chains: {
            mainnet: {
              clone: true
            }
          }
        },
        usdp: {
          address: '0x',
          chains: {
            mainnet: {
              clone: true
            }
          }
        },
        usdt: {
          address: '0x',
          chains: {
            mainnet: {
              clone: true
            }
          }
        },
        usdc: {
          address: '0x',
          chains: {
            mainnet: {
              clone: true
            },
            'giant-half-dual-testnet': {
              wrapper: '0x'
            },
            'lanky-ill-funny-testnet': {
              wrapper: '0x'
            }
          }
        },
        wbtc: {
          address: '0x',
          chains: {
            mainnet: {
              clone: true
            }
          }
        },
        ubxs: {
          address: '0x',
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
    vibrant: true
  }
}
