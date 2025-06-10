import { type types } from '@/core'

const connections: types.mp.TokenTypeMap = {
    erc20: {
        usdc: {
            address: '0x5ff56d3796cc17104de84365a00473232edddd9a',
            chains: {
                'elated-tan-skat': {
                    clone: true
                },
                mainnet: {
                    clone: true,
                    hub: 'elated-tan-skat'
                },
                'green-giddy-denebola': {
                    clone: true,
                    hub: 'elated-tan-skat'
                },
                'honorable-steel-rasalhague': {
                    clone: true,
                    hub: 'elated-tan-skat'
                }
            }
        }
    }
}

export default connections