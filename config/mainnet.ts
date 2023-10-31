import { type interfaces } from '@skalenetwork/metaport'

export const METAPORT_CONFIG: interfaces.MetaportConfig = {
  theme: {
    mode: 'dark',
    vibrant: true
  },
  mainnetEndpoint: 'https://cloudflare-eth.com/',
  skaleNetwork: "mainnet",
  openButton: true,
  openOnLoad: true,
  chains: [
    "mainnet",
    "honorable-steel-rasalhague", // calypso hub
    "elated-tan-skat", // europa hub
    "green-giddy-denebola", // nebula hub
    "wan-red-ain", // human protocol
  ],
  "tokens": {
    eth: {
      symbol: 'ETH'
    },
    skl: {
      decimals: '18',
      name: 'SKALE',
      symbol: 'SKL'
    },
    usdc: {
      decimals: '6',
      symbol: 'USDC',
      name: 'USD Coin'
    },
    usdt: {
      decimals: '6',
      symbol: 'USDT',
      name: 'Tether USD'
    },
    wbtc: {
      decimals: '18',
      symbol: 'WBTC',
      name: 'WBTC'
    },
    ruby: {
      name: 'Ruby Token',
      iconUrl: 'https://ruby.exchange/images/tokens/ruby-square.png',
      symbol: 'RUBY'
    },
    dai: {
      name: 'DAI Stablecoin',
      symbol: 'DAI'
    },
    usdp: {
      name: 'Pax Dollar',
      symbol: 'USDP',
      iconUrl: 'https://ruby.exchange/images/tokens/usdp-square.png'
    },
    hmt: {
      name: 'Human Token',
      symbol: 'HMT',
      iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/10347.png'
    },
    ubxs: {
      name: 'UBXS Token',
      symbol: 'UBXS',
      decimals: '6',
      iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/17242.png'
    }
  },
  "connections": {
    mainnet: {
      eth: {
        eth: {
          chains: {
            "elated-tan-skat": {}
          }
        }
      },
      erc20: {
        skl: {
          address: "0x00c83aeCC790e8a4453e5dD3B0B4b3680501a7A7",
          chains: {
            "elated-tan-skat": {},
            "honorable-steel-rasalhague": {
              hub: "elated-tan-skat"
            },
            "green-giddy-denebola": {
              hub: "elated-tan-skat"
            }
          }
        },
        usdc: {
          address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          chains: {
            "elated-tan-skat": {},
            "honorable-steel-rasalhague": {
              hub: "elated-tan-skat"
            },
            "green-giddy-denebola": {
              hub: "elated-tan-skat"
            }
          }
        },
        hmt: {
          address: "0xd1ba9BAC957322D6e8c07a160a3A8dA11A0d2867",
          chains: {
            "elated-tan-skat": {},
            "wan-red-ain": {
              "hub": "elated-tan-skat"
            }
          }
        }
      }
    },
    "elated-tan-skat": { // europa connections
      eth: {
        eth: {
          address: '0xD2Aaa00700000000000000000000000000000000',
          chains: {
            mainnet: {
              clone: true
            }
          }
        }
      },
      erc20: {
        skl: {
          address: "0xE0595a049d02b7674572b0d59cd4880Db60EDC50",
          chains: {
            "mainnet": {
              clone: true
            },
            "honorable-steel-rasalhague": {
              wrapper: "0xD162bB5c75FE99144295b03510bAb2DF99617440"
            },
            "green-giddy-denebola": {
              wrapper: "0xD162bB5c75FE99144295b03510bAb2DF99617440"
            }
          }
        },
        usdc: {
          address: "0x5F795bb52dAC3085f578f4877D450e2929D2F13d",
          chains: {
            "mainnet": {
              clone: true
            },
            "honorable-steel-rasalhague": {
              wrapper: "0x1c566a47e1baC535Ca616373146e3BE024F88Aa4"
            },
            "green-giddy-denebola": {
              wrapper: "0x1c566a47e1baC535Ca616373146e3BE024F88Aa4"
            }
          }
        },
        hmt: {
          address: "0xBE3530a3eDf9472693065041B8c9155C7FeCB8e5",
          chains: {
            "mainnet": {
              clone: true
            },
            "wan-red-ain": {
              wrapper: "0xA0f4D4db1457E442b83555cb92aaBB8DE959Aa75"
            }
          }
        }
      }
    },
    "honorable-steel-rasalhague": { // calypso connections
      erc20: {
        skl: {
          address: "0x4048C4dd6eccF1Dc23b068211fDf20AD19602e50",
          chains: {
            "elated-tan-skat": {
              clone: true
            },
            "mainnet": {
              clone: true,
              hub: "elated-tan-skat"
            }
          }
        },
        usdc: {
          address: "0x7Cf76E740Cb23b99337b21F392F22c47Ad910c67",
          chains: {
            "elated-tan-skat": {
              clone: true
            },
            "mainnet": {
              clone: true,
              hub: "elated-tan-skat"
            }
          }
        }
      }
    },
    "green-giddy-denebola": { // nebula connections
      erc20: {
        skl: {
          address: "0x7F73B66d4e6e67bCdeaF277b9962addcDabBFC4d",
          chains: {
            "elated-tan-skat": {
              clone: true
            },
            "mainnet": {
              clone: true,
              hub: "elated-tan-skat"
            }
          }
        },
        usdc: {
          address: "0xCC205196288B7A26f6D43bBD68AaA98dde97276d",
          chains: {
            "elated-tan-skat": {
              clone: true
            },
            "mainnet": {
              clone: true,
              hub: "elated-tan-skat"
            }
          }
        }
      }
    },
    "wan-red-ain": { // human connections
      erc20: {
        hmt: {
          address: "0x6E5FF61Ea88270F6142E0E0eC8cbe9d67476CbCd",
          chains: {
            "elated-tan-skat": {
              clone: true
            },
            "mainnet": {
              clone: true,
              hub: "elated-tan-skat"
            }
          }
        }
      }
    }
  }
}

