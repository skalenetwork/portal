import { type types } from '@/core'
import europaConnections from './europa'
import nebulaConnections from './nebula'

export const METAPORT_CONFIG: types.mp.Config = {
  skaleNetwork: 'legacy',
  openOnLoad: true,
  openButton: true,
  debug: false,
  mainnetEndpoint: 'https://ethereum-hoodi-rpc.publicnode.com',
  chains: [
    'mainnet',
    'talkative-victorious-rasalgethi', // europa
    'overcooked-profuse-gienah-cygni' // nebula
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
    'talkative-victorious-rasalgethi': europaConnections,
    'overcooked-profuse-gienah-cygni': nebulaConnections,
    mainnet: {
      eth: {
        eth: {
          chains: {
            'talkative-victorious-rasalgethi': {},
            'overcooked-profuse-gienah-cygni': {
              hub: 'talkative-victorious-rasalgethi'
            }
          }
        }
      },
      erc20: {
        skl: {
          address: '0x912a122fE382F0c531B622ff2A25dDc77bA25DE9',
          chains: {
            'talkative-victorious-rasalgethi': {},
            'overcooked-profuse-gienah-cygni': {
              hub: 'talkative-victorious-rasalgethi'
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
    vibrant: false,
    primary: '#93B8EC',
    background: '#000000',
  },
}
