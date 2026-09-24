/**
 * @license
 * SKALE portal
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
/**
 * @file erc20.ts
 * @copyright SKALE Labs 2025-Present
 */

// prettier-ignore
export const erc20Abi = [
  { type: 'constructor', inputs: [{ type: 'string', name: 'contractName' }, { type: 'string', name: 'contractSymbol' }], stateMutability: 'nonpayable' },
  { type: 'event', anonymous: false, name: 'Approval', inputs: [{ type: 'address', name: 'owner', indexed: true }, { type: 'address', name: 'spender', indexed: true }, { type: 'uint256', name: 'value', indexed: false }] },
  { type: 'event', anonymous: false, name: 'RoleAdminChanged', inputs: [{ type: 'bytes32', name: 'role', indexed: true }, { type: 'bytes32', name: 'previousAdminRole', indexed: true }, { type: 'bytes32', name: 'newAdminRole', indexed: true }] },
  { type: 'event', anonymous: false, name: 'RoleGranted', inputs: [{ type: 'bytes32', name: 'role', indexed: true }, { type: 'address', name: 'account', indexed: true }, { type: 'address', name: 'sender', indexed: true }] },
  { type: 'event', anonymous: false, name: 'RoleRevoked', inputs: [{ type: 'bytes32', name: 'role', indexed: true }, { type: 'address', name: 'account', indexed: true }, { type: 'address', name: 'sender', indexed: true }] },
  { type: 'event', anonymous: false, name: 'Transfer', inputs: [{ type: 'address', name: 'from', indexed: true }, { type: 'address', name: 'to', indexed: true }, { type: 'uint256', name: 'value', indexed: false }] },
  { type: 'function', name: 'DEFAULT_ADMIN_ROLE', stateMutability: 'view', inputs: [], outputs: [{ type: 'bytes32', name: '' }] },
  { type: 'function', name: 'MINTER_ROLE', stateMutability: 'view', inputs: [], outputs: [{ type: 'bytes32', name: '' }] },
  { type: 'function', name: 'allowance', stateMutability: 'view', inputs: [{ type: 'address', name: 'owner' }, { type: 'address', name: 'spender' }], outputs: [{ type: 'uint256', name: '' }] },
  { type: 'function', name: 'approve', inputs: [{ type: 'address', name: 'spender' }, { type: 'uint256', name: 'amount' }], outputs: [{ type: 'bool', name: '' }], stateMutability: 'nonpayable' },
  { type: 'function', name: 'balanceOf', stateMutability: 'view', inputs: [{ type: 'address', name: 'account' }], outputs: [{ type: 'uint256', name: '' }] },
  { type: 'function', name: 'burn', inputs: [{ type: 'uint256', name: 'amount' }], outputs: [], stateMutability: 'nonpayable' },
  { type: 'function', name: 'burnFrom', inputs: [{ type: 'address', name: 'account' }, { type: 'uint256', name: 'amount' }], outputs: [], stateMutability: 'nonpayable' },
  { type: 'function', name: 'decimals', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint8', name: '' }] },
  { type: 'function', name: 'decreaseAllowance', inputs: [{ type: 'address', name: 'spender' }, { type: 'uint256', name: 'subtractedValue' }], outputs: [{ type: 'bool', name: '' }], stateMutability: 'nonpayable' },
  { type: 'function', name: 'getRoleAdmin', stateMutability: 'view', inputs: [{ type: 'bytes32', name: 'role' }], outputs: [{ type: 'bytes32', name: '' }] },
  { type: 'function', name: 'getRoleMember', stateMutability: 'view', inputs: [{ type: 'bytes32', name: 'role' }, { type: 'uint256', name: 'index' }], outputs: [{ type: 'address', name: '' }] },
  { type: 'function', name: 'getRoleMemberCount', stateMutability: 'view', inputs: [{ type: 'bytes32', name: 'role' }], outputs: [{ type: 'uint256', name: '' }] },
  { type: 'function', name: 'grantRole', inputs: [{ type: 'bytes32', name: 'role' }, { type: 'address', name: 'account' }], outputs: [], stateMutability: 'nonpayable' },
  { type: 'function', name: 'hasRole', stateMutability: 'view', inputs: [{ type: 'bytes32', name: 'role' }, { type: 'address', name: 'account' }], outputs: [{ type: 'bool', name: '' }] },
  { type: 'function', name: 'increaseAllowance', inputs: [{ type: 'address', name: 'spender' }, { type: 'uint256', name: 'addedValue' }], outputs: [{ type: 'bool', name: '' }], stateMutability: 'nonpayable' },
  { type: 'function', name: 'mint', inputs: [{ type: 'address', name: 'account' }, { type: 'uint256', name: 'value' }], outputs: [], stateMutability: 'nonpayable' },
  { type: 'function', name: 'name', stateMutability: 'view', inputs: [], outputs: [{ type: 'string', name: '' }] },
  { type: 'function', name: 'renounceRole', inputs: [{ type: 'bytes32', name: 'role' }, { type: 'address', name: 'account' }], outputs: [], stateMutability: 'nonpayable' },
  { type: 'function', name: 'revokeRole', inputs: [{ type: 'bytes32', name: 'role' }, { type: 'address', name: 'account' }], outputs: [], stateMutability: 'nonpayable' },
  { type: 'function', name: 'supportsInterface', stateMutability: 'view', inputs: [{ type: 'bytes4', name: 'interfaceId' }], outputs: [{ type: 'bool', name: '' }] },
  { type: 'function', name: 'symbol', stateMutability: 'view', inputs: [], outputs: [{ type: 'string', name: '' }] },
  { type: 'function', name: 'totalSupply', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256', name: '' }] },
  { type: 'function', name: 'transfer', inputs: [{ type: 'address', name: 'to' }, { type: 'uint256', name: 'amount' }], outputs: [{ type: 'bool', name: '' }], stateMutability: 'nonpayable' },
  { type: 'function', name: 'transferFrom', inputs: [{ type: 'address', name: 'from' }, { type: 'address', name: 'to' }, { type: 'uint256', name: 'amount' }], outputs: [{ type: 'bool', name: '' }], stateMutability: 'nonpayable' }
] as const
