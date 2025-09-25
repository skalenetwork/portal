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
          'peaceful-outlying-ankaa': {
            wrapper: '0x9eCc5D8ceb51b95c9565D526114c11F03c122266'
          }
        }
      }
    },
    erc20: {
      skl: {
        address: '0xcB5C15235A1FFdb5e7CBBfFa6F28c42BCC998271',
        chains: {
          mainnet: {
            clone: true
          },
          'peaceful-outlying-ankaa': {
            wrapper: '0x39e633E57e8334730c665e641751AE08FE2d7b76'
          }
        }
      }
    }
  }


export default connections