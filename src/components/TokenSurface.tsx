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
import { cmn, cls, styles, TokenIcon, ChainIcon, type interfaces } from '@skalenetwork/metaport'
import { type types } from '@/core'

import { CopyToClipboard } from 'react-copy-to-clipboard'
import Tooltip from '@mui/material/Tooltip'
import ButtonBase from '@mui/material/ButtonBase'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import UnfoldMoreRoundedIcon from '@mui/icons-material/UnfoldMoreRounded'

import { DEFAULT_ERC20_DECIMALS } from '../core/constants'

export default function TokenSurface(props: {
  title: string
  value: string | null | undefined
  className?: string
  tokenMetadata?: interfaces.TokenMetadata
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
            <div style={{ textAlign: 'left', overflow: 'auto' }} className={cmn.flexg}>
              <div className={cls(cmn.flex)}>
                {props.tokenMetadata ? (
                  <div className={cls(cmn.mri5)}>
                    <TokenIcon
                      size="xs"
                      tokenSymbol={props.tokenMetadata.symbol}
                      iconUrl={props.tokenMetadata.iconUrl}
                    />
                  </div>
                ) : null}

                {props.chainName && props.skaleNetwork ? (
                  <div className={cls(cmn.mri5)}>
                    <ChainIcon
                      size="xs"
                      skaleNetwork={props.skaleNetwork}
                      chainName={props.chainName}
                    />
                  </div>
                ) : null}
                <p className={cls(cmn.p, cmn.p4, cmn.pSec, cmn.mbott5, 'shortP')}>
                  {props.title}
                  {props.tokenMetadata
                    ? ` (${props.tokenMetadata.decimals ?? DEFAULT_ERC20_DECIMALS})`
                    : null}
                </p>
              </div>
              <p className={cls(cmn.p, cmn.p2, cmn.p600, 'shortP')}>{props.value}</p>
            </div>
            {copied ? (
              <CheckCircleRoundedIcon
                color="success"
                className={cls(cmn.mleft20, styles.chainIconxs)}
              />
            ) : (
              <UnfoldMoreRoundedIcon className={cls(cmn.pSec, cmn.mleft20, styles.chainIconxs)} />
            )}
          </ButtonBase>
        </Tooltip>
      </CopyToClipboard>
    </div>
  )
}
