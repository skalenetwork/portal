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
  cls,
  type MetaportCore,
  Tile,
  SkPaper,
  styles,
  TokenIcon,
  useWagmiAccount,
  sendTransaction,
  walletClientToSigner,
  useWagmiWalletClient,
  useWagmiSwitchNetwork,
  enforceNetwork
} from '@skalenetwork/metaport'
import { types, metadata, units, constants, helper, ERC_ABIS } from '@/core'

import { useState, useEffect } from 'react'
import { Grid, Button, Dialog } from '@mui/material'
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded'
import MonetizationOnRoundedIcon from '@mui/icons-material/MonetizationOnRounded'

import Logo from '../Logo'
import SkStack from '../SkStack'
import Headline from '../Headline'
import { Contract } from 'ethers'
import { Link } from 'react-router-dom'
import {
  AVATAR_COLORS,
  CREDITS_CONFIRMATION_BLOCKS,
  DEFAULT_CREDITS_AMOUNT
} from '../../core/constants'
import Avatar from 'boring-avatars'
import { BadgeDollarSign, ChevronRight, Coins, Wallet } from 'lucide-react'

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
  const [token, setToken] = useState<string>('skl')
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

  function getAmountToPayWei(): bigint {
    if (!token || !tokenPrices || !tokens[token].address) return 0n
    const tokenAddress = tokens[token].address
    if (!tokenAddress) return 0n
    const pricePerCredit = tokenPrices[tokenAddress]
    if (!pricePerCredit) return 0n
    return pricePerCredit
  }

  function getBtnText(): string {
    if (tokenBalances?.[token] === undefined) return 'Loading...'
    if (loading) return 'Processing...'
    if (tokenBalances[token] < getAmountToPayWei()) {
      return 'Insufficient Token Balance'
    }
    return 'Buy Credits'
  }

  async function buyCredits() {
    if (!creditStation) return
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
                <div className={cls('ml-2.5', ['grow', isXs])} style={{ minWidth: 0 }}>
                  <h4 className="p font-bold pOneLine text-foreground">{chainAlias}</h4>
                  <p className="p text-xs text-secondary-foreground pt-0.5 pOneLine">
                    Click for chain details
                  </p>
                </div>
              </div>
            </Link>
          </Grid>
          <Grid size={{ xs: 12, md: 8 }} className={cls('flex')}>
            <div className="grow"></div>
            <SkStack className="flex">
              <Tile
                size="lg"
                transparent
                className={cls('p-0!', ['mr-5', !isXs], ['ml-5', !isXs])}
                value={
                  chainBalance !== undefined &&
                  units.displayBalance(
                    chainBalance,
                    chainBalance === 10n ** 18n ? 'CREDIT' : 'CREDITS',
                    18
                  )
                }
                text="Available"
                grow
                ri={!isXs}
                icon={<Wallet size={17} />}
              />
              <div className="borderVert mr-4"></div>
              <div className="flex items-center">
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<AddCircleRoundedIcon />}
                  className="btnMd ml-5 bg-accent-foreground! text-accent!"
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
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'transparent',
            boxShadow: 'none'
          }
        }}
      >
        <SkPaper gray>
          <Headline
            text={`Buy Credits - ${chainAlias}`}
            icon={<MonetizationOnRoundedIcon className="text-[17px]!" />}
            size="small"
          />
          <p className="text-secondary-foreground font-medium text-sm ml-2.5 mb-2.5 mr-4">
            All purchases are converted to SKL on the backend for distribution per governance
            agreements.
          </p>
          <SkPaper className="p-0!">
            <Tile
              size="md"
              transparent
              text="Select Token to Buy Credits With"
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
                            className={cls(
                              'items-center mr-2.5! uppercase btnLg bg-accent-foreground! text-accent!',
                              ['bg-card!', symbol !== token],
                              ['text-foreground!', symbol !== token]
                            )}
                            variant="contained"
                            onClick={() => setToken(symbol)}
                          >
                            <div className="flex items-center">
                              <TokenIcon
                                tokenSymbol={symbol}
                                iconUrl={tokensMeta[symbol]?.iconUrl}
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
          <SkPaper className="p-0! mt-2.5">
            <Tile
              size="lg"
              transparent
              value={units.displayBalance(
                tokenBalances?.[token] || 0n,
                token,
                tokensMeta[token].decimals
              )}
              text={`Token Balance - ${helper.shortAddress(address)}`}
              grow
              icon={
                address && (
                  <Avatar size={17} variant="marble" name={address} colors={AVATAR_COLORS} />
                )
              }
            />
          </SkPaper>
          <Grid container spacing={1} alignItems="center" className="mt-2.5 items-center">
            <Grid size={{ xs: 6 }} className="flex items-center">
              <SkPaper className="p-0! grow">
                <Tile
                  size="lg"
                  transparent
                  value={units.displayBalance(
                    getAmountToPayWei(),
                    token,
                    tokensMeta[token].decimals
                  )}
                  text="Amount to Pay"
                  grow
                  icon={<TokenIcon size="xs" tokenSymbol={token} />}
                />
              </SkPaper>
              <div className="bg-accent-foreground text-accent! p-1 rounded-full -ml-4 z-10 border-6 border-card dark:border-black">
                <ChevronRight size={17} />
              </div>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <SkPaper className="p-0! grow -ml-4">
                <Tile
                  size="lg"
                  transparent
                  value={`${DEFAULT_CREDITS_AMOUNT} CREDITS`}
                  text="Credits to Receive"
                  grow
                  icon={<BadgeDollarSign size={17} />}
                />
              </SkPaper>
            </Grid>
          </Grid>
          <Button
            variant="contained"
            className="btn mt-4! p-4! w-full capitalize! bg-accent-foreground! disabled:bg-accent-foreground/50! text-accent!"
            startIcon={<BadgeDollarSign size={17} />}
            size="large"
            onClick={buyCredits}
            disabled={
              loading ||
              tokenBalances?.[token] === undefined ||
              tokenBalances[token] < getAmountToPayWei()
            }
          >
            {getBtnText()}
          </Button>
        </SkPaper>
      </Dialog>
    </div>
  )
}

export default ChainCreditsTile
