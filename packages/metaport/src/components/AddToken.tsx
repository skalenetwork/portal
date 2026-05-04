/**
 * @license
 * SKALE Metaport
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
 * @file AddToken.ts
 * @copyright SKALE Labs 2023-Present
 */

import { useState } from 'react'
import { Provider } from 'ethers'
import { useWalletClient, useSwitchChain } from 'wagmi'
import { dc, constants, notify } from '@/core'

import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'

import MetaportCore, { createTokenData } from '../core/metaport'
import { enforceNetwork } from '../core/network'
import { ICONS_BASE_URL } from '../core/constants'
import { BadgePlus, Coins } from 'lucide-react'

export default function AddToken(props: {
  token: dc.TokenData
  destChainName: string
  mpc: MetaportCore
  provider: Provider
  iconOnly?: boolean
}) {
  const [loading, setLoading] = useState<boolean>(false)

  const { data: walletClient } = useWalletClient()
  const { switchChainAsync } = useSwitchChain()

  function getIconUrl(token: dc.TokenData) {
    return `${ICONS_BASE_URL}${token.meta.symbol}.png`
  }

  async function isIconAvailable(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: 'HEAD' })
      return response.ok
    } catch {
      return false
    }
  }

  async function addToken() {
    setLoading(true)
    const destToken = createTokenData(
      props.token.keyname,
      props.destChainName,
      props.token.type,
      props.mpc.config
    )
    const iconUrl = getIconUrl(props.token)
    const { chainId } = await props.provider.getNetwork()
    try {
      await enforceNetwork(
        chainId,
        walletClient,
        switchChainAsync,
        props.mpc.config.skaleNetwork,
        props.destChainName
      )
      const wasAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: destToken.address,
            symbol: destToken.meta.symbol.toUpperCase(),
            decimals: destToken.meta.decimals,
            image: (await isIconAvailable(iconUrl)) ? iconUrl : undefined
          }
        }
      })
      if (wasAdded) {
        notify.temporarySuccess('Token added to wallet')
      } else {
        notify.permanentError('Token was not added')
      }
    } catch (error) {
      notify.permanentError('Failed to add token')
    } finally {
      setLoading(false)
    }
  }

  if (props.destChainName === constants.MAINNET_CHAIN_NAME && props.token.type === dc.TokenType.eth)
    return

  if (props.iconOnly) {
    return (
      <span>
        <IconButton
          onClick={addToken}
          disabled={loading}
          className="md:hidden! text-accent! bg-accent-foreground! disabled:text-foreground/70! disabled:bg-accent-foreground/15! p-2!"
        >
          <BadgePlus size={20} />
        </IconButton>
        <Button
          onClick={addToken}
          disabled={loading}
          size="small"
          startIcon={<BadgePlus size={15} />}
          className="hidden! md:inline-flex! capitalize! text-accent! bg-accent-foreground! disabled:text-foreground/70! disabled:bg-accent-foreground/15! text-xs! px-3.5! py-2.5!"
        >
          {loading ? 'Check wallet' : 'Add token'}
        </Button>
      </span>
    )
  }

  return (
    <Button
      onClick={addToken}
      disabled={loading}
      color="primary"
      size="medium"
      className="grow mb-2! md:mb-0! w-full! md:w-fit! md:mr-3! capitalize! text-accent! bg-accent-foreground! disabled:text-foreground/70! disabled:bg-accent-foreground/15! text-xs! px-6! py-4! ease-in-out transition-transform duration-150 active:scale-[0.97]"
      startIcon={<Coins size={17} />}
    >
      {loading ? 'Check wallet' : 'Add token'}
    </Button>
  )
}
