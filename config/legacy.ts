import { type types } from '@/core'

export const METAPORT_CONFIG: types.mp.Config = {
  skaleNetwork: 'legacy',
  openOnLoad: true,
  openButton: true,
  debug: false,
  chains: [
    'mainnet',
    'these-long-sadalsuud', // europa
    'adorable-quaint-bellatrix', // nebula
    'spanish-smug-auva' // calypso
  ],
  tokens: {
    eth: {
      symbol: 'ETH'
    },
    skl: {
      decimals: '18',
      name: 'SKALE',
      symbol: 'SKL'
    }
  },
  connections: {
    mainnet: {
      eth: {
        eth: {
          chains: {
            'these-long-sadalsuud': {},
            'adorable-quaint-bellatrix': {
              hub: 'these-long-sadalsuud'
            }
          }
        }
      },
      erc20: {
        skl: {
          address: '0x0E53fDa415cc6b2a7D9495D4a1F0659F0Ee45e0d',
          chains: {
            'these-long-sadalsuud': {},
            'adorable-quaint-bellatrix': {
              hub: 'these-long-sadalsuud'
            }
          }
        }
      }
    },
    'spanish-smug-auva': {
      erc20: {
      }
    },
    'adorable-quaint-bellatrix': {
      // Nebula connections
      eth: {
        eth: {
          address: '0x9C0e8bC2B2D403299214c80081F93fAB5e10b593',
          chains: {
            'these-long-sadalsuud': {
              clone: true
            },
            mainnet: {
              clone: true,
              hub: 'these-long-sadalsuud'
            }
          }
        }
      },
      erc20: {
        skl: {
          address: '0xFbbDF9aC97093b1E88aB79F7D0c296d9cc5eD0d0',
          chains: {
            'these-long-sadalsuud': {
              clone: true
            },
            mainnet: {
              hub: 'these-long-sadalsuud',
              clone: true
            }
          }
        }
      }
    },
    'these-long-sadalsuud': {
      // Europa connections
      eth: {
        eth: {
          address: '0xD2Aaa00700000000000000000000000000000000',
          chains: {
            mainnet: {
              clone: true
            },
            'adorable-quaint-bellatrix': {
              wrapper: '0x3a830008c24300Dd8F469EBFEd13E4854409440D'
            }
          }
        }
      },
      erc20: {
        skl: {
          address: '0xDeCcD09457Bd23c4CDD3C6E07a00053Ff54869dd',
          chains: {
            mainnet: {
              clone: true
            },
            'adorable-quaint-bellatrix': {
              wrapper: '0xEc656cc30205479C5DAa3aDac7b4D9d0fe0FDc51'
            }
          }
        }
      }
    }
  },
  theme: {
    mode: 'dark',
    vibrant: true,
    primary: '#93B8EC',
    background: '#000000',
  },
}
