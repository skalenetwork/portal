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
 * @file CopySurface.tsx
 * @copyright SKALE Labs 2021-Present
 */

import { useState, useEffect } from 'react'
import { type types, constants } from '@/core'
import { TokenIcon } from '@skalenetwork/metaport'

import { CopyToClipboard } from 'react-copy-to-clipboard'
import Tooltip from '@mui/material/Tooltip'
import ButtonBase from '@mui/material/ButtonBase'
import { CircleCheck, Copy } from 'lucide-react'

export default function CopySurface(props: {
  title: string
  value: string | undefined
  className?: string
  tokenMetadata?: types.mp.TokenMetadata
  icon?: React.ReactNode
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
          <ButtonBase
            className="bg-background! p-5! rounded-3xl! ease-in-out transition-transform duration-150 active:scale-[0.99]"
            style={{ width: '100%', height: '100%' }}
          >
            <div style={{ textAlign: 'left', overflow: 'auto' }} className="grow">
              <div className="flex items-center mb-1.5">
                {props.tokenMetadata ? (
                  <div className="mr-1.5">
                    <TokenIcon
                      size="xs"
                      tokenSymbol={props.tokenMetadata.symbol}
                      iconUrl={props.tokenMetadata.iconUrl}
                    />
                  </div>
                ) : null}
                {props.icon && <div className="mr-1.5 text-secondary-foreground">{props.icon}</div>}
                <p className="text-xs text-secondary-foreground truncate">
                  {props.title}
                  {props.tokenMetadata
                    ? ` (${props.tokenMetadata.decimals ?? constants.DEFAULT_ERC20_DECIMALS})`
                    : null}
                </p>
              </div>
              <p className="text-base font-semibold shortP text-foreground">{props.value}</p>
            </div>
            {copied ? (
              <div className="ml-5 shrink-0 p-2 bg-green-600 dark:bg-green-400 rounded-full">
                <CircleCheck className="text-accent/90" size={17} />
              </div>
            ) : (
              <div className="ml-5 shrink-0 p-2 bg-muted-foreground/10 rounded-full">
                <Copy className="text-accent-foreground/90 shrink-0" size={17} />
              </div>
            )}
          </ButtonBase>
        </Tooltip>
      </CopyToClipboard>
    </div>
  )
}
