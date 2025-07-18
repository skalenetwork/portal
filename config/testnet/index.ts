import { type types } from '@/core'

export const METAPORT_CONFIG: types.mp.Config = {
  skaleNetwork: 'testnet',
  mainnetEndpoint: 'https://ethereum-hoodi-rpc.publicnode.com',
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
  },
  connections: {
    mainnet: {
      eth: {
        eth: {
          chains: {
            'juicy-low-small-testnet': {},
            'lanky-ill-funny-testnet': {
              hub: 'juicy-low-small-testnet'
            },
            'giant-half-dual-testnet': {
              hub: 'juicy-low-small-testnet'
            }
          }
        }
      },
      erc20: {
        skl: {
          address: '0x461145f2888B1b56a1ef5Ff6eE00d75a65fCc6F6',
          chains: {
            'juicy-low-small-testnet': {},
            'giant-half-dual-testnet': {
              hub: 'juicy-low-small-testnet'
            },
            'lanky-ill-funny-testnet': {
              hub: 'juicy-low-small-testnet'
            },
          }
        },
        usdc: {
          address: '0x0449f4Bf31f64f7C8A35332aFB091d0c51a22c8b',
          chains: {
            'juicy-low-small-testnet': {},
            'giant-half-dual-testnet': {
              hub: 'juicy-low-small-testnet'
            },
            'lanky-ill-funny-testnet': {
              hub: 'juicy-low-small-testnet'
            },
          }
        },
        usdt: {
          address: '0x88b4DA9D5044c33Ec8919D6E16395e0a50B79aA3',
          chains: {
            'juicy-low-small-testnet': {},
            'giant-half-dual-testnet': {
              hub: 'juicy-low-small-testnet'
            },
            'lanky-ill-funny-testnet': {
              hub: 'juicy-low-small-testnet'
            },
          }
        },
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
          address: '0x92561a12Ef92311c28d530210F0C4C712468461c',
          chains: {
            'juicy-low-small-testnet': {
              clone: true
            },
            'lanky-ill-funny-testnet': {
              clone: true,
              hub: 'juicy-low-small-testnet'
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
          address: '0x54C6c4bE7f1d1520C1bdDC07445601a5899EDD78',
          chains: {
            'juicy-low-small-testnet': {
              clone: true
            },
            'lanky-ill-funny-testnet': {
              clone: true,
              hub: 'juicy-low-small-testnet'
            },
            mainnet: {
              clone: true,
              hub: 'juicy-low-small-testnet'
            }
          }
        },
        usdc: {
          address: '0xbA9E8905F3c3C576f048eEbB3431ede0d5D27682',
          chains: {
            'juicy-low-small-testnet': {
              clone: true
            },
            'lanky-ill-funny-testnet': {
              clone: true,
              hub: 'juicy-low-small-testnet'
            },
            mainnet: {
              clone: true,
              hub: 'juicy-low-small-testnet'
            }
          }
        },
        usdt: {
          address: '0x4a4957e463439df0f9a32231884bd31b9C016C41',
          chains: {
            'juicy-low-small-testnet': {
              clone: true
            },
            'lanky-ill-funny-testnet': {
              clone: true,
              hub: 'juicy-low-small-testnet'
            },
            mainnet: {
              clone: true,
              hub: 'juicy-low-small-testnet'
            }
          }
        },
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
            'giant-half-dual-testnet': {
              clone: true,
              hub: 'juicy-low-small-testnet'
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
          address: '0xb7d990b996E1c639E16e459dDACCe64236C7796B',
          chains: {
            'juicy-low-small-testnet': {
              clone: true
            },
            'giant-half-dual-testnet': {
              clone: true,
              hub: 'juicy-low-small-testnet',
            },
            mainnet: {
              clone: true,
              hub: 'juicy-low-small-testnet',
            }
          }
        },
        usdc: {
          address: '0x6ab391237A6A207BBFa3648743260B02622303D2',
          chains: {
            'juicy-low-small-testnet': {
              clone: true
            },
            'giant-half-dual-testnet': {
              clone: true,
              hub: 'juicy-low-small-testnet',
            },
            mainnet: {
              clone: true,
              hub: 'juicy-low-small-testnet',
            }
          }
        },
        usdt: {
          address: '0x5A5fbF6e386C0c0Dbd962e7FA28C64f702f3F085',
          chains: {
            'juicy-low-small-testnet': {
              clone: true
            },
            'giant-half-dual-testnet': {
              clone: true,
              hub: 'juicy-low-small-testnet',
            },
            mainnet: {
              clone: true,
              hub: 'juicy-low-small-testnet',
            }
          }
        }
      }
    },
    'aware-fake-trim-testnet': { // titan connections
      erc20: {
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
            },
            'giant-half-dual-testnet': {
              wrapper: '0x7Dcc444B1B94ACcf24C39C2ff2C0465D640cFC3F'
            }
          }
        }
      },
      erc20: {
        skl: {
          address: '0xB9AcaEe79C46FFc102BA7E3fB057880A9301ac44',
          chains: {
            mainnet: {
              clone: true
            },
            'giant-half-dual-testnet': {
              wrapper: '0x9034bD74Dc574d4b68bA4a971463397cf6C404e0'
            },
            'lanky-ill-funny-testnet': {
              wrapper: '0x9034bD74Dc574d4b68bA4a971463397cf6C404e0'
            },
          }
        },
        usdc: {
          address: '0x9eAb55199f4481eCD7659540A17Af618766b07C4',
          chains: {
            mainnet: {
              clone: true
            },
            'giant-half-dual-testnet': {
              wrapper: '0x3748FB339ab9B53ba1a380DB1CE0221C62DA3c6f'
            },
            'lanky-ill-funny-testnet': {
              wrapper: '0x3748FB339ab9B53ba1a380DB1CE0221C62DA3c6f'
            },
          }
        },
        usdt: {
          address: '0xc841fbaF982cf4546a9f552EF37b134F2D87F6DB',
          chains: {
            mainnet: {
              clone: true
            },
            'giant-half-dual-testnet': {
              wrapper: '0xba03F5a1C216D7dC93624D5Ad82C92E2000b4787'
            },
            'lanky-ill-funny-testnet': {
              wrapper: '0xba03F5a1C216D7dC93624D5Ad82C92E2000b4787'
            },
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
  },
}