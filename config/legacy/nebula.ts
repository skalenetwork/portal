import { type types } from '@/core'

const connections: types.mp.TokenTypeMap = {
    // Nebula connections
    eth: {
        eth: {
        address: '0x19faa73826fBd204Cb8323ef5a7f78EB9C838f97',
        chains: {
            'talkative-victorious-rasalgethi': {
            clone: true
            },
            mainnet: {
            clone: true,
            hub: 'talkative-victorious-rasalgethi'
            }
        }
        }
    },
    erc20: {
        skl: {
        address: '0xb33ED61afDD4e378ECE6dF97AaA41F8E207f43cA',
        chains: {
            'talkative-victorious-rasalgethi': {
            clone: true
            },
            mainnet: {
            hub: 'talkative-victorious-rasalgethi',
            clone: true
            }
        }
        }
    }
}

export default connections