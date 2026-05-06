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
 * @file CreditsPaymentTile.tsx
 * @copyright SKALE Labs 2025-Present
 */

import { useState, useEffect, useMemo } from 'react'
import Avatar from 'boring-avatars'
import { Contract } from 'ethers'

import { Grid, Button, Tooltip } from '@mui/material'
import HistoryToggleOffRoundedIcon from '@mui/icons-material/HistoryToggleOffRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'

import {
  type MetaportCore,
  Tile,
  ChainIcon,
  TokenIcon,
  explorer,
  useWagmiAccount,
  sendTransaction,
  useWagmiWalletClient,
  useWagmiSwitchNetwork
} from '@skalenetwork/metaport'
import { types, contracts as coreContracts, timeUtils, helper, metadata, notify } from '@/core'

import SkStack from '../SkStack'

import * as cs from '../../core/credit-station'
import { CREDITS_CONFIRMATION_BLOCKS, AVATAR_COLORS } from '../../core/constants'
import { BadgeCheck, ExternalLink, HandCoins, IdCard } from 'lucide-react'

interface CreditsPaymentTileProps {
  mpc: MetaportCore
  payment: cs.Payment
  chainsMeta: types.ChainsMetadataMap
  ledgerContract: Contract | undefined
  source: coreContracts.CreditStationSource | undefined
  isAdmin?: boolean
  setErrorMsg: (msg: string | undefined) => void
}

const CreditsPaymentTile: React.FC<CreditsPaymentTileProps> = ({
  mpc,
  payment,
  chainsMeta,
  ledgerContract,
  source,
  isAdmin = false,
  setErrorMsg
}) => {
  const network = mpc.config.skaleNetwork

  const sourceTokens = useMemo<Record<string, types.mp.Token>>(() => {
    if (!source) return {}
    return mpc.config.connections[source.chainName]?.erc20 ?? {}
  }, [mpc, source])

  const sourceAlias = source
    ? metadata.getAlias(network, chainsMeta, source.chainName, undefined, true) ||
    source.displayName
    : ''

  const tokenSymbol =
    Object.keys(sourceTokens).find(
      (symbol) => sourceTokens[symbol].address?.toLowerCase() === payment.tokenAddress.toLowerCase()
    ) || 'unknown'

  const displayPaymentId = cs.getLedgerPaymentId(payment.id)

  const credits = payment.value
  const creditsLabel = `${credits} ${credits === 1n ? 'Credit' : 'Credits'}`
  const txTimestamp = payment.timestamp

  const [isFulfilled, setIsFulfilled] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const { chainId } = useWagmiAccount()
  const { data: walletClient } = useWagmiWalletClient({ chainId })
  const { switchChainAsync } = useWagmiSwitchNetwork()

  useEffect(() => {
    if (!ledgerContract) return
    const checkFulfillment = async () => {
      try {
        setIsFulfilled(await ledgerContract.isFulfilled(payment.id))
      } catch (error) { }
    }
    checkFulfillment()
    const interval = setInterval(checkFulfillment, 10000)
    return () => clearInterval(interval)
  }, [ledgerContract, payment.id])

  async function fulfillPayment() {
    if (!ledgerContract) return
    setLoading(true)
    setErrorMsg(undefined)

    try {
      const signer = await cs.prepareSignerForWrite(
        ledgerContract,
        walletClient,
        switchChainAsync,
        network,
        payment.schainName
      )

      await sendTransaction(
        signer,
        ledgerContract.fulfill,
        [payment.id, payment.to],
        'ledger:fulfill',
        CREDITS_CONFIRMATION_BLOCKS,
        payment.value
      )
      notify.temporarySuccess('Payment fulfilled')
    } catch (e: any) {
      const errMsg = e.toString()
      setErrorMsg(errMsg)
      notify.permanentError(errMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-2.5 bg-background rounded-3xl p-4">
        <Grid container spacing={0} alignItems="center">
          <Grid size={{ xs: 12, md: 4 }} className="flex items-center">
            <div className="flex items-center">
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
              <div className="ml-2.5 grow">
                <h4 className="font-bold pOneLine text-foreground text-xl leading-tight">
                  {creditsLabel}
                </h4>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  {txTimestamp && (
                    <Tooltip title={timeUtils.timestampToFull(txTimestamp)} arrow placement="top">
                      <p className="p text-xs text-muted-foreground font-medium cursor-default">
                        {timeUtils.timestampToRelative(txTimestamp)}
                      </p>
                    </Tooltip>
                  )}
                  {source && (
                    <>
                      {txTimestamp && <span className="text-muted-foreground/50 text-xs">·</span>}
                      <Tooltip title={`Paid on ${sourceAlias}`} arrow placement="top">
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-medium cursor-default">
                          <ChainIcon
                            skaleNetwork={network}
                            chainName={source.chainName}
                            size="xxs"
                          />
                          <span className="truncate max-w-[120px]">{sourceAlias}</span>
                        </span>
                      </Tooltip>
                    </>
                  )}
                  {isAdmin && (
                    <>
                      <span className="text-muted-foreground/50 text-xs">·</span>
                      <Tooltip title={payment.from} arrow placement="top">
                        <a
                          href={explorer.getExplorerUrlForAddress(
                            undefined,
                            network,
                            source?.chainName ?? payment.schainName,
                            payment.from
                          )}
                          target="_blank"
                          rel="noreferrer"
                          className="p text-xs text-muted-foreground hover:text-foreground font-medium inline-flex items-center gap-1"
                        >
                          {helper.shortAddress(payment.from)}
                          <ExternalLink size={11} />
                        </a>
                      </Tooltip>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Grid>
          <Grid size={{ xs: 12, md: 8 }} className="flex items-center">
            <div
              className={`chipXs ml-5 flex items-center ${isFulfilled ? 'chip_DELEGATED' : 'chip_SELF'} font-semibold`}
            >
              {isFulfilled ? <CheckCircleRoundedIcon /> : <HistoryToggleOffRoundedIcon />}
              <p className="p text-xs pOneLine ml-1.5">{isFulfilled ? 'COMPLETED' : 'PENDING'}</p>
            </div>
            <div className="grow"></div>
            <SkStack className="flex">
              <Tile
                size="md"
                transparent
                className="p-0! mr-5 md:ml-5"
                value={tokenSymbol.toUpperCase()}
                text="Token Used"
                grow
                ri={true}
                icon={<TokenIcon tokenSymbol={tokenSymbol} size="xs" />}
              />
              <div className="border-l-2 border-border"></div>
              <Tile
                size="md"
                transparent
                className="p-0! mr-5 ml-5"
                value={`ID: ${displayPaymentId.toString()}`}
                text="Payment ID"
                grow
                ri={true}
                icon={<IdCard size={17} />}
              />
            </SkStack>
            {isAdmin && (
              <div className="flex items-center">
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
