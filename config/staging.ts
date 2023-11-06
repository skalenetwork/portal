import { type interfaces } from '@skalenetwork/metaport'

export const METAPORT_CONFIG: interfaces.MetaportConfig = {
  skaleNetwork: 'staging',
  openOnLoad: true,
  openButton: true,
  debug: false,
  chains: [
    'mainnet',
    'staging-legal-crazy-castor', // Europa
    'staging-utter-unripe-menkar', // Calypso
    'staging-faint-slimy-achird', // Nebula
    'staging-fast-active-bellatrix', // Chaos Testnet
  ],
  tokens: {
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
    _SPACE_1: {
      name: 'SKALE Space',
      symbol: 'SPACE',
      iconUrl:
        'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Rocket/3D/rocket_3d.png'
    },
    _SKALIENS_1: {
      name: 'SKALIENS Collection',
      symbol: 'SKALIENS',
      iconUrl:
        'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Alien/3D/alien_3d.png'
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
  connections: {
    mainnet: {
      eth: {
        eth: {
          chains: {
            'staging-legal-crazy-castor': {},
            'staging-utter-unripe-menkar': {
              hub: 'staging-legal-crazy-castor'
            }
          }
        }
      },
      erc20: {
        skl: {
          address: '0x493D4442013717189C9963a2e275Ad33bfAFcE11',
          chains: {
            'staging-legal-crazy-castor': {},
            'staging-utter-unripe-menkar': {
              hub: 'staging-legal-crazy-castor'
            },
            'staging-faint-slimy-achird': {
              hub: 'staging-legal-crazy-castor'
            }
          }
        },
        ruby: {
          address: '0xd66641E25E9D36A995682572eaD74E24C11Bb422',
          chains: {
            'staging-legal-crazy-castor': {}
          }
        },
        dai: {
          address: '0x83B38f79cFFB47CF74f7eC8a5F8D7DD69349fBf7',
          chains: {
            'staging-legal-crazy-castor': {}
          }
        },
        usdp: {
          address: '0x66259E472f8d09083ecB51D42F9F872A61001426',
          chains: {
            'staging-legal-crazy-castor': {}
          }
        },
        usdt: {
          address: '0xD1E44e3afd6d3F155e7704c67705E3bAC2e491b6',
          chains: {
            'staging-legal-crazy-castor': {}
          }
        },
        usdc: {
          address: '0x85dedAA65D33210E15911Da5E9dc29F5C93a50A9',
          chains: {
            'staging-legal-crazy-castor': {},
            'staging-utter-unripe-menkar': {
              hub: 'staging-legal-crazy-castor'
            },
            'staging-faint-slimy-achird': {
              hub: 'staging-legal-crazy-castor'
            }
          }
        },
        wbtc: {
          address: '0xd80BC0126A38c9F7b915e1B2B9f78280639cadb3',
          chains: {
            'staging-legal-crazy-castor': {}
          }
        },
        hmt: {
          address: '0x4058d058ff62ED347dB8a69c43Ae9C67268B50b0',
          chains: {}
        },
        ubxs: {
          address: '0x5A4957cc54B21e1fa72BA549392f213030d34804',
          chains: {
            'staging-legal-crazy-castor': {},
            'staging-fast-active-bellatrix': {
              hub: 'staging-legal-crazy-castor'
            }
          }
        }
      },
      erc721meta: {
        _SPACE_1: {
          address: '0x1b7729d7E1025A031aF9D6E68598b57f4C2adfF6',
          chains: {}
        }
      },
      erc1155: {
        _SKALIENS_1: {
          address: '0x6cb73D413970ae9379560aA45c769b417Fbf33D6',
          chains: {}
        }
      }
    },
    'staging-utter-unripe-menkar': {
      // Calypso connections
      eth: {
        eth: {
          address: '0xECabAE592Eb56D96115FcF4c7F772ADB7BF573d0',
          chains: {
            'staging-legal-crazy-castor': {
              clone: true
            },
            mainnet: {
              clone: true,
              hub: 'staging-legal-crazy-castor'
            }
          }
        }
      },
      erc20: {
        skl: {
          address: '0x7E1B8750C21AebC3bb2a0bDf40be104C609a9852',
          chains: {
            'staging-legal-crazy-castor': {
              clone: true
            },
            'staging-faint-slimy-achird': {
              hub: 'staging-legal-crazy-castor',
              clone: true
            },
            mainnet: {
              hub: 'staging-legal-crazy-castor',
              clone: true
            }
          }
        },
        usdc: {
          address: '0x49c37d0Bb6238933eEe2157e9Df417fd62723fF6',
          chains: {
            'staging-legal-crazy-castor': {
              clone: true
            },
            mainnet: {
              hub: 'staging-legal-crazy-castor',
              clone: true
            }
          }
        }
      }
    },
    'staging-fast-active-bellatrix': {
      // Chaos connections
      erc20: {
        ubxs: {
          address: '0xB430a748Af4Ed4E07BA53454a8247f4FA0da7484',
          chains: {
            mainnet: {
              clone: true,
              hub: 'staging-legal-crazy-castor'
            },
            'staging-legal-crazy-castor': {
              clone: true
            }
          }
        }
      }
    },
    'staging-faint-slimy-achird': { // nebula connections
      erc20: {
        skl: {
          address: '0x7F73B66d4e6e67bCdeaF277b9962addcDabBFC4d',
          chains: {
            'staging-legal-crazy-castor': {
              clone: true
            },
            mainnet: {
              hub: 'staging-legal-crazy-castor',
              clone: true
            },
            'staging-utter-unripe-menkar': {
              hub: 'staging-legal-crazy-castor',
              clone: true
            }
          }
        },
        usdc: {
          address: '0x717d43399ab3a8aada669CDC9560a6BAfdeA9796',
          chains: {
            'staging-legal-crazy-castor': {
              clone: true
            },
            mainnet: {
              hub: 'staging-legal-crazy-castor',
              clone: true
            }
          }
        }
      }
    },
    'staging-legal-crazy-castor': {
      // Europa connections
      eth: {
        eth: {
          address: '0xD2Aaa00700000000000000000000000000000000',
          chains: {
            mainnet: {
              clone: true
            },
            'staging-utter-unripe-menkar': {
              wrapper: '0xa270484784f043e159f74C03B691F80B6F6e3c24'
            }
          }
        }
      },
      erc20: {
        skl: {
          address: '0xbA1E9BA7CDd4815Da6a51586bE56e8643d1bEAb6',
          chains: {
            mainnet: {
              clone: true
            },
            'staging-utter-unripe-menkar': {
              wrapper: '0x6a679eF80aF3fE01A646F858Ca1e26D58b5430B6'
            },
            'staging-faint-slimy-achird': {
              wrapper: '0x6a679eF80aF3fE01A646F858Ca1e26D58b5430B6'
            }
          }
        },
        ruby: {
          address: '0xf06De9214B1Db39fFE9db2AebFA74E52f1e46e39',
          chains: {
            mainnet: {
              clone: true
            }
          }
        },
        dai: {
          address: '0x3595E2f313780cb2f23e197B8e297066fd410d30',
          chains: {
            mainnet: {
              clone: true
            }
          }
        },
        usdp: {
          address: '0xe0E2cb3A5d6f94a5bc2D00FAa3e64460A9D241E1',
          chains: {
            mainnet: {
              clone: true
            }
          }
        },
        usdt: {
          address: '0xa388F9783d8E5B0502548061c3b06bf4300Fc0E1',
          chains: {
            mainnet: {
              clone: true
            }
          }
        },
        usdc: {
          address: '0x5d42495D417fcd9ECf42F3EA8a55FcEf44eD9B33',
          chains: {
            mainnet: {
              clone: true
            },
            'staging-utter-unripe-menkar': {
              wrapper: '0x4f250cCE5b8B39caA96D1144b9A32E1c6a9f97b0'
            },
            'staging-faint-slimy-achird': {
              wrapper: '0x4f250cCE5b8B39caA96D1144b9A32E1c6a9f97b0'
            }
          }
        },
        wbtc: {
          address: '0xf5E880E1066DDc90471B9BAE6f183D5344fd289F',
          chains: {
            mainnet: {
              clone: true
            }
          }
        },
        ubxs: {
          address: '0xaB5149362daCcC086bC4ABDde80aB6b09cBc118E',
          chains: {
            mainnet: {
              clone: true
            },
            'staging-fast-active-bellatrix': {
              wrapper: '0x8e55e1Cc37ecA9636F4eF35874468876d52d623F'
            }
          }
        }
      }
    }
  },
  theme: {
    mode: 'dark',
    vibrant: true
  }
}
