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
 * @file CreditsHistoryList.tsx
 * @copyright SKALE Labs 2025-Present
 */

import { useState, useEffect } from 'react'
import Avatar from 'boring-avatars'
import { Contract } from 'ethers'

import { Grid, Button } from '@mui/material'
import HistoryToggleOffRoundedIcon from '@mui/icons-material/HistoryToggleOffRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'

import {
  cls,
  type MetaportCore,
  Tile,
  ChainIcon,
  TokenIcon,
  useWagmiAccount,
  sendTransaction,
  walletClientToSigner,
  useWagmiWalletClient,
  useWagmiSwitchNetwork,
  enforceNetwork
} from '@skalenetwork/metaport'
import { types, metadata, constants, timeUtils, helper, units } from '@/core'

import SkStack from '../SkStack'

import * as cs from '../../core/credit-station'
import {
  CREDITS_CONFIRMATION_BLOCKS,
  AVATAR_COLORS,
  DEFAULT_CREDITS_AMOUNT
} from '../../core/constants'
import { BadgeCheck, HandCoins, IdCard } from 'lucide-react'

interface CreditsPaymentTileProps {
  mpc: MetaportCore
  payment: cs.Payment
  chainsMeta: types.ChainsMetadataMap
  isXs: boolean
  ledgerContract: Contract | undefined
  creditStation: Contract | undefined
  isAdmin?: boolean
  setErrorMsg?: (msg: string | undefined) => void
}

const CreditsPaymentTile: React.FC<CreditsPaymentTileProps> = ({
  mpc,
  payment,
  chainsMeta,
  isXs,
  ledgerContract,
  creditStation,
  isAdmin = false,
  setErrorMsg
}) => {
  const network = mpc.config.skaleNetwork
  const chainAlias = metadata.getAlias(network, chainsMeta, payment.schainName)

  const tokens = mpc.config.connections.mainnet?.erc20 || {}
  const tokenSymbol =
    Object.keys(tokens).find(
      (symbol) => tokens[symbol].address?.toLowerCase() === payment.tokenAddress.toLowerCase()
    ) || 'unknown'

  const [isFulfilled, setIsFulfilled] = useState<boolean>(false)
  const [txTimestamp, setTxTimestamp] = useState<number | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)

  const { chainId } = useWagmiAccount()
  const { data: walletClient } = useWagmiWalletClient({ chainId })
  const { switchChainAsync } = useWagmiSwitchNetwork()

  useEffect(() => {
    if (!creditStation || !payment) return
    const fetchTimestamp = async () => {
      try {
        const provider = creditStation.runner?.provider
        if (!provider) return
        const block = await provider.getBlock(payment.blockNumber)
        if (block) setTxTimestamp(block.timestamp)
      } catch (error) {}
    }
    fetchTimestamp()
  }, [creditStation, payment])

  useEffect(() => {
    if (!ledgerContract) return
    const checkFulfillment = async () => {
      try {
        setIsFulfilled(await ledgerContract.isFulfilled(payment.id))
      } catch (error) {}
    }
    checkFulfillment()
    const interval = setInterval(checkFulfillment, 10000)
    return () => clearInterval(interval)
  }, [ledgerContract, payment.id])

  async function fulfillPayment() {
    if (!ledgerContract || !walletClient || !switchChainAsync) {
      setErrorMsg?.('Something is wrong with your wallet, try again')
      return
    }
    if (!ledgerContract.runner?.provider) {
      setErrorMsg?.('Ledger contract provider not available')
      return
    }
    setLoading(true)
    setErrorMsg?.(undefined)

    try {
      const { chainId } = await ledgerContract.runner.provider.getNetwork()
      await enforceNetwork(chainId, walletClient, switchChainAsync, network, payment.schainName)

      const signer = walletClientToSigner(walletClient)
      ledgerContract.connect(signer)

      const res = await sendTransaction(
        signer,
        ledgerContract.fulfill,
        [payment.id, payment.to],
        'ledger:fulfill',
        CREDITS_CONFIRMATION_BLOCKS,
        units.toWei(DEFAULT_CREDITS_AMOUNT.toString(), constants.DEFAULT_ERC20_DECIMALS)
      )
      if (!res.status) {
        setErrorMsg?.(res.err?.name)
        return
      }
    } catch (e: any) {
      setErrorMsg?.(e.toString())
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-2.5 bg-background rounded-3xl p-4">
        <Grid container spacing={0} alignItems="center">
          <Grid size={{ xs: 12, md: 4 }}>
            <div className={cls('flex', 'items-center')}>
              <Avatar
                size={50}
                variant="marble"
                name={isAdmin ? payment.from : payment.schainName + payment.id * 2n}
                colors={AVATAR_COLORS}
              />
              <ChainIcon
                skaleNetwork={network}
                chainName={payment.schainName}
                size="xs"
                className="creditHistoryIcon"
              />
              <div className={cls('ml-2.5', ['grow', isXs])}>
                <h4 className="font-bold pOneLine text-foreground">
                  {txTimestamp && !isAdmin
                    ? timeUtils.timestampToDate(txTimestamp, true)
                    : helper.shortAddress(payment.from)}
                </h4>
                <p className={cls('p', 'text-xs', 'text-secondary-foreground font-medium')}>
                  {isAdmin && txTimestamp
                    ? timeUtils.timestampToDate(txTimestamp, true)
                    : chainAlias}
                </p>
              </div>
            </div>
          </Grid>
          <Grid size={{ xs: 12, md: 8 }} className={cls(['mt-5', isXs], 'flex', 'items-center')}>
            <div
              className={cls(
                'chipXs',
                'ml-5',
                'flex',
                'items-center',
                ['chip_DELEGATED', isFulfilled],
                ['chip_SELF', !isFulfilled],
                'font-semibold'
              )}
            >
              {isFulfilled ? <CheckCircleRoundedIcon /> : <HistoryToggleOffRoundedIcon />}
              <p className={cls('p', 'text-xs', 'pOneLine', 'ml-1.5')}>
                {isFulfilled ? 'COMPLETED' : 'PENDING'}
              </p>
            </div>
            <div className={cls('grow')}></div>
            <SkStack className={cls('flex')}>
              <Tile
                size="md"
                transparent
                className={cls('p-0!', ['mr-5', !isXs], ['ml-5', !isXs])}
                value={tokenSymbol.toUpperCase()}
                text="Token Used"
                grow
                ri={!isXs}
                icon={<TokenIcon tokenSymbol={tokenSymbol} size="xs" />}
              />
              <div className="border-l-2 border-border"></div>
              <Tile
                size="md"
                transparent
                className={cls('p-0!', ['mr-5', !isXs], ['ml-5', !isXs])}
                value={`ID: ${payment.id.toString()}`}
                text="Payment ID"
                grow
                ri={!isXs}
                icon={<IdCard size={17} />}
              />
            </SkStack>
            {isAdmin && (
              <div className={cls('flex', 'items-center')}>
                <Button
                  size="small"
                  startIcon={isFulfilled ? <BadgeCheck size={17} /> : <HandCoins size={17} />}
                  className="btnMd bg-secondary-foreground/10! text-foreground! disabled:opacity-50! ml-2.5"
                  onClick={fulfillPayment}
                  disabled={isFulfilled || loading || !ledgerContract}
                >
                  {isFulfilled ? 'Done' : 'Fulfill'}
                </Button>
              </div>
            )}
          </Grid>
        </Grid>
      </div>
    </div>
  )
}

export default CreditsPaymentTile
