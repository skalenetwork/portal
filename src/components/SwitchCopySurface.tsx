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
 * @copyright SKALE Labs 2023-Present
 */

import { useState, useEffect } from 'react'
import { types } from '@/core'

import { CopyToClipboard } from 'react-copy-to-clipboard'
import Tooltip from '@mui/material/Tooltip'
import ButtonBase from '@mui/material/ButtonBase'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'

import { styled } from '@mui/material/styles'
import Switch from '@mui/material/Switch'

export default function CopySurface(props: {
  title: string
  value: string | undefined
  className?: string
  tokenMetadata?: types.mp.TokenMetadata
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

  const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 28,
    height: 16,
    padding: 0,
    display: 'flex',
    '&:active': {
      '& .MuiSwitch-thumb': {
        width: 15
      },
      '& .MuiSwitch-switchBase.Mui-checked': {
        transform: 'translateX(9px)'
      }
    },
    '& .MuiSwitch-switchBase': {
      padding: 2,
      '&.Mui-checked': {
        transform: 'translateX(12px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          opacity: 1,
          backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466'
        }
      }
    },
    '& .MuiSwitch-thumb': {
      boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
      width: 12,
      height: 12,
      borderRadius: 6,
      transition: theme.transitions.create(['width'], {
        duration: 200
      })
    },
    '& .MuiSwitch-track': {
      borderRadius: 16 / 2,
      opacity: 1,
      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,.30)' : 'rgba(0,0,0,.25)',
      boxSizing: 'border-box'
    }
  }))

  if (!props.value) return
  return (
    <div className={`${props.className} titleSection`}>
      <div className="flex items-center mb-1.5">
        <p className="text-xs text-secondary-foreground/60 flex-grow">{props.title}</p>
        <p className="text-xs text-secondary-foreground/60 mr-1.5">Decimal / Hex</p>
        <AntSwitch inputProps={{ 'aria-label': 'ant design' }} />
      </div>
      <CopyToClipboard text={props.value} onCopy={handleClick}>
        <Tooltip title={copied ? 'Copied!' : 'Click to copy to clipboard'}>
          <ButtonBase style={{ width: '100%' }}>
            <div style={{ textAlign: 'left', overflow: 'auto' }} className="flex-grow">
              <p className="text-base font-semibold shortP">{props.value}</p>
            </div>
            {copied ? (
              <CheckCircleRoundedIcon
                color="success"
                className="ml-5 styles.chainIconxs"
              />
            ) : (
              <ContentCopyIcon className="text-secondary-foreground/60 ml-5 styles.chainIconxs" />
            )}
          </ButtonBase>
        </Tooltip>
      </CopyToClipboard>
    </div >
  )
}
