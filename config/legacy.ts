import { type interfaces } from '@skalenetwork/metaport'

export const METAPORT_CONFIG: interfaces.MetaportConfig = {
  skaleNetwork: 'legacy',
  openOnLoad: true,
  openButton: true,
  debug: false,
  chains: [
    'mainnet',
    'skale-innocent-nasty', // europa
    'international-villainous-zaurak', // calypso
    'big-majestic-oval-SKALE' // qa chain
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
    trt: {
      decimals: '18',
      symbol: 'TRT',
      name: 'Turtle Coin',
      iconUrl: 'https://github.com/microsoft/fluentui-emoji/blob/main/assets/Turtle/3D/turtle_3d.png?raw=true'
    }
  },
  connections: {
    mainnet: {
      eth: {
        eth: {
          chains: {
            'skale-innocent-nasty': {},
            'international-villainous-zaurak': {
              hub: 'skale-innocent-nasty'
            }
          }
        }
      },
      erc20: {
        skl: {
          address: '0x17A7Cf31a11554e75246973663262dA56F84F89b',
          chains: {
            'skale-innocent-nasty': {},
            'international-villainous-zaurak': {
              hub: 'skale-innocent-nasty'
            }
          }
        },
        // usdc: {
        //   address: '0x85dedAA65D33210E15911Da5E9dc29F5C93a50A9',
        //   chains: {
        //     'skale-innocent-nasty': {},
        //     'international-villainous-zaurak': {
        //       hub: 'skale-innocent-nasty'
        //     }
        //   }
        // }
      }
    },
    'big-majestic-oval-SKALE': {
      erc20: {
        trt: {
          address: '0xbb2c9411079c6ddcd19c74e8442f77b70ae74267',
          chains: {
            'international-villainous-zaurak': {
              clone: true
            }
          }
        }
      }
    },
    'international-villainous-zaurak': {
      // Calypso connections
      eth: {
        eth: {
          address: '0x9C0e8bC2B2D403299214c80081F93fAB5e10b593',
          chains: {
            'skale-innocent-nasty': {
              clone: true
            },
            mainnet: {
              clone: true,
              hub: 'skale-innocent-nasty'
            }
          }
        }
      },
      erc20: {
        skl: {
          address: '0xFbbDF9aC97093b1E88aB79F7D0c296d9cc5eD0d0',
          chains: {
            'skale-innocent-nasty': {
              clone: true
            },
            mainnet: {
              hub: 'skale-innocent-nasty',
              clone: true
            }
          }
        },
        trt: {
          address: '0x45f7ca2ace063867e8e1378f0f2cfa86d8f591de',
          chains: {
            'big-majestic-oval-SKALE': {}
          }
        }

        // usdc: {
        //   address: '0x49c37d0Bb6238933eEe2157e9Df417fd62723fF6',
        //   chains: {
        //     'skale-innocent-nasty': {
        //       clone: true
        //     },
        //     mainnet: {
        //       hub: 'skale-innocent-nasty',
        //       clone: true
        //     }
        //   }
        // }
      }
    },
    'skale-innocent-nasty': {
      // Europa connections
      eth: {
        eth: {
          address: '0xD2Aaa00700000000000000000000000000000000',
          chains: {
            mainnet: {
              clone: true
            },
            'international-villainous-zaurak': {
              wrapper: '0x321e1aa81B4c6CC3B8EFe3D9c0AD67E6eC949c2c'
            }
          }
        }
      },
      erc20: {
        skl: {
          address: '0xa101902B3119f4830292bb79ebAB56967229207B',
          chains: {
            mainnet: {
              clone: true
            },
            'international-villainous-zaurak': {
              wrapper: '0x51A1eD016633Afb00C25Eb404745C61D8c16BBd4'
            }
          }
        },
        // usdc: {
        //   address: '0x5d42495D417fcd9ECf42F3EA8a55FcEf44eD9B33',
        //   chains: {
        //     mainnet: {
        //       clone: true
        //     },
        //     'international-villainous-zaurak': {
        //       wrapper: '0x4f250cCE5b8B39caA96D1144b9A32E1c6a9f97b0'
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
