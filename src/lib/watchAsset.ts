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
 * @file watchAsset.ts
 * @copyright SKALE Labs 2022-Present
 */

export async function watchAsset(
  walletClient: any,
  address: string,
  decimals: number,
  symbol: string
) {
  try {
    const success = await walletClient.watchAsset({
      type: 'ERC20',
      options: {
        address: address,
        decimals: decimals,
        symbol: symbol
      }
    })
    return success
  } catch (error) {
    console.log(error)
    return false
  }
}
