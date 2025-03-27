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


export default connections