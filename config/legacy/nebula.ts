import { type types } from '@/core'

const connections: types.mp.TokenTypeMap = {
    // Nebula connections
    eth: {
        eth: {
        address: '0x3903eD11A48F5022A148904d9626ACFe78D812C1',
        chains: {
            'international-villainous-zaurak': {
            clone: true
            },
            mainnet: {
            clone: true,
            hub: 'international-villainous-zaurak'
            }
        }
        }
    },
    erc20: {
        skl: {
        address: '0x1526881e947748Fac747d8fBf5820467A144b2a6',
        chains: {
            'international-villainous-zaurak': {
            clone: true
            },
            mainnet: {
            hub: 'international-villainous-zaurak',
            clone: true
            }
        }
        }
    }
}

export default connections