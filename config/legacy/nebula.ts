import { type types } from '@/core'

const connections: types.mp.TokenTypeMap = {
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
}

export default connections