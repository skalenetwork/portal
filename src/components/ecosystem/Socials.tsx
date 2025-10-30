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
 * @file Socials.tsx
 * @copyright SKALE Labs 2024-Present
 */

import React from 'react'
import { IconButton, Tooltip } from '@mui/material'
import { LanguageRounded, TrackChangesRounded, JoinLeftRounded } from '@mui/icons-material'
import { SocialIcon } from 'react-social-icons/component'
import 'react-social-icons/discord'
import 'react-social-icons/github'
import 'react-social-icons/telegram'
import 'react-social-icons/x'
import { cmn, cls } from '@skalenetwork/metaport'
import { type types } from '@/core'
import FavoriteIconButton from './FavoriteIconButton'
import SwellIcon from './SwellIcon'
import EpicGamesStoreLogo from '../../assets/egs.svg'
import ForumIcon from '@mui/icons-material/Forum'

interface SocialButtonsProps {
  social?: types.AppSocials
  chainName?: string
  appName?: string
  className?: string
  size?: 'sm' | 'md'
  all?: boolean
}

const MAX_SOCIALS_SM = 6

const SocialButtons: React.FC<SocialButtonsProps> = ({
  social,
  chainName,
  appName,
  className,
  all = false,
  size = 'sm'
}) => {
  const isMd = size === 'md'

  const socialLinks = [
    {
      key: 'website',
      icon: (
        <LanguageRounded
          className="[cmn.pPrim, isMd], [cmn.pSec, !isMd]"
          fontSize={isMd ? 'medium' : 'small'}
        />
      ),
      title: 'Website'
    },
    {
      key: 'epic-games-store',
      icon: (
        <img
          src={EpicGamesStoreLogo}
          className="'customSocialIcon', isMd && 'customSocialIconMd'"
          alt="egs-logo"
        />
      ),
      title: 'Epic Games Store'
    },
    {
      key: 'swell',
      icon: (
        <SwellIcon
          size={isMd ? 'medium' : 'small'}
          style={{ padding: '2px' }}
          className="[cmn.pSec, !isMd], [cmn.pPrim, isMd]"
        />
      ),
      title: 'Swell'
    },
    {
      key: 'dappradar',
      icon: (
        <TrackChangesRounded
          className="[cmn.pPrim, isMd], [cmn.pSec, !isMd]"
          fontSize={isMd ? 'medium' : 'small'}
        />
      ),
      title: 'dAppRadar'
    },
    { key: 'x', network: 'x', title: 'X (Twitter)' },
    { key: 'telegram', network: 'telegram', title: 'Telegram' },
    { key: 'discord', network: 'discord', title: 'Discord' },
    { key: 'github', network: 'github', title: 'GitHub' },
    {
      key: 'dune',
      icon: (
        <JoinLeftRounded
          className="[cmn.pPrim, isMd], [cmn.pSec, !isMd]"
          fontSize={isMd ? 'medium' : 'small'}
        />
      ),
      title: 'Dune Analytics'
    },
    {
      key: 'forum',
      icon: (
        <ForumIcon
          className="[cmn.pPrim, isMd], [cmn.pSec, !isMd]"
          fontSize={isMd ? 'medium' : 'small'}
        />
      ),
      title: 'SKALE Forum'
    }
  ]

  const visibleLinks = isMd || all ? socialLinks : socialLinks.slice(0, MAX_SOCIALS_SM)

  return (
    <div className="cmn.flex, cmn.flexcv, className">
      {social && (
        <div className="cmn.flex, cmn.flexg">
          {visibleLinks.map(({ key, icon, network, title }) => {
            const link = social[key as keyof types.AppSocials]
            if (!link) return null

            return (
              <div className="[mr-2.5, isMd]" key={key}>
                <Tooltip key={key} title={title}>
                  <IconButton
                    size={isMd ? 'medium' : 'small'}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cls(
                      network ? cmn.nop : undefined,
                      [cmn.pPrim, isMd],
                      ['bgBlack', isMd]
                    )}
                  >
                    {icon || (
                      <SocialIcon
                        network={network}
                        bgColor={isMd ? 'black' : 'transparent'}
                        className="'socialIcon', isMd && 'socialIconMd'"
                        fgColor={isMd ? '' : 'rgb(255 255 255 / 65%)'}
                      />
                    )}
                  </IconButton>
                </Tooltip>
              </div>
            )
          })}
        </div>
      )}
      {!social && <div className={cmn.flexg}></div>}
      {!isMd && chainName && appName ? (
        <FavoriteIconButton chainName={chainName} appName={appName} />
      ) : null}
    </div>
  )
}

export default SocialButtons
