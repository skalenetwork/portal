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
 * @file erc1155.ts
 * @copyright SKALE Labs 2025-Present
 */

// prettier-ignore
export const erc1155Abi = [
  { type: 'constructor', inputs: [{ type: 'string', name: 'uri' }], stateMutability: 'nonpayable' },
  { type: 'event', anonymous: false, name: 'ApprovalForAll', inputs: [{ type: 'address', name: 'account', indexed: true }, { type: 'address', name: 'operator', indexed: true }, { type: 'bool', name: 'approved', indexed: false }] },
  { type: 'event', anonymous: false, name: 'RoleAdminChanged', inputs: [{ type: 'bytes32', name: 'role', indexed: true }, { type: 'bytes32', name: 'previousAdminRole', indexed: true }, { type: 'bytes32', name: 'newAdminRole', indexed: true }] },
  { type: 'event', anonymous: false, name: 'RoleGranted', inputs: [{ type: 'bytes32', name: 'role', indexed: true }, { type: 'address', name: 'account', indexed: true }, { type: 'address', name: 'sender', indexed: true }] },
  { type: 'event', anonymous: false, name: 'RoleRevoked', inputs: [{ type: 'bytes32', name: 'role', indexed: true }, { type: 'address', name: 'account', indexed: true }, { type: 'address', name: 'sender', indexed: true }] },
  { type: 'event', anonymous: false, name: 'TransferBatch', inputs: [{ type: 'address', name: 'operator', indexed: true }, { type: 'address', name: 'from', indexed: true }, { type: 'address', name: 'to', indexed: true }, { type: 'uint256[]', name: 'ids', indexed: false }, { type: 'uint256[]', name: 'values', indexed: false }] },
  { type: 'event', anonymous: false, name: 'TransferSingle', inputs: [{ type: 'address', name: 'operator', indexed: true }, { type: 'address', name: 'from', indexed: true }, { type: 'address', name: 'to', indexed: true }, { type: 'uint256', name: 'id', indexed: false }, { type: 'uint256', name: 'value', indexed: false }] },
  { type: 'event', anonymous: false, name: 'URI', inputs: [{ type: 'string', name: 'value', indexed: false }, { type: 'uint256', name: 'id', indexed: true }] },
  { type: 'function', name: 'DEFAULT_ADMIN_ROLE', stateMutability: 'view', inputs: [], outputs: [{ type: 'bytes32', name: '' }] },
  { type: 'function', name: 'MINTER_ROLE', stateMutability: 'view', inputs: [], outputs: [{ type: 'bytes32', name: '' }] },
  { type: 'function', name: 'balanceOf', stateMutability: 'view', inputs: [{ type: 'address', name: 'account' }, { type: 'uint256', name: 'id' }], outputs: [{ type: 'uint256', name: '' }] },
  { type: 'function', name: 'balanceOfBatch', stateMutability: 'view', inputs: [{ type: 'address[]', name: 'accounts' }, { type: 'uint256[]', name: 'ids' }], outputs: [{ type: 'uint256[]', name: '' }] },
  { type: 'function', name: 'burn', inputs: [{ type: 'address', name: 'account' }, { type: 'uint256', name: 'id' }, { type: 'uint256', name: 'value' }], outputs: [], stateMutability: 'nonpayable' },
  { type: 'function', name: 'burnBatch', inputs: [{ type: 'address', name: 'account' }, { type: 'uint256[]', name: 'ids' }, { type: 'uint256[]', name: 'values' }], outputs: [], stateMutability: 'nonpayable' },
  { type: 'function', name: 'getRoleAdmin', stateMutability: 'view', inputs: [{ type: 'bytes32', name: 'role' }], outputs: [{ type: 'bytes32', name: '' }] },
  { type: 'function', name: 'getRoleMember', stateMutability: 'view', inputs: [{ type: 'bytes32', name: 'role' }, { type: 'uint256', name: 'index' }], outputs: [{ type: 'address', name: '' }] },
  { type: 'function', name: 'getRoleMemberCount', stateMutability: 'view', inputs: [{ type: 'bytes32', name: 'role' }], outputs: [{ type: 'uint256', name: '' }] },
  { type: 'function', name: 'grantRole', inputs: [{ type: 'bytes32', name: 'role' }, { type: 'address', name: 'account' }], outputs: [], stateMutability: 'nonpayable' },
  { type: 'function', name: 'hasRole', stateMutability: 'view', inputs: [{ type: 'bytes32', name: 'role' }, { type: 'address', name: 'account' }], outputs: [{ type: 'bool', name: '' }] },
  { type: 'function', name: 'isApprovedForAll', stateMutability: 'view', inputs: [{ type: 'address', name: 'account' }, { type: 'address', name: 'operator' }], outputs: [{ type: 'bool', name: '' }] },
  { type: 'function', name: 'mint', inputs: [{ type: 'address', name: 'account' }, { type: 'uint256', name: 'id' }, { type: 'uint256', name: 'amount' }, { type: 'bytes', name: 'data' }], outputs: [], stateMutability: 'nonpayable' },
  { type: 'function', name: 'mintBatch', inputs: [{ type: 'address', name: 'account' }, { type: 'uint256[]', name: 'ids' }, { type: 'uint256[]', name: 'amounts' }, { type: 'bytes', name: 'data' }], outputs: [], stateMutability: 'nonpayable' },
  { type: 'function', name: 'renounceRole', inputs: [{ type: 'bytes32', name: 'role' }, { type: 'address', name: 'account' }], outputs: [], stateMutability: 'nonpayable' },
  { type: 'function', name: 'revokeRole', inputs: [{ type: 'bytes32', name: 'role' }, { type: 'address', name: 'account' }], outputs: [], stateMutability: 'nonpayable' },
  { type: 'function', name: 'safeBatchTransferFrom', inputs: [{ type: 'address', name: 'from' }, { type: 'address', name: 'to' }, { type: 'uint256[]', name: 'ids' }, { type: 'uint256[]', name: 'amounts' }, { type: 'bytes', name: 'data' }], outputs: [], stateMutability: 'nonpayable' },
  { type: 'function', name: 'safeTransferFrom', inputs: [{ type: 'address', name: 'from' }, { type: 'address', name: 'to' }, { type: 'uint256', name: 'id' }, { type: 'uint256', name: 'amount' }, { type: 'bytes', name: 'data' }], outputs: [], stateMutability: 'nonpayable' },
  { type: 'function', name: 'setApprovalForAll', inputs: [{ type: 'address', name: 'operator' }, { type: 'bool', name: 'approved' }], outputs: [], stateMutability: 'nonpayable' },
  { type: 'function', name: 'supportsInterface', stateMutability: 'view', inputs: [{ type: 'bytes4', name: 'interfaceId' }], outputs: [{ type: 'bool', name: '' }] },
  { type: 'function', name: 'uri', stateMutability: 'view', inputs: [{ type: 'uint256', name: '' }], outputs: [{ type: 'string', name: '' }] }
] as const
