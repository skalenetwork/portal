import { type types } from '@/core'

const connections: types.mp.TokenTypeMap = {
    // Europa connections
    eth: {
      eth: {
        address: '0xD2Aaa00700000000000000000000000000000000',
        chains: {
          mainnet: {
            clone: true
          },
          'overcooked-profuse-gienah-cygni': {
            wrapper: '0x4576157B8fc0Ea0a51E9606f578d3ed221764040'
          }
        }
      }
    },
    erc20: {
      skl: {
        address: '0x423C6ffDe8a83787B48B22Db4d3283386085390b',
        chains: {
          mainnet: {
            clone: true
          },
          'overcooked-profuse-gienah-cygni': {
            wrapper: '0xDD62FCbB11D660Ce49782660D22174D491be6E90'
          }
        }
      }
    }
  }


export default connections