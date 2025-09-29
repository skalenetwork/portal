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
        address: '0x7518a20B166614cD10b74be4833998875F1c8c5f',
        chains: {
          mainnet: {
            clone: true
          },
          'peaceful-outlying-ankaa': {
            wrapper: '0x039E133b96E4A6A4Df7be7BF6157D558793f4f06'
          }
        }
      }
    }
  }


export default connections