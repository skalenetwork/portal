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
        address: '0xC11Ba472327Bc1A235c67c12035D7e1B5A7AA9a3',
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