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
          'young-coarse-celaeno': {
            wrapper: '0xC3E554E49f0Ad593Cbdb7552B98a755f87EB0987'
          }
        }
      }
    },
    erc20: {
      skl: {
        address: '0xd0A604054e5322344eeA2A77E5d71c1167670d0f',
        chains: {
          mainnet: {
            clone: true
          },
          'young-coarse-celaeno': {
            wrapper: '0xd9271785E81f640CF1C9F6C43BF69607CECd1986'
          }
        }
      }
    }
  }


export default connections