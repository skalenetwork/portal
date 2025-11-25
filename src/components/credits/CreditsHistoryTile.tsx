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
import { Link } from 'react-router-dom'
import { Contract } from 'ethers'

import { Grid, Button } from '@mui/material'
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded'
import HistoryToggleOffRoundedIcon from '@mui/icons-material/HistoryToggleOffRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'

import {
  cls,
  type MetaportCore,
  Tile,
  ChainIcon,
  TokenIcon,
  explorer,
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

interface CreditsHistoryTileProps {
  mpc: MetaportCore
  creditsPurchase: {
    schainName: string
    payment: cs.PaymentEvent
  }
  chainsMeta: types.ChainsMetadataMap
  isXs: boolean
  ledgerContract: Contract | undefined
  creditStation: Contract | undefined
  isAdmin?: boolean
  setErrorMsg?: (msg: string | undefined) => void
}

const CreditsHistoryTile: React.FC<CreditsHistoryTileProps> = ({
  mpc,
  creditsPurchase,
  chainsMeta,
  isXs,
  ledgerContract,
  creditStation,
  isAdmin = false,
  setErrorMsg
}) => {
  const network = mpc.config.skaleNetwork
  const chainAlias = metadata.getAlias(network, chainsMeta, creditsPurchase.schainName)
  const payment = creditsPurchase.payment

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
    if (!creditStation || !creditsPurchase) return
    const fetchTimestamp = async () => {
      try {
        const provider = creditStation.runner?.provider
        if (!provider) return
        const tx = await provider.getTransaction(payment.transactionHash)
        if (tx?.blockNumber) {
          const block = await provider.getBlock(tx.blockNumber)
          if (block) setTxTimestamp(block.timestamp)
        }
      } catch (error) {}
    }
    fetchTimestamp()
  }, [creditStation, creditsPurchase, payment.transactionHash])

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
      await enforceNetwork(
        chainId,
        walletClient,
        switchChainAsync,
        network,
        creditsPurchase.schainName
      )

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
      <div className={cls('mb-2.5', 'titleSection')}>
        <Grid container spacing={0} alignItems="center">
          <Grid size={{ xs: 12, md: 4 }}>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              to={explorer.getTxUrl(
                undefined,
                constants.MAINNET_CHAIN_NAME,
                network,
                payment.transactionHash
              )}
            >
              <div className={cls('flex', 'items-center')}>
                <Avatar
                  size={45}
                  variant="marble"
                  name={isAdmin ? payment.from : creditsPurchase.schainName + payment.id * 2n}
                  colors={AVATAR_COLORS}
                />
                <ChainIcon
                  skaleNetwork={network}
                  chainName={creditsPurchase.schainName}
                  size="xs"
                  className="creditHistoryIcon"
                />
                <div className={cls('ml-2.5', ['grow', isXs])}>
                  <h4 className={cls('p', 'font-bold', 'pOneLine', 'text-primary')}>
                    {txTimestamp && !isAdmin
                      ? timeUtils.timestampToDate(txTimestamp, true)
                      : helper.shortAddress(payment.from)}
                  </h4>
                  <p className={cls('p', 'text-xs', 'text-secondary')}>{chainAlias}</p>
                </div>
              </div>
            </Link>
          </Grid>
          <Grid size={{ xs: 12, md: 8 }} className={cls(['mt-5', isXs], 'flex', 'items-center')}>
            <div
              className={cls(
                'chipXs',
                'ml-5',
                'flex',
                'items-center',
                ['chip_DELEGATED', isFulfilled],
                ['chip_SELF', !isFulfilled]
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
                className={cls('p-0', ['mr-5', !isXs], ['ml-5', !isXs])}
                value={tokenSymbol.toUpperCase()}
                text="Token Used"
                grow
                ri={!isXs}
                icon={<TokenIcon tokenSymbol={tokenSymbol} size="xs" />}
              />
              <div className="borderVert"></div>
              <Tile
                size="md"
                transparent
                className={cls('p-0', ['mr-5', !isXs], ['ml-5', !isXs])}
                value={`ID: ${payment.id.toString()}`}
                text="Payment ID"
                grow
                ri={!isXs}
                icon={<PaymentsRoundedIcon />}
              />
            </SkStack>
            {isAdmin && (
              <div className={cls('flex', 'items-center')}>
                <Button
                  size="small"
                  className={cls('btnMd', 'filled', 'ml-5')}
                  onClick={fulfillPayment}
                  disabled={isFulfilled || loading || !ledgerContract}
                >
                  Fulfill
                </Button>
              </div>
            )}
          </Grid>
        </Grid>
      </div>
    </div>
  )
}

export default CreditsHistoryTile
