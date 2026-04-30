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

import {
  Wallet,
  Fuel,
  HandCoins,
  CoinsIcon,
  CirclePlus
} from 'lucide-react'

import { types, metadata, units, constants, ERC_ABIS, notify } from '@/core'

import { useState, useEffect } from 'react'
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

interface ChainCreditsTileProps {
  mpc: MetaportCore
  chainsMeta: types.ChainsMetadataMap
  schain: types.ISChain
  creditStation: Contract | undefined
  tokenPrices: Record<string, bigint>
  tokenBalances: types.mp.TokenBalancesMap | undefined
  setErrorMsg: (msg: string | undefined) => void
  onPurchase?: () => void
}

const ChainCreditsTile: React.FC<ChainCreditsTileProps> = ({
  mpc,
  chainsMeta,
  schain,
  creditStation,
  tokenPrices,
  tokenBalances,
  setErrorMsg,
  onPurchase
}) => {
  const [openModal, setOpenModal] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [token, setToken] = useState<string | undefined>(undefined)
  const [amount, setAmount] = useState<bigint>(DEFAULT_CREDITS_AMOUNT)
  const [chainBalance, setChainBalance] = useState<bigint | undefined>(undefined)

  const { address, chainId } = useWagmiAccount()
  const { data: walletClient } = useWagmiWalletClient({ chainId })
  const { switchChainAsync } = useWagmiSwitchNetwork()

  const network = mpc.config.skaleNetwork
  const chainAlias = metadata.getAlias(network, chainsMeta, schain.name)
  const shortAlias = metadata.getChainShortAlias(chainsMeta, schain.name)
  const tokens = mpc.config.connections.mainnet?.erc20
  const tokensMeta = mpc.config.tokens

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
    if (token !== undefined) return
    if (!tokens || !tokenPrices) return
    const match = Object.entries(tokens).find(
      ([, tokenData]) => tokenData.address && tokenPrices[tokenData.address] !== undefined
    )
    if (!match) return
    setToken(match[0])
  }, [tokens, tokenPrices, token])

  function getPricePerCreditWei(): bigint {
    if (!token || !tokenPrices || !tokens[token].address) return 0n
    const tokenAddress = tokens[token].address
    if (!tokenAddress) return 0n
    return tokenPrices[tokenAddress] ?? 0n
  }

  function getAmountToPayWei(): bigint {
    return getPricePerCreditWei() * amount
  }

  function getBtnText(): string {
    if (!token) return 'Select a token'
    if (tokenBalances?.[token] === undefined) return 'Loading...'
    if (loading) return 'Processing...'
    if (amount <= 0n) return 'Enter credits amount'
    if (tokenBalances[token] < getAmountToPayWei()) return 'Insufficient funds'
    const totalWei = getAmountToPayWei()
    const total = token ? units.displayBalance(totalWei, token, tokensMeta[token].decimals) : ''
    return `Buy ${amount} ${amount === 1n ? 'Credit' : 'Credits'}${total ? ` · ${total}` : ''}`
  }

  async function buyCredits() {
    if (!creditStation || !token) return
    if (!creditStation.runner?.provider || !walletClient || !switchChainAsync) {
      setErrorMsg('Something is wrong with your wallet, try again')
      notify.permanentError('Something is wrong with your wallet, try again')
      setOpenModal(false)
      return
    }
    setLoading(true)
    setErrorMsg(undefined)

    try {
      const tokenAddress = tokens[token].address
      if (!tokenAddress) return

      const signer = await prepareSignerForWrite(
        creditStation,
        walletClient,
        switchChainAsync,
        network,
        constants.MAINNET_CHAIN_NAME
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
        [schain.name, address, tokens[token].address, amount],
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
                  disabled={creditStation === undefined}
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
          <div className="flex items-center gap-3 pb-6 px-1">
            <div className="grow min-w-0">
              <h2 className="m-0 text-xl font-bold text-foreground leading-tight">Buy Credits</h2>
              <div className="mt-1.5 flex items-center gap-1.5">
                <ChainIcon size="xxs" chainName={schain.name} skaleNetwork={network} />
                <span className="text-[11px] font-semibold text-muted-foreground truncate">
                  {chainAlias}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] font-semibold text-muted-foreground">Paying with</span>
              <TokenSelector
                tokens={tokens}
                tokensMeta={tokensMeta}
                tokenPrices={tokenPrices}
                tokenBalances={tokenBalances}
                selected={token}
                onSelect={setToken}
              />
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
          <Button
            variant="contained"
            className="btn mt-6! py-5! px-4! w-full capitalize! bg-accent-foreground! disabled:text-foreground/70! disabled:bg-accent-foreground/15! text-accent!"
            startIcon={<CoinsIcon size={17} />}
            size="large"
            onClick={buyCredits}
            disabled={
              token === undefined ||
              loading ||
              amount <= 0n ||
              tokenBalances?.[token] === undefined ||
              tokenBalances[token] < getAmountToPayWei()
            }
          >
            {getBtnText()}
          </Button>
          <p className="text-muted-foreground text-sm font-medium mt-5 px-2 text-center leading-relaxed">
            Enough for an estimated{' '}
            <Fuel size={14} className="inline align-[-2px] mr-1" />
            {Number(amount * CREDITS_USAGE_EXAMPLE_PER_CREDIT.gasUnits).toLocaleString()}
            {' '}gas units and{' '}
            <HandCoins size={14} className="inline align-[-2px] mr-1" />
            {Number(amount * CREDITS_USAGE_EXAMPLE_PER_CREDIT.x402).toLocaleString()}
            {' '}agent payments
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
