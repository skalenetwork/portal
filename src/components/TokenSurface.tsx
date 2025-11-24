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
 * @file TokenSurface.tsx
 * @copyright SKALE Labs 2021-Present
 */

import { useState, useEffect } from 'react'
import { TokenIcon, ChainIcon } from '@skalenetwork/metaport'
import { type types, constants } from '@/core'

import { CopyToClipboard } from 'react-copy-to-clipboard'
import Tooltip from '@mui/material/Tooltip'
import ButtonBase from '@mui/material/ButtonBase'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import UnfoldMoreRoundedIcon from '@mui/icons-material/UnfoldMoreRounded'

export default function TokenSurface(props: {
  title: string
  value: string | undefined
  className?: string
  tokenMetadata?: types.mp.TokenMetadata
  chainName?: string
  skaleNetwork?: types.SkaleNetwork
}) {
  const [copied, setCopied] = useState(false)

  const handleClick = () => {
    setCopied(true)
  }

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false)
      }, 1000)
      return () => {
        clearTimeout(timer)
      }
    }
  }, [copied])

  if (!props.value) return
  return (
    <div className={props.className}>
      <CopyToClipboard text={props.value} onCopy={handleClick}>
        <Tooltip title={copied ? 'Copied!' : 'Click to copy to clipboard'}>
          <ButtonBase className="titleSection" style={{ width: '100%' }}>
            <div style={{ textAlign: 'left', overflow: 'auto' }} className="flex-grow">
              <div className="flex">
                {props.tokenMetadata ? (
                  <div className="mr-1.5">
                    <TokenIcon
                      size="xs"
                      tokenSymbol={props.tokenMetadata.symbol}
                      iconUrl={props.tokenMetadata.iconUrl}
                    />
                  </div>
                ) : null}

                {props.chainName && props.skaleNetwork ? (
                  <div className="mr-1.5">
                    <ChainIcon
                      size="xs"
                      skaleNetwork={props.skaleNetwork}
                      chainName={props.chainName}
                    />
                  </div>
                ) : null}
                <p className="text-xs text-secondary-foreground mb-1.5 shortP">
                  {props.title}
                  {props.tokenMetadata
                    ? ` (${props.tokenMetadata.decimals ?? constants.DEFAULT_ERC20_DECIMALS})`
                    : null}
                </p>
              </div>
              <p className="text-base font-semibold shortP">{props.value}</p>
            </div>
            {copied ? (
              <CheckCircleRoundedIcon color="success" className="ml-5 styles.chainIconxs" />
            ) : (
              <UnfoldMoreRoundedIcon className="text-secondary-foreground ml-5 styles.chainIconxs" />
            )}
          </ButtonBase>
        </Tooltip>
      </CopyToClipboard>
    </div>
  )
}
