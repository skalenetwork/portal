import { type types } from '@/core'

export const METAPORT_CONFIG: types.mp.Config = {
	skaleNetwork: 'testnet',
	mainnetEndpoint: 'https://ethereum-holesky-rpc.publicnode.com',
	openOnLoad: true,
	openButton: true,
	debug: false,
	chains: [
		'mainnet',
		'juicy-low-small-testnet', // Europa
		'giant-half-dual-testnet', // Calypso
		'lanky-ill-funny-testnet', // Nebula
		'aware-fake-trim-testnet' // Titan
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
			decimals: 6,
			iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/17242.png'
		},
		trc: {
			name: "TheRealCoin",
			symbol: "TRC"
		},
		skivvy: {
			name: 'Skivvy',
			symbol: '$SKIVVY',
			decimals: 8,
			iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3441.png'
		},
		unp: {
			name: 'Unipoly Coin',
			symbol: 'UNP',
			iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/28735.png'
		},
		axgt: {
			name: "AxonDAO Governance Token",
			symbol: "AXGT",
			iconUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/29557.png"
		}
	},
	connections: {
		mainnet: {
			eth: {
				eth: {
					chains: {
						'juicy-low-small-testnet': {},
						'lanky-ill-funny-testnet': {
							hub: 'juicy-low-small-testnet'
						},
						'giant-half-dual-testnet': {
							hub: 'juicy-low-small-testnet'
						}
					}
				}
			},
			erc20: {
				dai: {
					address: '0x366727B410fE55774C8b0B5b5A6E2d74199a088A',
					chains: {
						'juicy-low-small-testnet': {}
					}
				},
				skl: {
					address: '0x1b662EB5624f6B2BB46d384DB9ab7F09AF15C84A',
					chains: {
						'juicy-low-small-testnet': {},
						'giant-half-dual-testnet': {
							hub: 'juicy-low-small-testnet'
						},
						'lanky-ill-funny-testnet': {
							hub: 'juicy-low-small-testnet'
						},
						'aware-fake-trim-testnet': {
							hub: 'juicy-low-small-testnet'
						}
					}
				},
				trc: {
					address: '0x9536285e9fDb702517b1158A4da48420e7BE250e',
					chains: {
						'juicy-low-small-testnet': {}
					}
				},
				usdp: {
					address: '0x30355486440774f5b01B0B69656A70d16A5771A6',
					chains: {
						'juicy-low-small-testnet': {}
					}
				},
				usdc: {
					address: '0xaB2F91FCc18B1271Ce10BF99e4a20b2652273803',
					chains: {
						'juicy-low-small-testnet': {},
						'giant-half-dual-testnet': {
							hub: 'juicy-low-small-testnet'
						},
						'lanky-ill-funny-testnet': {
							hub: 'juicy-low-small-testnet'
						},
						'aware-fake-trim-testnet': {
							hub: 'juicy-low-small-testnet'
						}
					}
				},
				skivvy: {
					address: '0xBD7A80706f48680AfA1770fd332486e9b6354f62',
					chains: {
						'juicy-low-small-testnet': {},
						'giant-half-dual-testnet': {
							hub: 'juicy-low-small-testnet'
						}
					}
				},
				unp: {
					address: '0xdB025eDa639AC08e27bFB899c3E040fFFF817e47',
					chains: {
						'juicy-low-small-testnet': {},
						'lanky-ill-funny-testnet': {
							hub: 'juicy-low-small-testnet'
						}
					}
				},
				axgt: {
					address: '0xf33ddcbda56218253de2cf8008db21855acf3dd3',
					chains: {
						'giant-half-dual-testnet': {}
					}
				},
			},
			erc721meta: {
			},
			erc1155: {
			}
		},
		'giant-half-dual-testnet': {
			// Calypso connections
			eth: {
				eth: {
					address: '0x92561a12Ef92311c28d530210F0C4C712468461c',
					chains: {
						'juicy-low-small-testnet': {
							clone: true
						},
						mainnet: {
							clone: true,
							hub: 'juicy-low-small-testnet'
						}
					}
				}
			},
			erc20: {
				usdc: {
					address: '0x2aebcdc4f9f9149a50422fff86198cb0939ea165',
					chains: {
						'juicy-low-small-testnet': {
							clone: true
						},
						'aware-fake-trim-testnet': {
							clone: true
						},
						mainnet: {
							hub: 'juicy-low-small-testnet',
							clone: true
						}
					}
				},
				skivvy: {
					address: '0x872D4a13f9D87681b36Ec7179651B573480C1c8E',
					chains: {
						'juicy-low-small-testnet': {
							clone: true
						},
						mainnet: {
							hub: 'juicy-low-small-testnet',
							clone: true
						}
					}
				},
				axgt: {
					address: "0x98df75EDB9609A97773297D0B7c6Ce522429aA07",
					chains: {
						mainnet: {
							clone: true
						}
					}
				}
			}
		},
		'lanky-ill-funny-testnet': { // nebula connections
			eth: {
				eth: {
					address: '0x319f0eeb1a1e59943ebe44f766dbb592db664cf0',
					chains: {
						'juicy-low-small-testnet': {
							clone: true
						},
						mainnet: {
							clone: true,
							hub: 'juicy-low-small-testnet'
						}
					}
				}
			},
			erc20: {
				usdc: {
					address: '0x5eaf4e5a908ba87abf3de768cb0da517db45db48',
					chains: {
						'juicy-low-small-testnet': {
							clone: true
						},
						'aware-fake-trim-testnet': {
							clone: true
						},
						mainnet: {
							hub: 'juicy-low-small-testnet',
							clone: true
						}
					}
				},
				unp: {
					address: '0xb22020Ec2C92e2ca043aC5172747c529a79abF92',
					chains: {
						'juicy-low-small-testnet': {
							clone: true
						},
						mainnet: {
							hub: 'juicy-low-small-testnet',
							clone: true
						}
					}
				}
			}
		},
		'aware-fake-trim-testnet': { // titan connections
			erc20: {
				usdc: {
					address: '0x10a30e73ab2da5328fc09b06443dde3e656e82f4',
					chains: {
						'juicy-low-small-testnet': {
							clone: true
						},
						'lanky-ill-funny-testnet': {
							clone: true
						},
						mainnet: {
							hub: 'juicy-low-small-testnet',
							clone: true
						}
					}
				}
			}
		},
		'juicy-low-small-testnet': {
			// Europa connections
			eth: {
				eth: {
					address: '0xD2Aaa00700000000000000000000000000000000',
					chains: {
						mainnet: {
							clone: true
						},
						'lanky-ill-funny-testnet': {
							wrapper: '0x7Dcc444B1B94ACcf24C39C2ff2C0465D640cFC3F'
						}
					}
				}
			},
			erc20: {
				dai: {
					address: '0x7aE734db73c57F3D16f5F141BAf6CfABD9E693bf',
					chains: {
						mainnet: {
							clone: true
						}
					}
				},
				trc: {
					address: '0x7ebf7fde04cbe629c5b26829d6582b22e5e0ae4c',
					chains: {
						mainnet: {
							clone: true
						}
					}
				},
				skl: {
					address: '0x6c71319b1F910Cf989AD386CcD4f8CC8573027aB',
					chains: {
						mainnet: {
							clone: true
						},
						'giant-half-dual-testnet': {
							wrapper: '0xba05e3c8033705017ea734f4041fcce7f5d43271'
						},
						'lanky-ill-funny-testnet': {
							wrapper: '0xba05e3c8033705017ea734f4041fcce7f5d43271'
						},
						'aware-fake-trim-testnet': {
							wrapper: '0xba05e3c8033705017ea734f4041fcce7f5d43271'
						}
					}
				},
				usdp: {
					address: '0xbEE0FB0C095405A17c079Cd5C3cc89525e5A9a8C',
					chains: {
						mainnet: {
							clone: true
						}
					}
				},
				usdc: {
					address: '0x6CE77Fc7970F6984eF3E8748A3826972Ec409Fb9',
					chains: {
						mainnet: {
							clone: true
						},
						'giant-half-dual-testnet': {
							wrapper: '0xa6be26f2914a17fc4e8d21a1ce2ec4079eeb990c'
						},
						'lanky-ill-funny-testnet': {
							wrapper: '0xa6be26f2914a17fc4e8d21a1ce2ec4079eeb990c'
						},
						'aware-fake-trim-testnet': {
							wrapper: '0xa6be26f2914a17fc4e8d21a1ce2ec4079eeb990c'
						}
					}
				},
				skivvy: {
					address: '0x6fb47CdB4e1b8FC17707af06ff8E431C61825584',
					chains: {
						mainnet: {
							clone: true
						},
						'giant-half-dual-testnet': {
							wrapper: '0x23d67AF9E78f757Ba6a678ECfc8d346C1e0b3D88'
						}
					}
				},
				unp: {
					address: '0xbB4dFb0783Cb966Dc94dE548047A08C6b0F439a7',
					chains: {
						mainnet: {
							clone: true
						},
						'lanky-ill-funny-testnet': {
							wrapper: '0x1Dbc55b18F6184Bd4642820baea0260f9D540667'
						}
					}
				}
			}
		}
	},
	theme: {
		mode: 'dark',
		vibrant: true,
		primary: '#93B8EC',
		background: '#000000',
	},
}
