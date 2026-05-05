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
 * @file ChainCreditsTile.tsx
 * @copyright SKALE Labs 2025-Present
 */

import {
  type MetaportCore,
  Tile,
  SkPaper,
  useWagmiAccount,
  sendTransaction,
  useWagmiWalletClient,
  useWagmiSwitchNetwork,
  ChainIcon
} from '@skalenetwork/metaport'

import { Wallet, Fuel, HandCoins, CoinsIcon, CirclePlus, ExternalLink, ArrowLeftRight } from 'lucide-react'

import { types, contracts, metadata, units, ERC_ABIS, notify, constants } from '@/core'

import { useState, useEffect, useMemo } from 'react'
import { Grid, Button, Dialog } from '@mui/material'

import Logo from '../Logo'
import SkStack from '../SkStack'
import { Contract } from 'ethers'
import { Link } from 'react-router-dom'
import {
  CREDITS_CONFIRMATION_BLOCKS,
  DEFAULT_CREDITS_AMOUNT,
  RECOMMENDED_CREDITS_AMOUNTS,
  CREDITS_USAGE_EXAMPLE_PER_CREDIT
} from '../../core/constants'
import { prepareSignerForWrite } from '../../core/credit-station'
import CreditsAmountSelector from './CreditsAmountSelector'
import TokenSelector from './TokenSelector'
import SourceSelector from './SourceSelector'

interface ChainCreditsTileProps {
  mpc: MetaportCore
  chainsMeta: types.ChainsMetadataMap
  schain: types.ISChain
  sources: contracts.CreditStationSource[]
  creditStationBySource: Record<string, Contract>
  tokenPricesBySource: Record<string, Record<string, bigint>>
  tokenBalancesBySource: Record<string, types.mp.TokenBalancesMap | undefined>
  setErrorMsg: (msg: string | undefined) => void
  onPurchase?: () => void
}

const ChainCreditsTile: React.FC<ChainCreditsTileProps> = ({
  mpc,
  chainsMeta,
  schain,
  sources,
  creditStationBySource,
  tokenPricesBySource,
  tokenBalancesBySource,
  setErrorMsg,
  onPurchase
}) => {
  const [openModal, setOpenModal] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [token, setToken] = useState<string | undefined>(undefined)
  const [amount, setAmount] = useState<bigint>(DEFAULT_CREDITS_AMOUNT)
  const [chainBalance, setChainBalance] = useState<bigint | undefined>(undefined)
  const [selectedSourceId, setSelectedSourceId] = useState<string | undefined>(
    sources[0]?.id
  )

  const { address, chainId } = useWagmiAccount()
  const { data: walletClient } = useWagmiWalletClient({ chainId })
  const { switchChainAsync } = useWagmiSwitchNetwork()

  const network = mpc.config.skaleNetwork
  const chainAlias = metadata.getAlias(network, chainsMeta, schain.name)
  const shortAlias = metadata.getChainShortAlias(chainsMeta, schain.name)
  const tokensMeta = mpc.config.tokens

  useEffect(() => {
    if (!selectedSourceId && sources[0]) setSelectedSourceId(sources[0].id)
  }, [sources, selectedSourceId])

  const selectedSource = useMemo(
    () => sources.find((s) => s.id === selectedSourceId),
    [sources, selectedSourceId]
  )

  const sourceTokens = useMemo<Record<string, types.mp.Token>>(() => {
    if (!selectedSource) return {}
    return mpc.config.connections[selectedSource.chainName]?.erc20 ?? {}
  }, [mpc, selectedSource])

  const tokenPrices = selectedSourceId ? (tokenPricesBySource[selectedSourceId] ?? {}) : {}
  const tokenBalances = selectedSourceId ? tokenBalancesBySource[selectedSourceId] : undefined
  const creditStation = selectedSourceId ? creditStationBySource[selectedSourceId] : undefined

  useEffect(() => {
    async function loadChainBalance() {
      if (!address) return
      try {
        const provider = mpc.provider(schain.name)
        const balance = await provider.getBalance(address)
        setChainBalance(balance)
      } catch (error) {
        console.error('Failed to load chain balance:', error)
        setChainBalance(0n)
      }
    }
    loadChainBalance()
  }, [mpc, schain.name, address])

  useEffect(() => {
    const tokens = sourceTokens
    const currentAddress = token ? tokens[token]?.address : undefined
    const currentValid =
      currentAddress !== undefined && tokenPrices[currentAddress] !== undefined
    if (currentValid) return

    const match = Object.entries(tokens).find(
      ([, tokenData]) => tokenData.address && tokenPrices[tokenData.address] !== undefined
    )
    setToken(match ? match[0] : undefined)
  }, [sourceTokens, tokenPrices, token])

  function getPricePerCreditWei(): bigint {
    if (!token || !sourceTokens[token]?.address) return 0n
    const tokenAddress = sourceTokens[token].address
    if (!tokenAddress) return 0n
    return tokenPrices[tokenAddress] ?? 0n
  }

  function getAmountToPayWei(): bigint {
    return getPricePerCreditWei() * amount
  }

  const selectedSourceAlias = selectedSource
    ? metadata.getAlias(network, chainsMeta, selectedSource.chainName, undefined, true) ||
      selectedSource.displayName
    : ''

  function getBtnText(): string {
    if (!selectedSource) return 'Select a source'
    if (!token) return 'Select a token'
    if (tokenBalances?.[token] === undefined) return 'Loading...'
    if (loading) return 'Processing...'
    if (amount <= 0n) return 'Enter credits amount'
    if (tokenBalances[token] < getAmountToPayWei()) return `Insufficient ${token.toUpperCase()}`
    const totalWei = getAmountToPayWei()
    const total = token ? units.displayBalance(totalWei, token, tokensMeta[token].decimals) : ''
    return `Buy ${amount} ${amount === 1n ? 'Credit' : 'Credits'}${total ? ` · ${total}` : ''}`
  }

  function getMoreTokensAction(): { label: string; href: string; external: boolean } | undefined {
    if (!selectedSource || !token) return undefined
    const tokenSymbol = token.toUpperCase()
    if (selectedSource.chainName === constants.MAINNET_CHAIN_NAME) {
      return {
        label: `Get ${tokenSymbol} on ${selectedSourceAlias}`,
        href: `https://www.coinbase.com/buy/${token.toLowerCase()}`,
        external: true
      }
    }
    return {
      label: `Bridge ${tokenSymbol} to ${selectedSourceAlias}`,
      href: '/bridge',
      external: false
    }
  }

  async function buyCredits() {
    if (!creditStation || !token || !selectedSource) return
    if (!creditStation.runner?.provider || !walletClient || !switchChainAsync) {
      setErrorMsg('Something is wrong with your wallet, try again')
      notify.permanentError('Something is wrong with your wallet, try again')
      setOpenModal(false)
      return
    }
    setLoading(true)
    setErrorMsg(undefined)

    try {
      const tokenAddress = sourceTokens[token]?.address
      if (!tokenAddress) return

      const signer = await prepareSignerForWrite(
        creditStation,
        walletClient,
        switchChainAsync,
        network,
        selectedSource.chainName
      )

      const amountWei = getAmountToPayWei()

      const connectedToken = new Contract(tokenAddress, ERC_ABIS.erc20.abi, signer)
      const creditStationAddress = await creditStation.getAddress()

      await sendTransaction(
        signer,
        connectedToken.approve,
        [creditStationAddress, amountWei],
        'creditStation:approve',
        CREDITS_CONFIRMATION_BLOCKS
      )

      await sendTransaction(
        signer,
        creditStation.buy,
        [schain.name, address, tokenAddress, amount],
        'creditStation:buy',
        CREDITS_CONFIRMATION_BLOCKS
      )
      notify.temporarySuccess(
        `Purchased ${amount} ${amount === 1n ? 'Credit' : 'Credits'} for ${chainAlias}`
      )
      onPurchase?.()
    } catch (e: any) {
      const errMsg = e.toString()
      setErrorMsg(errMsg)
      notify.permanentError(errMsg)
    } finally {
      setLoading(false)
      setOpenModal(false)
    }
  }

  return (
    <div>
      <div className="mb-2.5 bg-background rounded-3xl p-5">
        <Grid container spacing={0} alignItems="center">
          <Grid size={{ xs: 12, md: 4 }}>
            <Link to={'/chains/' + shortAlias}>
              <div className="flex items-center">
                <Logo
                  chainsMeta={chainsMeta}
                  skaleNetwork={network}
                  chainName={schain.name}
                  size="xs"
                />
                <div className="ml-2.5 grow" style={{ minWidth: 0 }}>
                  <h4 className="p font-bold pOneLine text-foreground">{chainAlias}</h4>
                  <p className="p text-xs text-secondary-foreground pt-0.5 pOneLine font-medium">
                    Click for chain details
                  </p>
                </div>
              </div>
            </Link>
          </Grid>
          <Grid size={{ xs: 12, md: 8 }} className="flex">
            <div className="md:grow"></div>
            <SkStack className="flex mt-6 md:mt-0">
              <Tile
                size="lg"
                transparent
                className="p-0! mr-5! ml-5!"
                value={
                  chainBalance !== undefined &&
                  units.displayBalance(
                    chainBalance,
                    chainBalance === 10n ** 18n ? 'CREDIT' : 'CREDITS',
                    18
                  )
                }
                text="Balance"
                grow
                ri={true}
                icon={<Wallet size={14} />}
              />
              <div className="border-l-2 border-border mr-4"></div>
              <div className="flex items-center ml-6 md:ml-0">
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<CirclePlus size={14} />}
                  className="btnMd ml-5 bg-accent-foreground! disabled:text-foreground/70! disabled:bg-accent-foreground/15! text-accent! ease-in-out transition-transform duration-150 active:scale-[0.97]"
                  onClick={() => setOpenModal(true)}
                  disabled={sources.length === 0}
                >
                  Buy Credits
                </Button>
              </div>
            </SkStack>
          </Grid>
        </Grid>
      </div>
      <Dialog
        open={openModal}
        onClose={() => {
          setOpenModal(false)
          setAmount(DEFAULT_CREDITS_AMOUNT)
        }}
        maxWidth={false}
        fullWidth
        BackdropProps={{
          sx: {
            backdropFilter: 'blur(4px)'
          }
        }}
        PaperProps={{
          sx: {
            background: 'transparent',
            boxShadow: 'none',
            margin: { xs: '8px', sm: '24px', md: '24px' },
            width: { xs: 'calc(100% - 16px)', sm: '100%' },
            maxWidth: { xs: 'calc(100% - 16px)', sm: '820px' },
            maxHeight: { xs: 'calc(100% - 16px)', sm: 'calc(100% - 64px)' }
          }
        }}
      >
        <SkPaper gray className="p-4! md:p-6!">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-x-8 gap-y-6 pb-8 px-1">
            <div className="min-w-0 lg:shrink-0">
              <h2 className="m-0 text-xl font-bold text-foreground leading-tight">Buy Credits</h2>
              <div className="mt-2 flex items-center gap-1.5">
                <ChainIcon size="xxs" chainName={schain.name} skaleNetwork={network} />
                <span className="text-[11px] font-semibold text-muted-foreground truncate">
                  {chainAlias}
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-x-6 gap-y-4">
              <div className="flex flex-col gap-1 min-w-0">
                <span className="text-[11px] font-semibold text-muted-foreground px-1">
                  Paying on
                </span>
                <SourceSelector
                  sources={sources}
                  selectedId={selectedSourceId}
                  onSelect={setSelectedSourceId}
                  skaleNetwork={network}
                  chainsMeta={chainsMeta}
                  disabled={loading}
                />
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <span className="text-[11px] font-semibold text-muted-foreground px-1">
                  Paying with
                </span>
                <TokenSelector
                  tokens={sourceTokens}
                  tokensMeta={tokensMeta}
                  tokenPrices={tokenPrices}
                  tokenBalances={tokenBalances}
                  selected={token}
                  onSelect={setToken}
                />
              </div>
            </div>
          </div>
          <CreditsAmountSelector
            recommended={RECOMMENDED_CREDITS_AMOUNTS}
            amount={amount}
            setAmount={setAmount}
            pricePerCreditWei={getPricePerCreditWei()}
            tokenSymbol={token}
            tokenDecimals={(token ? tokensMeta[token]?.decimals : undefined) ?? 18}
          />
          {(() => {
            const insufficient =
              token !== undefined &&
              tokenBalances?.[token] !== undefined &&
              tokenBalances[token] < getAmountToPayWei() &&
              amount > 0n
            const action = insufficient ? getMoreTokensAction() : undefined
            const baseBtnClasses =
              'btn py-5! px-5! capitalize! ease-in-out transition-transform duration-150 active:scale-[0.99]'
            const primaryBtnClasses =
              'bg-accent-foreground! text-accent! disabled:bg-secondary-foreground/10! disabled:text-foreground!'
            const buyBtn = (
              <Button
                variant="contained"
                className={`${baseBtnClasses} ${primaryBtnClasses} ${action ? 'flex-1 min-w-0' : 'w-full'}`}
                startIcon={<CoinsIcon size={17} />}
                size="large"
                onClick={buyCredits}
                disabled={
                  !selectedSource ||
                  !creditStation ||
                  token === undefined ||
                  loading ||
                  amount <= 0n ||
                  tokenBalances?.[token] === undefined ||
                  tokenBalances[token] < getAmountToPayWei()
                }
              >
                {getBtnText()}
              </Button>
            )
            if (!action) {
              return <div className="mt-6">{buyBtn}</div>
            }
            const actionIcon = action.external ? (
              <ExternalLink size={17} />
            ) : (
              <ArrowLeftRight size={17} />
            )
            const actionClassName = `${baseBtnClasses} ${primaryBtnClasses} shrink-0`
            const getBtn = action.external ? (
              <Button
                variant="contained"
                className={actionClassName}
                size="large"
                href={action.href}
                target="_blank"
                rel="noreferrer"
                endIcon={actionIcon}
              >
                {action.label}
              </Button>
            ) : (
              <Button
                component={Link}
                to={action.href}
                variant="contained"
                className={actionClassName}
                size="large"
                onClick={() => setOpenModal(false)}
                endIcon={actionIcon}
              >
                {action.label}
              </Button>
            )
            return (
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                {buyBtn}
                {getBtn}
              </div>
            )
          })()}
          <p className="text-muted-foreground text-sm font-medium mt-5 px-2 text-center leading-relaxed">
            Enough for an estimated <Fuel size={14} className="inline align-[-2px] mr-1" />
            {Number(amount * CREDITS_USAGE_EXAMPLE_PER_CREDIT.gasUnits).toLocaleString()} gas units
            and <HandCoins size={14} className="inline align-[-2px] mr-1" />
            {Number(amount * CREDITS_USAGE_EXAMPLE_PER_CREDIT.x402).toLocaleString()} agent payments
          </p>
          <p className="text-muted-foreground/80 text-[10px] font-medium mt-5 px-2 text-center">
            Estimates may change based on chain consumption.
            <br />
            All purchases are converted to SKL on the backend for distribution per governance
            agreements.
          </p>
        </SkPaper>
      </Dialog>
    </div>
  )
}

export default ChainCreditsTile
