import { type types } from '@/core'
import europaConnections from './europa'
import nebulaConnections from './nebula'

export const METAPORT_CONFIG: types.mp.Config = {
  skaleNetwork: 'legacy',
  openOnLoad: true,
  openButton: true,
  debug: false,
  mainnetEndpoint: 'https://ethereum-holesky-rpc.publicnode.com',
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
      decimals: 18,
      name: 'SKALE',
      symbol: 'SKL'
    }
  },
  connections: {
    'these-long-sadalsuud': europaConnections,
    'adorable-quaint-bellatrix': nebulaConnections,
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
  },
  theme: {
    mode: 'dark',
    vibrant: true,
    primary: '#93B8EC',
    background: '#000000',
  },
}
