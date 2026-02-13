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
 * @file TokenAdminTile.tsx
 * @copyright SKALE Labs 2025-Present
 */

import {
  styles,
  type MetaportCore,
  Tile,
  TokenIcon,
  SkPaper,
  enforceNetwork,
  useWagmiAccount,
  useWagmiWalletClient,
  useWagmiSwitchNetwork,
  sendTransaction,
  walletClientToSigner
} from '@skalenetwork/metaport'
import { types, units, constants } from '@/core'

import MonetizationOnRoundedIcon from '@mui/icons-material/MonetizationOnRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import DoDisturbOnRoundedIcon from '@mui/icons-material/DoDisturbOnRounded'

import { Contract } from 'ethers'
import { Button, Dialog, Grid, TextField } from '@mui/material'
import SkStack from '../SkStack'
import { useState } from 'react'
import Headline from '../Headline'
import { Bolt, Coins } from 'lucide-react'

interface TokenAdminTileProps {
  mpc: MetaportCore
  tokenPrices: Record<string, bigint>
  loadTokenPrices: () => Promise<void>
  creditStation: Contract | undefined
  tokenMeta: types.mp.TokenMetadata | undefined
  tokenData: types.mp.Token
  symbol: string
  setErrorMsg: (msg: string) => void
}

const TokenAdminTile: React.FC<TokenAdminTileProps> = ({
  mpc,
  tokenPrices,
  loadTokenPrices,
  creditStation,
  tokenMeta,
  tokenData,
  symbol,
  setErrorMsg
}) => {
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [price, setPrice] = useState<string>('')

  const network = mpc.config.skaleNetwork

  const { chainId } = useWagmiAccount()
  const { data: walletClient } = useWagmiWalletClient({ chainId })
  const { switchChainAsync } = useWagmiSwitchNetwork()

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (parseFloat(event.target.value) < 0) {
      setPrice('')
      return
    }
    setPrice(event.target.value)
  }

  async function updatePrice() {
    if (!creditStation || price === '') return
    if (!creditStation.runner?.provider || !walletClient || !switchChainAsync) {
      setErrorMsg('Something is wrong with your wallet, try again')
      setOpenModal(false)
      return
    }
    setLoading(true)
    const decimals = tokenMeta?.decimals || constants.DEFAULT_ERC20_DECIMALS
    const priceWei = units.toWei(price.toString(), decimals)

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

    await sendTransaction(
      signer,
      creditStation.setPrice,
      [tokenData.address, priceWei],
      'creditStation:setPrice'
    )

    await loadTokenPrices()
    setLoading(false)
    setOpenModal(false)
  }

  function getTokenPriceWei(): bigint {
    if (tokenData.address === undefined) return 0n
    const priceWei = tokenPrices[tokenData.address]
    if (priceWei === undefined) return 0n
    return priceWei
  }

  function getChipClass(tokenPriceWei: bigint): string {
    if (tokenPriceWei === 0n) {
      return 'chip_CANCELED'
    }
    return 'chip_DELEGATED'
  }

  const tokenPriceWei = getTokenPriceWei()

  return (
    <div className="mb-2.5 bg-background rounded-3xl p-4">
      <Grid container spacing={0} alignItems="center">
        <Grid size={{ xs: 12, md: 4 }}>
          <div className="flex items-center">
            <TokenIcon tokenSymbol={symbol} size="lg" iconUrl={tokenMeta?.iconUrl} />
            <div className="ml-3.5 grow sm:grow-0">
              <h4 className="p font-bold pOneLine uppercase text-foreground">{symbol}</h4>
              <p className="p text-xs text-muted-foreground font-semibold">{tokenMeta?.name}</p>
            </div>
          </div>
        </Grid>
        <Grid size={{ xs: 12, md: 2 }} className="flex">
          <div className={`chipXs ${getChipClass(tokenPriceWei)} mr-5 flex items-center`}>
            {tokenPriceWei === 0n ? <DoDisturbOnRoundedIcon /> : <CheckCircleRoundedIcon />}
            <p className="p text-xs pOneLine ml-1.5 font-semibold">
              {tokenPriceWei === 0n ? 'DISABLED' : 'ENABLED'}
            </p>
          </div>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }} className="flex">
          <div className="grow"></div>
          <SkStack className="flex">
            <Tile
              size="md"
              transparent
              className="p-0! uppercase md:mr-5 md:ml-5"
              value={units.displayBalance(
                tokenPriceWei,
                symbol,
                tokenMeta?.decimals || constants.DEFAULT_ERC20_DECIMALS
              )}
              text="1 CREDIT ="
              grow
              ri={true}
              disabled={tokenPriceWei === 0n}
              icon={<Coins size={17} />}
            />
            <Button
              size="small"
              startIcon={<Bolt size={17} />}
              className="btnSm bg-secondary-foreground/10! text-foreground! ml-2.5"
              onClick={() => setOpenModal(true)}
              disabled={creditStation === undefined}
            >
              Change Price
            </Button>
          </SkStack>
        </Grid>
      </Grid>
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
            text={`Set CREDIT Price - ${tokenMeta?.name}`}
            icon={<MonetizationOnRoundedIcon className="text-[17px]!" />}
            className="mb-2"
            size="small"
          />
          <SkPaper className="p-0!">
            <Tile
              grow
              text="Enter the new price"
              className={styles.inputAmount}
              children={
                <div className="flex items-center amountInput">
                  <div className="grow">
                    <TextField
                      inputProps={{ step: '0.1', lang: 'en-US' }}
                      inputRef={(input) => input?.focus()}
                      type="number"
                      variant="standard"
                      placeholder="0.00"
                      value={price}
                      onChange={handleAmountChange}
                      disabled={!!loading}
                      style={{ width: '100%' }}
                      sx={{
                        '& .MuiInputBase-input': {
                          color: 'var(--foreground)'
                        }
                      }}
                    />
                  </div>
                  <div className="text-xs p font-bold text-foreground! mr-2.5 uppercase">
                    {symbol}
                  </div>
                </div>
              }
              icon={<TokenIcon tokenSymbol={symbol} size="xs" />}
            />
          </SkPaper>
          <Button
            variant="contained"
            className="btnMd ml-5 w-full mt-4! mb-2! bg-accent-foreground! disabled:bg-muted-foreground/30! disabled:text-muted! text-accent! ease-in-out transition-transform duration-150 active:scale-[0.97]"
            size="large"
            onClick={updatePrice}
            disabled={loading || price === ''}
          >
            Set Price
          </Button>
        </SkPaper>
      </Dialog>
    </div>
  )
}

export default TokenAdminTile
