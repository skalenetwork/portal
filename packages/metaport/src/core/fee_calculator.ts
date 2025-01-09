/**
 * @license
 * SKALE Metaport
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * @file fee_calculator.ts
 * @copyright SKALE Labs 2022-Present
 */

import { fromWei } from './convertation'
import { CoinGeckoClient } from 'coingecko-api-v3'
import { DEFAULT_ERC20_DECIMALS } from './constants'

export async function getTransactionFee(): Promise<number> {
  // todo: get actual gas limit for transfer
  // todo: get actual gas price
  const gasLimit = 250000n
  const gasPrice = 10000000000n

  const amountWei = gasLimit * gasPrice
  const amountEth = fromWei(amountWei, DEFAULT_ERC20_DECIMALS)

  const client = new CoinGeckoClient({
    timeout: 10000,
    autoRetry: true
  })
  const res = await client.simplePrice({ ids: 'ethereum', vs_currencies: 'usd' })
  const ethToUsdRate = res.ethereum.usd
  const amountUSD = Number(amountEth) * ethToUsdRate
  return amountUSD
}
