import { type types } from '@/core'
import mainnetConnections from './mainnet'
import europaConnections from './europa'
import calypsoConnections from './calypso'
import nebulaConnections from './nebula'
import titanConnections from './titan'

export const METAPORT_CONFIG: types.mp.Config = {
  theme: {
    mode: 'dark',
    vibrant: false,
    primary: '#93B8EC',
    background: '#000000'
  },
  mainnetEndpoint: 'https://cloudflare-eth.com/',
  skaleNetwork: 'mainnet',
  openButton: true,
  openOnLoad: true,
  chains: [
    'mainnet',
    'elated-tan-skat', // europa hub
    'honorable-steel-rasalhague', // calypso hub
    'green-giddy-denebola', // nebula hub
    'affectionate-immediate-pollux', // cryptoblades
    'wan-red-ain', // human protocol
    'turbulent-unique-scheat', // razor
    'adorable-quaint-bellatrix', // streammyscreen
    'parallel-stormy-spica' // titan hub
  ],
  tokens: {
    eth: {
      symbol: 'ETH'
    },
    skl: {
      decimals: 18,
      name: 'SKALE',
      symbol: 'SKL'
    },
    usdc: {
      decimals: 6,
      symbol: 'USDC',
      name: 'USD Coin'
    },
    usdt: {
      decimals: 6,
      symbol: 'USDT',
      name: 'Tether USD'
    },
    wbtc: {
      decimals: 8,
      symbol: 'WBTC',
      name: 'WBTC'
    },
    ruby: {
      name: 'Ruby Token',
      iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/15219.png',
      symbol: 'RUBY'
    },
    dai: {
      name: 'DAI Stablecoin',
      symbol: 'DAI'
    },
    usdp: {
      name: 'Pax Dollar',
      symbol: 'USDP',
      iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3330.png'
    },
    hmt: {
      name: 'Human Token',
      symbol: 'HMT',
      iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/10347.png'
    },
    razor: {
      decimals: 18,
      name: 'RAZOR Network',
      symbol: 'RAZOR',
      iconUrl: 'https://assets.coingecko.com/coins/images/13797/small/icon.png'
    },
    skill: {
      name: 'SKILL',
      symbol: 'SKILL',
      iconUrl: 'https://assets.coingecko.com/coins/images/15334/standard/cryptoblade.PNG?1696514982'
    },
    sushi: {
      name: 'SUSHI',
      symbol: 'SUSHI'
    },
    cmps: {
      name: 'Compass',
      symbol: 'CMPS',
      iconUrl: 'https://assets.coingecko.com/coins/images/38439/standard/CompassLogo.png'
    },
    exd: {
      name: 'Exorde',
      symbol: 'EXD',
      iconUrl: 'https://assets.coingecko.com/coins/images/28684/standard/logo-exorde.png'
    },
    hmkr: {
      name: 'Hitmakr',
      decimals: 9,
      symbol: 'HMKR',
      iconUrl: 'https://assets.coingecko.com/coins/images/36660/standard/HITMAKR_logo.png'
    },
    paxg: {
      name: 'PAX Gold',
      symbol: 'PAXG',
      iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4705.png'
    },
    link: {
      name: 'ChainLink Token',
      symbol: 'LINK'
    },
    pepe: {
      name: 'Pepe',
      symbol: 'PEPE',
      iconUrl: 'https://assets.coingecko.com/coins/images/29850/standard/pepe-token.jpeg'
    },
    cgt: {
      name: 'Curio Gas Token',
      symbol: 'CGT',
      iconUrl:
        'https://assets.coingecko.com/coins/images/37476/standard/Screenshot_2024-05-04_004346.png'
    },
    wct1: {
      name: 'Wrapped Car Token 1',
      symbol: 'wCT1',
      iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/12648.png',
      decimals: 2
    },
    flag: {
      name: 'FLAG',
      iconUrl: 'https://assets.coingecko.com/coins/images/20726/standard/token_logo.ico',
      symbol: 'FLAG',
    },
    reth: {
      name: 'Rocket Pool ETH',
      iconUrl: 'https://assets.coingecko.com/coins/images/20764/standard/reth.png',
      symbol: 'rETH'
    },
    skivvy: {
      name: 'Skivvy',
      symbol: 'SKIVVY',
      decimals: 8,
      iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3441.png'
    },
    unipoly: {
      name: 'Unipoly',
      symbol: 'UNP',
      iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/28735.png'
    }
  },
  connections: {
    mainnet: mainnetConnections,
    'elated-tan-skat': europaConnections,
    'honorable-steel-rasalhague': calypsoConnections,
    'green-giddy-denebola': nebulaConnections,
    'parallel-stormy-spica': titanConnections,
    'affectionate-immediate-pollux': {
      erc20: {
        skl: {
          address: '0x9FeF16c2Fe0dCB261cfD39e0B618c69A73feB3FE',
          chains: {
            'elated-tan-skat': {
              clone: true
            },
            mainnet: {
              clone: true,
              hub: 'elated-tan-skat'
            }
          }
        },
        skill: {
          address: '0x5F6E97612482095C0c2C02BC495C0171e61017d7',
          chains: {
            'elated-tan-skat': {}
          }
        }
      }
    },
    'wan-red-ain': {
      erc20: {
        hmt: {
          address: '0x6E5FF61Ea88270F6142E0E0eC8cbe9d67476CbCd',
          chains: {
            'elated-tan-skat': {
              clone: true
            },
            mainnet: {
              clone: true,
              hub: 'elated-tan-skat'
            }
          }
        }
      }
    },
    'turbulent-unique-scheat': {
      erc20: {
        razor: {
          address: '0xcbf70914Fae03B3acB91E953De60CfDAaCA8145f',
          chains: {
            mainnet: {
              clone: true
            }
          }
        }
      }
    },
    'adorable-quaint-bellatrix': {
      eth: {
        eth: {
          address: '0xD2Aaa00700000000000000000000000000000000',
          chains: {
            mainnet: {
              clone: true
            }
          }
        }
      }
    }
  }
}
