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
  TokenIcon,
  useWagmiAccount,
  sendTransaction,
  walletClientToSigner,
  useWagmiWalletClient,
  useWagmiSwitchNetwork,
  enforceNetwork,
  ChainIcon
} from '@skalenetwork/metaport'

import {
  Coins,
  Wallet,
  ArrowRightLeft,
  Shuffle,
  Fuel,
  HandCoins,
  ArrowRight,
  CoinsIcon,
  CirclePlus
} from 'lucide-react'

import { types, metadata, units, constants, ERC_ABIS } from '@/core'
import { MAINNET_ALIASES } from '@/core/networks'

import { useState, useEffect } from 'react'
import { Grid, Button, Dialog } from '@mui/material'

import Logo from '../Logo'
import SkStack from '../SkStack'
import { Contract } from 'ethers'
import { Link } from 'react-router-dom'
import {
  CREDITS_CONFIRMATION_BLOCKS,
  DEFAULT_CREDITS_AMOUNT,
  CREDITS_USAGE_EXAMPLE_PER_CREDIT
} from '../../core/constants'

interface ChainCreditsTileProps {
  mpc: MetaportCore
  chainsMeta: types.ChainsMetadataMap
  schain: types.ISChain
  isXs: boolean
  creditStation: Contract | undefined
  tokenPrices: Record<string, bigint>
  tokenBalances: types.mp.TokenBalancesMap | undefined
  setErrorMsg: (msg: string | undefined) => void
}

const ChainCreditsTile: React.FC<ChainCreditsTileProps> = ({
  mpc,
  chainsMeta,
  schain,
  isXs,
  creditStation,
  tokenPrices,
  tokenBalances,
  setErrorMsg
}) => {
  const [openModal, setOpenModal] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [token, setToken] = useState<string | undefined>(undefined)
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
    if (!tokens || !tokenPrices) return
    const match = Object.entries(tokens).find(([, tokenData]) => {
      if (!tokenData.address) return false
      return tokenPrices[tokenData.address] !== undefined
    })
    if (!match) return
    const [symbol] = match
    setToken((prev) => (prev === symbol ? prev : symbol))
  }, [tokenPrices])

  function getAmountToPayWei(): bigint {
    if (!token || !tokenPrices || !tokens[token].address) return 0n
    const tokenAddress = tokens[token].address
    if (!tokenAddress) return 0n
    const pricePerCredit = tokenPrices[tokenAddress]
    if (!pricePerCredit) return 0n
    return pricePerCredit
  }

  function getBtnText(): string {
    if (!token) return 'Select a token'
    if (tokenBalances?.[token] === undefined) return 'Loading...'
    if (loading) return 'Processing...'
    if (tokenBalances[token] < getAmountToPayWei()) {
      const displayBalance = units.displayBalance(
        tokenBalances?.[token] || 0n,
        token,
        tokensMeta[token].decimals
      )
      return 'Insufficient Token Balance: ' + displayBalance
    }
    return `Buy ${DEFAULT_CREDITS_AMOUNT} Credits`
  }

  async function buyCredits() {
    if (!creditStation || !token) return
    if (!creditStation.runner?.provider || !walletClient || !switchChainAsync) {
      setErrorMsg('Something is wrong with your wallet, try again')
      setOpenModal(false)
      return
    }
    setLoading(true)
    setErrorMsg(undefined)

    try {
      const tokenAddress = tokens[token].address
      if (!tokenAddress) return

      const { chainId } = await creditStation.runner.provider.getNetwork()
      await enforceNetwork(
        chainId,
        walletClient,
        switchChainAsync,
        network,
        constants.MAINNET_CHAIN_NAME
      )

      const signer = walletClientToSigner(walletClient)
      creditStation.connect(signer)

      const amountWei = getAmountToPayWei()

      const connectedToken = new Contract(tokenAddress, ERC_ABIS.erc20.abi, signer)
      const creditStationAddress = await creditStation.getAddress()

      const approveRes = await sendTransaction(
        signer,
        connectedToken.approve,
        [creditStationAddress, amountWei],
        'creditStation:approve',
        CREDITS_CONFIRMATION_BLOCKS
      )
      if (!approveRes.status) {
        setErrorMsg(approveRes.err?.name)
        return
      }

      const res = await sendTransaction(
        signer,
        creditStation.buy,
        [schain.name, address, tokens[token].address],
        'creditStation:buy',
        CREDITS_CONFIRMATION_BLOCKS
      )
      if (!res.status) {
        setErrorMsg(res.err?.name)
        return
      }
    } catch (e: any) {
      console.error(e)
      setErrorMsg(e.toString())
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
                ri={!isXs}
                icon={<Wallet size={14} />}
              />
              <div className="border-l-2 border-border mr-4"></div>
              <div className="flex items-center ml-6 md:ml-0">
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<CirclePlus size={14} />}
                  className="btnMd ml-5 bg-accent-foreground! disabled:bg-accent-foreground/50! text-accent! ease-in-out transition-transform duration-150 active:scale-[0.97]"
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
        onClose={() => setOpenModal(false)}
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
            width: { xs: 'calc(100% - 16px)', sm: 'auto' },
            maxWidth: { xs: 'calc(100% - 16px)', sm: 'calc(100% - 64px)' },
            maxHeight: { xs: 'calc(100% - 16px)', sm: 'calc(100% - 64px)' }
          }
        }}
      >
        <SkPaper gray className="p-3! md:p-4!">
          <div className="grow pb-2.5 pl-1">
            <h2 className="m-0 text-2xl font-bold text-foreground ">Buy Credits</h2>
          </div>
          <SkPaper className="p-0!">
            <Tile
              size="lg"
              transparent
              text={`Select the token to pay with on ${MAINNET_ALIASES[network]}`}
              className="py-5! px-6! mb-4"
              grow
              icon={<Coins size={17} />}
              children={
                <div className="flex mt-2">
                  {Object.entries(tokens).map(
                    ([symbol, tokenData]) =>
                      tokenData.address &&
                      tokenPrices[tokenData.address] && (
                        <div key={symbol}>
                          <Button
                            color="primary"
                            size="small"
                            className={`items-center mr-2.5! p-4! py-3! pr-5! rounded-full! uppercase btnLg bg-accent-foreground/30! text-foreground! ease-in-out transition-transform duration-150 active:scale-[0.97] ${symbol !== token ? 'bg-card!' : ''} ${symbol !== token ? 'text-foreground!' : ''}`}
                            variant="contained"
                            onClick={() => setToken(symbol)}
                          >
                            <div className="flex items-center">
                              <TokenIcon
                                tokenSymbol={symbol}
                                iconUrl={tokensMeta[symbol]?.iconUrl}
                                size="sm"
                              />
                              <span className="p ml-2.5 uppercase">{symbol}</span>
                            </div>
                          </Button>
                        </div>
                      )
                  )}
                </div>
              }
            />
          </SkPaper>
          <div className="relative">
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, md: 6 }}>
                <Tile
                  className="py-5! px-6!"
                  children={
                    <div>
                      <p className="inline-flex max-w-full items-center justify-start font-medium text-sm text-muted-foreground mb-1.5 overflow-hidden">
                        Pay on{' '}
                        <ChainIcon
                          size="xxs"
                          chainName={constants.MAINNET_CHAIN_NAME}
                          skaleNetwork={network}
                          className="mx-1.5"
                        />{' '}
                        {MAINNET_ALIASES[network]}
                      </p>
                      <p className="text-foreground font-bold text-3xl grow">
                        {token &&
                          units.displayBalance(
                            getAmountToPayWei(),
                            token,
                            tokensMeta[token].decimals
                          )}
                      </p>
                    </div>
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }} className="md:items-end md:text-right">
                <Tile
                  className="py-5! px-6!"
                  children={
                    <div>
                      <p className="inline-flex max-w-full items-center justify-end font-medium text-sm text-muted-foreground mb-1.5 overflow-hidden">
                        <span className="shrink-0 flex items-center">
                          Receive on{' '}
                          <ChainIcon
                            size="xxs"
                            chainName={schain.name}
                            skaleNetwork={network}
                            className="mx-1.5"
                          />
                        </span>
                        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                          {chainAlias}
                        </span>
                      </p>
                      <p className="text-foreground font-bold text-3xl">
                        {DEFAULT_CREDITS_AMOUNT} CREDITS
                      </p>
                    </div>
                  }
                />
              </Grid>
            </Grid>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div className="flex items-center justify-center bg-accent-foreground rounded-full p-2 pointer-events-auto border-10 border-card dark:border-0 rotate-90! md:rotate-0!">
                <ArrowRight size={17} className="text-accent!" />
              </div>
            </div>
          </div>
          <Button
            variant="contained"
            className="btn mt-4! p-4! w-full capitalize! bg-accent-foreground! disabled:bg-accent-foreground/50! text-accent!"
            startIcon={<CoinsIcon size={17} />}
            size="large"
            onClick={buyCredits}
            disabled={
              token === undefined ||
              loading ||
              tokenBalances?.[token] === undefined ||
              tokenBalances[token] < getAmountToPayWei()
            }
          >
            {getBtnText()}
          </Button>
          <p className="text-foreground font-medium text-sm flex items-center mb-2.5 mt-4 ml-1">
            {DEFAULT_CREDITS_AMOUNT} CREDITS is enough for thousands of transactions depending on
            type:
          </p>
          <div className="p-1 px-4">
            <p className="text-foreground font-medium text-sm flex items-center mb-2.5">
              <ArrowRightLeft size={17} className="mr-2.5 text-muted-foreground/80" />
              {Number(
                DEFAULT_CREDITS_AMOUNT * CREDITS_USAGE_EXAMPLE_PER_CREDIT.transfers
              ).toLocaleString()}{' '}
              Credit transfers
            </p>
            <p className="text-foreground font-medium text-sm flex items-center mb-2.5">
              <HandCoins size={17} className="mr-2.5 text-muted-foreground/80" />
              {Number(
                DEFAULT_CREDITS_AMOUNT * CREDITS_USAGE_EXAMPLE_PER_CREDIT.x402
              ).toLocaleString()}{' '}
              x402 transfers
            </p>
            <p className="text-foreground font-medium text-sm flex items-center mb-2.5">
              <Shuffle size={17} className="mr-2.5 text-muted-foreground/80" />
              {Number(
                DEFAULT_CREDITS_AMOUNT * CREDITS_USAGE_EXAMPLE_PER_CREDIT.ammSwaps
              ).toLocaleString()}{' '}
              AMM swaps
            </p>
            <p className="text-foreground font-medium text-sm flex items-center mb-2.5">
              <Fuel size={17} className="mr-2.5 text-muted-foreground/80" />
              {Number(
                DEFAULT_CREDITS_AMOUNT * CREDITS_USAGE_EXAMPLE_PER_CREDIT.gasUnits
              ).toLocaleString()}{' '}
              Gas units
            </p>
          </div>
          <div className="px-2 py-1">
            <p className="text-muted-foreground/80 text-xs font-medium pb-2">
              These are estimated transaction amounts which can change at any time based on chain
              consumption.
            </p>
            <p className="text-muted-foreground/80 text-xs font-medium">
              All purchases are converted to SKL on the backend for distribution per governance
              agreements.
            </p>
          </div>
        </SkPaper>
      </Dialog>
    </div>
  )
}

export default ChainCreditsTile
