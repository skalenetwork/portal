export default {
  networks: {
    mainnet: {
      chain: 'elated-tan-skat',
      address: '0x0d66cA00CbAD4219734D7FDF921dD7Caadc1F78D',
      launchTs: '0'
    },
    staging: {
      chain: 'staging-legal-crazy-castor',
      address: '0x9E444978d11E7e753017ce3329B01663D5D78240',
      launchTs: '0'
    },
    legacy: {
      chain: '',
      address: '0x',
      launchTs: '0'
    },
    regression: {
      chain: '',
      address: '0x',
      launchTs: '0'
    },
    testnet: {
      chain: '',
      address: '0x',
      launchTs: '0'
    }
  },
  abi: [
    {
      inputs: [
        {
          internalType: 'address',
          name: 'authority',
          type: 'address'
        }
      ],
      name: 'AccessManagedInvalidAuthority',
      type: 'error'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'caller',
          type: 'address'
        },
        {
          internalType: 'uint32',
          name: 'delay',
          type: 'uint32'
        }
      ],
      name: 'AccessManagedRequiredDelay',
      type: 'error'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'caller',
          type: 'address'
        }
      ],
      name: 'AccessManagedUnauthorized',
      type: 'error'
    },
    {
      inputs: [],
      name: 'AccessToEmptyHeap',
      type: 'error'
    },
    {
      inputs: [],
      name: 'AccessToEmptyPriorityQueue',
      type: 'error'
    },
    {
      inputs: [],
      name: 'CannotAddToThePast',
      type: 'error'
    },
    {
      inputs: [],
      name: 'CannotSetValueInThePast',
      type: 'error'
    },
    {
      inputs: [],
      name: 'ClearUnprocessed',
      type: 'error'
    },
    {
      inputs: [],
      name: 'ImportantDataRemoving',
      type: 'error'
    },
    {
      inputs: [],
      name: 'IncorrectTimeInterval',
      type: 'error'
    },
    {
      inputs: [],
      name: 'InvalidInitialization',
      type: 'error'
    },
    {
      inputs: [],
      name: 'NotInitializing',
      type: 'error'
    },
    {
      inputs: [],
      name: 'QueueEmpty',
      type: 'error'
    },
    {
      inputs: [],
      name: 'QueueFull',
      type: 'error'
    },
    {
      inputs: [],
      name: 'QueueOutOfBounds',
      type: 'error'
    },
    {
      inputs: [],
      name: 'ReplenishmentPeriodIsTooBig',
      type: 'error'
    },
    {
      inputs: [],
      name: 'RootDoesNotHaveParent',
      type: 'error'
    },
    {
      inputs: [
        {
          internalType: 'SchainHash',
          name: 'hash',
          type: 'bytes32'
        }
      ],
      name: 'SchainAddingError',
      type: 'error'
    },
    {
      inputs: [
        {
          internalType: 'SchainHash',
          name: 'hash',
          type: 'bytes32'
        }
      ],
      name: 'SchainDeletionError',
      type: 'error'
    },
    {
      inputs: [
        {
          internalType: 'SchainHash',
          name: 'hash',
          type: 'bytes32'
        }
      ],
      name: 'SchainNotFound',
      type: 'error'
    },
    {
      inputs: [],
      name: 'SchainPriceIsNotSet',
      type: 'error'
    },
    {
      inputs: [],
      name: 'SkaleTokenIsNotSet',
      type: 'error'
    },
    {
      inputs: [],
      name: 'SklPriceIsNotSet',
      type: 'error'
    },
    {
      inputs: [],
      name: 'SklPriceIsOutdated',
      type: 'error'
    },
    {
      inputs: [],
      name: 'TimeIntervalIsAlreadyProcessed',
      type: 'error'
    },
    {
      inputs: [],
      name: 'TimeIntervalIsNotProcessed',
      type: 'error'
    },
    {
      inputs: [],
      name: 'TimestampIsOutOfValues',
      type: 'error'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'spender',
          type: 'address'
        },
        {
          internalType: 'uint256',
          name: 'required',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: 'allowed',
          type: 'uint256'
        }
      ],
      name: 'TooSmallAllowance',
      type: 'error'
    },
    {
      inputs: [],
      name: 'TransferFailure',
      type: 'error'
    },
    {
      inputs: [
        {
          internalType: 'ValidatorId',
          name: 'id',
          type: 'uint256'
        }
      ],
      name: 'ValidatorAddingError',
      type: 'error'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'validatorAddress',
          type: 'address'
        }
      ],
      name: 'ValidatorAddressAlreadyExists',
      type: 'error'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'validatorAddress',
          type: 'address'
        }
      ],
      name: 'ValidatorAddressNotFound',
      type: 'error'
    },
    {
      inputs: [
        {
          internalType: 'ValidatorId',
          name: 'id',
          type: 'uint256'
        }
      ],
      name: 'ValidatorDeletionError',
      type: 'error'
    },
    {
      inputs: [
        {
          internalType: 'ValidatorId',
          name: 'id',
          type: 'uint256'
        },
        {
          internalType: 'Timestamp',
          name: 'when',
          type: 'uint256'
        }
      ],
      name: 'ValidatorHasBeenRemoved',
      type: 'error'
    },
    {
      inputs: [
        {
          internalType: 'ValidatorId',
          name: 'id',
          type: 'uint256'
        }
      ],
      name: 'ValidatorNotFound',
      type: 'error'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'address',
          name: 'authority',
          type: 'address'
        }
      ],
      name: 'AuthorityUpdated',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'uint64',
          name: 'version',
          type: 'uint64'
        }
      ],
      name: 'Initialized',
      type: 'event'
    },
    {
      inputs: [
        {
          internalType: 'string',
          name: 'name',
          type: 'string'
        }
      ],
      name: 'addSchain',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'ValidatorId',
          name: 'id',
          type: 'uint256'
        },
        {
          internalType: 'address',
          name: 'validatorAddress',
          type: 'address'
        }
      ],
      name: 'addValidator',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [],
      name: 'allowedSklPriceLag',
      outputs: [
        {
          internalType: 'Seconds',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'authority',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'to',
          type: 'address'
        }
      ],
      name: 'claim',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'ValidatorId',
          name: 'validatorId',
          type: 'uint256'
        },
        {
          internalType: 'address',
          name: 'to',
          type: 'address'
        }
      ],
      name: 'claimFor',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'Timestamp',
          name: 'before',
          type: 'uint256'
        }
      ],
      name: 'clearHistory',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'Paymaster.DebtId',
          name: '',
          type: 'uint256'
        }
      ],
      name: 'debts',
      outputs: [
        {
          internalType: 'Timestamp',
          name: 'from',
          type: 'uint256'
        },
        {
          internalType: 'Timestamp',
          name: 'to',
          type: 'uint256'
        },
        {
          internalType: 'SKL',
          name: 'amount',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'debtsBegin',
      outputs: [
        {
          internalType: 'Paymaster.DebtId',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'debtsEnd',
      outputs: [
        {
          internalType: 'Paymaster.DebtId',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'ValidatorId',
          name: 'validatorId',
          type: 'uint256'
        }
      ],
      name: 'getActiveNodesNumber',
      outputs: [
        {
          internalType: 'uint256',
          name: 'number',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'ValidatorId',
          name: 'validatorId',
          type: 'uint256'
        }
      ],
      name: 'getNodesNumber',
      outputs: [
        {
          internalType: 'uint256',
          name: 'number',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'getRewardAmount',
      outputs: [
        {
          internalType: 'SKL',
          name: 'reward',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'ValidatorId',
          name: 'validatorId',
          type: 'uint256'
        }
      ],
      name: 'getRewardAmountFor',
      outputs: [
        {
          internalType: 'SKL',
          name: 'reward',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'SchainHash',
          name: 'schainHash',
          type: 'bytes32'
        }
      ],
      name: 'getSchainExpirationTimestamp',
      outputs: [
        {
          internalType: 'Timestamp',
          name: 'expiration',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'getSchainsNames',
      outputs: [
        {
          internalType: 'string[]',
          name: 'names',
          type: 'string[]'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'getSchainsNumber',
      outputs: [
        {
          internalType: 'uint256',
          name: 'number',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'getValidatorsNumber',
      outputs: [
        {
          internalType: 'uint256',
          name: 'number',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'initialAuthority',
          type: 'address'
        }
      ],
      name: 'initialize',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [],
      name: 'isConsumingScheduledOp',
      outputs: [
        {
          internalType: 'bytes4',
          name: '',
          type: 'bytes4'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'maxReplenishmentPeriod',
      outputs: [
        {
          internalType: 'Months',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'oneSklPrice',
      outputs: [
        {
          internalType: 'USD',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'effectiveTimestamp',
      outputs: [
        {
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'SchainHash',
          name: 'schainHash',
          type: 'bytes32'
        },
        {
          internalType: 'Months',
          name: 'duration',
          type: 'uint256'
        }
      ],
      name: 'pay',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'SchainHash',
          name: 'schainHash',
          type: 'bytes32'
        }
      ],
      name: 'removeSchain',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'ValidatorId',
          name: 'id',
          type: 'uint256'
        }
      ],
      name: 'removeValidator',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [],
      name: 'schainPricePerMonth',
      outputs: [
        {
          internalType: 'USD',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'SchainHash',
          name: '',
          type: 'bytes32'
        }
      ],
      name: 'schains',
      outputs: [
        {
          internalType: 'SchainHash',
          name: 'hash',
          type: 'bytes32'
        },
        {
          internalType: 'string',
          name: 'name',
          type: 'string'
        },
        {
          internalType: 'Timestamp',
          name: 'paidUntil',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'ValidatorId',
          name: 'validatorId',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256'
        }
      ],
      name: 'setActiveNodes',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'Seconds',
          name: 'lagSeconds',
          type: 'uint256'
        }
      ],
      name: 'setAllowedSklPriceLag',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'newAuthority',
          type: 'address'
        }
      ],
      name: 'setAuthority',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'Months',
          name: 'months',
          type: 'uint256'
        }
      ],
      name: 'setMaxReplenishmentPeriod',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'ValidatorId',
          name: 'validatorId',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256'
        }
      ],
      name: 'setNodesAmount',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'USD',
          name: 'price',
          type: 'uint256'
        }
      ],
      name: 'setSchainPrice',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'contract IERC20',
          name: 'token',
          type: 'address'
        }
      ],
      name: 'setSkaleToken',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'USD',
          name: 'price',
          type: 'uint256'
        }
      ],
      name: 'setSklPrice',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'string',
          name: 'newVersion',
          type: 'string'
        }
      ],
      name: 'setVersion',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [],
      name: 'skaleToken',
      outputs: [
        {
          internalType: 'contract IERC20',
          name: '',
          type: 'address'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'sklPriceTimestamp',
      outputs: [
        {
          internalType: 'Timestamp',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'version',
      outputs: [
        {
          internalType: 'string',
          name: '',
          type: 'string'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    }
  ]
}
