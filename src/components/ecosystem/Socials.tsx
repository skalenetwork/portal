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
import {
  LanguageRounded,
  FavoriteBorderOutlined,
  WavesRounded,
  TrackChangesRounded
} from '@mui/icons-material'
import { SocialIcon } from 'react-social-icons/component'
import 'react-social-icons/discord'
import 'react-social-icons/github'
import 'react-social-icons/telegram'
import 'react-social-icons/x'
import { cmn, cls } from '@skalenetwork/metaport'
import { type types } from '@/core'

interface SocialButtonsProps {
  social?: types.AppSocials
  onAddToFavorites?: () => void
  isFavorite?: boolean
  className?: string
  size?: 'sm' | 'md'
}

const SocialButtons: React.FC<SocialButtonsProps> = ({
  social,
  onAddToFavorites,
  isFavorite = false,
  className,
  size = 'sm'
}) => {
  const isMd = size === 'md'

  const socialLinks = [
    {
      key: 'website',
      icon: (
        <LanguageRounded
          className={cls([cmn.pPrim, isMd], [cmn.pSec, !isMd])}
          fontSize={isMd ? 'medium' : 'small'}
        />
      ),
      title: 'Website'
    },
    {
      key: 'dappradar',
      icon: (
        <TrackChangesRounded
          className={cls([cmn.pPrim, isMd], [cmn.pSec, !isMd])}
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
      key: 'swell',
      icon: (
        <WavesRounded
          className={cls([cmn.pPrim, isMd], [cmn.pSec, !isMd])}
          fontSize={isMd ? 'medium' : 'small'}
        />
      ),
      title: 'Swell'
    }
  ]

  return (
    <div className={cls(cmn.flex, cmn.flexcv, className)}>
      {social && (
        <div className={cls(cmn.flex, cmn.flexg)}>
          {socialLinks.map(({ key, icon, network, title }) => {
            const link = social[key as keyof types.AppSocials]
            if (!link) return null

            return (
              <div className={cls([cmn.mri10, isMd])}>
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
                        className={cls('socialIcon', isMd && 'socialIconMd')}
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
      {!isMd && (
        <Tooltip title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
          <IconButton size="small" onClick={onAddToFavorites} className={cls('bgPrim')}>
            <FavoriteBorderOutlined
              className={cls(cmn.pSec)}
              fontSize="small"
              color={isFavorite ? 'secondary' : 'action'}
            />
          </IconButton>
        </Tooltip>
      )}
    </div>
  )
}

export default SocialButtons
