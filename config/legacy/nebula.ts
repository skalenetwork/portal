import { type types } from '@/core'

const connections: types.mp.TokenTypeMap = {
    // Nebula connections
    eth: {
        eth: {
        address: '0xa2b496C018ea6cE6f44bA4366d9970CFfec89D6e',
        chains: {
            'honored-impish-wezen': {
            clone: true
            },
            mainnet: {
            clone: true,
            hub: 'honored-impish-wezen'
            }
        }
        }
    },
    erc20: {
        skl: {
        address: '0x9EcD93c2cF9E551B3B02939c72D3F515A8cb76B0',
        chains: {
            'honored-impish-wezen': {
            clone: true
            },
            mainnet: {
            hub: 'honored-impish-wezen',
            clone: true
            }
        }
        }
    }
}

export default connections