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
 * @file Message.tsx
 * @copyright SKALE Labs 2023-Present
 */

import { type ReactElement, useState } from 'react'
import IconButton from '@mui/material/IconButton'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import Collapse from '@mui/material/Collapse'
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded'
import { SkPaper, cls, cmn, useWagmiAccount } from '@skalenetwork/metaport'
import { Link } from 'react-router-dom'
import { Button } from '@mui/material'

import { useAuth } from '../AuthContext'
import SwellIcon from './ecosystem/SwellIcon'

export default function Message(props: {
  text: string | null
  linkText?: string
  link?: string
  icon: ReactElement
  className?: string | undefined
  showOnLoad?: boolean | undefined
  type?: 'warning' | 'info' | 'error'
  closable?: boolean
  button?: ReactElement | null
  gray?: boolean
}) {
  const type = props.type ?? 'info'
  const [show, setShow] = useState<boolean>(true)
  const closable = props.closable ?? true
  const gray = props.gray ?? true
  return (
    <Collapse in={show}>
      <SkPaper
        gray={gray}
        className={cls(
          props.className,
          'skMessage',
          cmn.flexcv,
          cmn.flex,
          ['warningMsg', type === 'warning'],
          ['errorMsg', type === 'error']
        )}
      >
        <div
          className={cls(
            cmn.flex,
            cmn.fullWidth,
            cmn.flexcv,
            cmn.mtop5,
            cmn.mbott5,
            cmn.mleft10,
            cmn.mri10
          )}
        >
          <div className={cls(cmn.flex, cmn.flexc, cmn.mri15)}>{props.icon}</div>
          {props.text ? (
            <p className={cls(cmn.p, cmn.p3, cmn.p600, [cmn.pPrim, type !== 'warning'], cmn.mri5)}>
              {props.text}
            </p>
          ) : null}
          {props.link ? (
            <div className={cls(cmn.flex, cmn.flexcv, cmn.flexg)}>
              <Link to={props.link}>
                <p className={cls(cmn.p, cmn.p3, cmn.p600, cmn.mri5)}>{props.linkText}</p>
              </Link>
              <ArrowOutwardRoundedIcon
                className={cls(cmn.flex, cmn.flexcv, 'a')}
                style={{ height: '14px', width: '14px' }}
              />
            </div>
          ) : null}

          <div className={cmn.flexg}></div>
          {props.button}
          {closable ? (
            <IconButton
              onClick={() => {
                setShow(false)
              }}
              className={cls(cmn.paperGrey, cmn.mleft10)}
            >
              <CloseRoundedIcon
                className={cls([cmn.pSec, type !== 'warning'])}
                style={{ height: '16px', width: '16px' }}
              />
            </IconButton>
          ) : null}
        </div>
      </SkPaper>
    </Collapse>
  )
}

export function SwellMessage(props: { className?: string }) {
  const { openProfileModal, isEmailLoading, email } = useAuth()
  const { address } = useWagmiAccount()

  if ((!isEmailLoading && email) || !address) return
  return (
    <Message
      className={props.className}
      icon={<SwellIcon color="primary" />}
      text="Complete your profile to receive quest rewards on SKALE Swell"
      closable={false}
      button={
        <Button className={cls('btn btnSm')} variant="contained" onClick={openProfileModal}>
          Go to profile
        </Button>
      }
    />
  )
}
