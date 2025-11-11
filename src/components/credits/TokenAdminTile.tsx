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
  cmn,
  cls,
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

import PaidRoundedIcon from '@mui/icons-material/PaidRounded'
import PriceChangeRoundedIcon from '@mui/icons-material/PriceChangeRounded'
import MonetizationOnRoundedIcon from '@mui/icons-material/MonetizationOnRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import DoDisturbOnRoundedIcon from '@mui/icons-material/DoDisturbOnRounded'

import { Contract } from 'ethers'
import { Button, Dialog, Grid, TextField } from '@mui/material'
import SkStack from '../SkStack'
import { useState } from 'react'
import Headline from '../Headline'

interface TokenAdminTileProps {
  mpc: MetaportCore
  tokenPrices: Record<string, bigint>
  loadTokenPrices: () => Promise<void>
  creditStation: Contract | undefined
  tokenMeta: types.mp.TokenMetadata | undefined
  tokenData: types.mp.Token
  symbol: string
  isXs: boolean
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
  isXs,
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
    <div className={cls(cmn.mbott10, 'titleSection')}>
      <Grid container spacing={0} alignItems="center">
        <Grid size={{ xs: 12, md: 4 }}>
          <div className={cls(cmn.flex, cmn.flexcv)}>
            <TokenIcon tokenSymbol={symbol} size="lg" iconUrl={tokenMeta?.iconUrl} />
            <div className={cls(cmn.mleft10, [cmn.flexg, isXs])}>
              <h4 className={cls(cmn.p, cmn.p700, 'pOneLine', cmn.upp)}>{symbol}</h4>
              <p className={cls(cmn.p, cmn.p4, cmn.pSec)}>{tokenMeta?.name}</p>
            </div>
          </div>
        </Grid>
        <Grid size={{ xs: 12, md: 2 }} className={cls(cmn.flex)}>
          <div
            className={cls('chipXs', getChipClass(tokenPriceWei), cmn.mri20, cmn.flex, cmn.flexcv)}
          >
            {tokenPriceWei === 0n ? <DoDisturbOnRoundedIcon /> : <CheckCircleRoundedIcon />}
            <p className={cls(cmn.p, cmn.p4, 'pOneLine', cmn.mleft5)}>
              {tokenPriceWei === 0n ? 'DISABLED' : 'ENABLED'}
            </p>
          </div>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }} className={cls(cmn.flex)}>
          <div className={cls(cmn.flexg)}></div>
          <SkStack className={cls(cmn.flex)}>
            <Tile
              size="md"
              transparent
              className={cls(cmn.nop, cmn.upp, [cmn.mri20, !isXs], [cmn.mleft20, !isXs])}
              value={units.displayBalance(
                tokenPriceWei,
                symbol,
                tokenMeta?.decimals || constants.DEFAULT_ERC20_DECIMALS
              )}
              text="1 CREDIT ="
              grow
              disabled={tokenPriceWei === 0n}
              ri={!isXs}
              icon={<PaidRoundedIcon />}
            />
            <div className="borderVert"></div>
            <Button
              size="small"
              startIcon={<PriceChangeRoundedIcon />}
              className={cls('btnSm', 'filled', cmn.mleft10)}
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
            icon={<MonetizationOnRoundedIcon className={cls(styles.chainIconxs)} />}
            className={cls(cmn.mbott20)}
            size="small"
          />
          <SkPaper className={cls(cmn.nop)}>
            <Tile
              grow
              text="Enter the new price"
              className={cls(styles.inputAmount)}
              children={
                <div className={cls(cmn.flex, cmn.flexcv, 'amountInput')}>
                  <div className={cls(cmn.flexg)}>
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
                    />
                  </div>
                  <div className={cls(cmn.p1, cmn.p, cmn.p700, cmn.mri10, cmn.upp)}>{symbol}</div>
                </div>
              }
              icon={<TokenIcon tokenSymbol={symbol} size="xs" />}
            />
          </SkPaper>
          <Button
            variant="contained"
            className={cls(styles.btnAction, cmn.mtop20)}
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
