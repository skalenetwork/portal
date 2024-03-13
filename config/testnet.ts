import { type interfaces } from '@skalenetwork/metaport'

export const METAPORT_CONFIG: interfaces.MetaportConfig = {
  skaleNetwork: 'testnet',
  openOnLoad: true,
  openButton: true,
  debug: false,
  chains: [
    'mainnet',
    'juicy-low-small-testnet', // Europa
    'giant-half-dual-testnet', // Calypso
    'lanky-ill-funny-testnet', // Nebula
    'aware-fake-trim-testnet' // Titan
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
            'lanky-ill-funny-testnet': {
              hub: 'juicy-low-small-testnet'
            }
            // 'giant-half-dual-testnet': {
            //   hub: 'juicy-low-small-testnet'
            // }
          }
        }
      },
      erc20: {
        // skl: {
        //   address: '0x',
        //   chains: {
        //     'juicy-low-small-testnet': {},
        //     'giant-half-dual-testnet': {
        //       hub: 'juicy-low-small-testnet'
        //     },
        //     'lanky-ill-funny-testnet': {
        //       hub: 'juicy-low-small-testnet'
        //     }
        //   }
        // },
        // ruby: {
        //   address: '0x',
        //   chains: {
        //     'juicy-low-small-testnet': {}
        //   }
        // },
        dai: {
          address: '0x366727B410fE55774C8b0B5b5A6E2d74199a088A',
          chains: {
            'juicy-low-small-testnet': {}
          }
        },
        usdp: {
          address: '0x30355486440774f5b01B0B69656A70d16A5771A6',
          chains: {
            'juicy-low-small-testnet': {}
          }
        },
        // usdt: {
        //   address: '0x',
        //   chains: {
        //     'juicy-low-small-testnet': {}
        //   }
        // },
        usdc: {
          address: '0xaB2F91FCc18B1271Ce10BF99e4a20b2652273803',
          chains: {
            'juicy-low-small-testnet': {},
            'giant-half-dual-testnet': {
              hub: 'juicy-low-small-testnet'
            },
            'lanky-ill-funny-testnet': {
              hub: 'juicy-low-small-testnet'
            },
            'aware-fake-trim-testnet': {
              hub: 'juicy-low-small-testnet'
            }
          }
        },
        // wbtc: {
        //   address: '0x',
        //   chains: {
        //     'juicy-low-small-testnet': {}
        //   }
        // },
        // hmt: {
        //   address: '0x',
        //   chains: {}
        // },
        // ubxs: {
        //   address: '0x',
        //   chains: {
        //     'juicy-low-small-testnet': {}
        //   }
        // }
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
        // skl: {
        //   address: '0x',
        //   chains: {
        //     'juicy-low-small-testnet': {
        //       clone: true
        //     },
        //     'lanky-ill-funny-testnet': {
        //       hub: 'juicy-low-small-testnet',
        //       clone: true
        //     },
        //     mainnet: {
        //       hub: 'juicy-low-small-testnet',
        //       clone: true
        //     }
        //   }
        // },
        usdc: {
          address: '0x2aebcdc4f9f9149a50422fff86198cb0939ea165',
          chains: {
            'juicy-low-small-testnet': {
              clone: true
            },
            'aware-fake-trim-testnet': {
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
      eth: {
        eth: {
          address: '0x319f0eeb1a1e59943ebe44f766dbb592db664cf0',
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
        // skl: {
        //   address: '0x',
        //   chains: {
        //     'juicy-low-small-testnet': {
        //       clone: true
        //     },
        //     mainnet: {
        //       hub: 'juicy-low-small-testnet',
        //       clone: true
        //     },
        //     'giant-half-dual-testnet': {
        //       hub: 'juicy-low-small-testnet',
        //       clone: true
        //     }
        //   }
        // },
        usdc: {
          address: '0x5eaf4e5a908ba87abf3de768cb0da517db45db48',
          chains: {
            'juicy-low-small-testnet': {
              clone: true
            },
            'aware-fake-trim-testnet': {
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
    'aware-fake-trim-testnet': { // titan connections
      erc20: {
        usdc: {
          address: '0x10a30e73ab2da5328fc09b06443dde3e656e82f4',
          chains: {
            'juicy-low-small-testnet': {
              clone: true
            },
            'lanky-ill-funny-testnet': {
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
            'lanky-ill-funny-testnet': {
              wrapper: '0x7Dcc444B1B94ACcf24C39C2ff2C0465D640cFC3F'
            }
          }
        }
      },
      erc20: {
        // skl: {
        //   address: '0x',
        //   chains: {
        //     mainnet: {
        //       clone: true
        //     },
        //     'giant-half-dual-testnet': {
        //       wrapper: '0x'
        //     },
        //     'lanky-ill-funny-testnet': {
        //       wrapper: '0x'
        //     }
        //   }
        // },
        // ruby: {
        //   address: '0x',
        //   chains: {
        //     mainnet: {
        //       clone: true
        //     }
        //   }
        // },
        dai: {
          address: '0x7aE734db73c57F3D16f5F141BAf6CfABD9E693bf',
          chains: {
            mainnet: {
              clone: true
            }
          }
        },
        usdp: {
          address: '0xbEE0FB0C095405A17c079Cd5C3cc89525e5A9a8C',
          chains: {
            mainnet: {
              clone: true
            }
          }
        },
        // usdt: {
        //   address: '0x',
        //   chains: {
        //     mainnet: {
        //       clone: true
        //     }
        //   }
        // },
        usdc: {
          address: '0x6CE77Fc7970F6984eF3E8748A3826972Ec409Fb9',
          chains: {
            mainnet: {
              clone: true
            },
            'giant-half-dual-testnet': {
              wrapper: '0xa6be26f2914a17fc4e8d21a1ce2ec4079eeb990c'
            },
            'lanky-ill-funny-testnet': {
              wrapper: '0xa6be26f2914a17fc4e8d21a1ce2ec4079eeb990c'
            },
            'aware-fake-trim-testnet': {
              wrapper: '0xa6be26f2914a17fc4e8d21a1ce2ec4079eeb990c'
            }
          }
        },
        // wbtc: {
        //   address: '0x',
        //   chains: {
        //     mainnet: {
        //       clone: true
        //     }
        //   }
        // },
        // ubxs: {
        //   address: '0x',
        //   chains: {
        //     mainnet: {
        //       clone: true
        //     }
        //   }
        // }
      }
    }
  },
  theme: {
    mode: 'dark',
    vibrant: true
  }
}
