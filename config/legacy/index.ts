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
    'international-villainous-zaurak', // europa
    'peaceful-outlying-ankaa' // nebula
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
    'international-villainous-zaurak': europaConnections,
    'peaceful-outlying-ankaa': nebulaConnections,
    mainnet: {
      eth: {
        eth: {
          chains: {
            'international-villainous-zaurak': {},
            'peaceful-outlying-ankaa': {
              hub: 'international-villainous-zaurak'
            }
          }
        }
      },
      erc20: {
        skl: {
          address: '0x912a122fE382F0c531B622ff2A25dDc77bA25DE9',
          chains: {
            'international-villainous-zaurak': {},
            'peaceful-outlying-ankaa': {
              hub: 'international-villainous-zaurak'
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
