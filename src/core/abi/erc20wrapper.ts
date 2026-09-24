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
 * @file erc20wrapper.ts
 * @copyright SKALE Labs 2025-Present
 */

// prettier-ignore
export const erc20WrapperAbi = [
  { type: 'constructor', inputs: [{ type: 'string', name: 'contractName' }, { type: 'string', name: 'contractSymbol' }, { type: 'address', name: 'originToken' }], stateMutability: 'nonpayable' },
  { type: 'event', anonymous: false, name: 'Approval', inputs: [{ type: 'address', name: 'owner', indexed: true }, { type: 'address', name: 'spender', indexed: true }, { type: 'uint256', name: 'value', indexed: false }] },
  { type: 'event', anonymous: false, name: 'Transfer', inputs: [{ type: 'address', name: 'from', indexed: true }, { type: 'address', name: 'to', indexed: true }, { type: 'uint256', name: 'value', indexed: false }] },
  { type: 'function', name: 'allowance', stateMutability: 'view', inputs: [{ type: 'address', name: 'owner' }, { type: 'address', name: 'spender' }], outputs: [{ type: 'uint256', name: '' }] },
  { type: 'function', name: 'approve', inputs: [{ type: 'address', name: 'spender' }, { type: 'uint256', name: 'amount' }], outputs: [{ type: 'bool', name: '' }], stateMutability: 'nonpayable' },
  { type: 'function', name: 'balanceOf', stateMutability: 'view', inputs: [{ type: 'address', name: 'account' }], outputs: [{ type: 'uint256', name: '' }] },
  { type: 'function', name: 'decimals', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint8', name: '' }] },
  { type: 'function', name: 'decreaseAllowance', inputs: [{ type: 'address', name: 'spender' }, { type: 'uint256', name: 'subtractedValue' }], outputs: [{ type: 'bool', name: '' }], stateMutability: 'nonpayable' },
  { type: 'function', name: 'depositFor', inputs: [{ type: 'address', name: 'account' }, { type: 'uint256', name: 'amount' }], outputs: [{ type: 'bool', name: '' }], stateMutability: 'nonpayable' },
  { type: 'function', name: 'increaseAllowance', inputs: [{ type: 'address', name: 'spender' }, { type: 'uint256', name: 'addedValue' }], outputs: [{ type: 'bool', name: '' }], stateMutability: 'nonpayable' },
  { type: 'function', name: 'name', stateMutability: 'view', inputs: [], outputs: [{ type: 'string', name: '' }] },
  { type: 'function', name: 'symbol', stateMutability: 'view', inputs: [], outputs: [{ type: 'string', name: '' }] },
  { type: 'function', name: 'totalSupply', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256', name: '' }] },
  { type: 'function', name: 'transfer', inputs: [{ type: 'address', name: 'to' }, { type: 'uint256', name: 'amount' }], outputs: [{ type: 'bool', name: '' }], stateMutability: 'nonpayable' },
  { type: 'function', name: 'transferFrom', inputs: [{ type: 'address', name: 'from' }, { type: 'address', name: 'to' }, { type: 'uint256', name: 'amount' }], outputs: [{ type: 'bool', name: '' }], stateMutability: 'nonpayable' },
  { type: 'function', name: 'underlying', stateMutability: 'view', inputs: [], outputs: [{ type: 'address', name: '' }] },
  { type: 'function', name: 'withdrawTo', inputs: [{ type: 'address', name: 'account' }, { type: 'uint256', name: 'amount' }], outputs: [{ type: 'bool', name: '' }], stateMutability: 'nonpayable' }
] as const
