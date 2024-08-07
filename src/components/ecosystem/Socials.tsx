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
import { type types } from '@/core'

import { IconButton, Tooltip } from '@mui/material'
import { LanguageRounded, FavoriteBorderOutlined, WavesRounded } from '@mui/icons-material'
import { cmn, cls } from '@skalenetwork/metaport'

import { SocialIcon } from 'react-social-icons/component'
import 'react-social-icons/discord'
import 'react-social-icons/github'
import 'react-social-icons/telegram'
import 'react-social-icons/x'

interface SocialButtonsProps {
  social?: types.AppSocials
  onAddToFavorites?: () => void
  isFavorite?: boolean
  className?: string
}

const SocialButtons: React.FC<SocialButtonsProps> = ({
  social,
  onAddToFavorites,
  isFavorite = false,
  className
}) => {
  if (!social) return undefined
  return (
    <div className={cls(cmn.flex, cmn.flexcv, className)}>
      <div className={cls(cmn.flex, cmn.flexg)}>
        {social.website && (
          <Tooltip title="Website">
            <IconButton
              size="small"
              href={social.website}
              target="_blank"
              rel="noopener noreferrer"
            >
              <LanguageRounded className={cls(cmn.pSec)} fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        {social.x && (
          <Tooltip title="X (Twitter)">
            <IconButton
              size="small"
              href={social.x}
              target="_blank"
              rel="noopener noreferrer"
              className={cls(cmn.nop)}
            >
              <SocialIcon
                network="x"
                bgColor="transparent"
                className={cls('socialIcon')}
                fgColor="rgb(255 255 255 / 65%)"
              />
            </IconButton>
          </Tooltip>
        )}
        {social.telegram && (
          <Tooltip title="Telegram">
            <IconButton
              size="small"
              href={social.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className={cls(cmn.nop)}
            >
              <SocialIcon
                network="telegram"
                bgColor="transparent"
                className={cls('socialIcon')}
                fgColor="rgb(255 255 255 / 65%)"
              />
            </IconButton>
          </Tooltip>
        )}
        {social.discord && (
          <Tooltip title="Discord">
            <IconButton
              size="small"
              href={social.discord}
              target="_blank"
              rel="noopener noreferrer"
              className={cls(cmn.nop)}
            >
              <SocialIcon
                network="discord"
                bgColor="transparent"
                className={cls('socialIcon')}
                fgColor="rgb(255 255 255 / 65%)"
              />
            </IconButton>
          </Tooltip>
        )}
        {social.github && (
          <Tooltip title="GitHub">
            <IconButton
              size="small"
              href={social.github}
              target="_blank"
              rel="noopener noreferrer"
              className={cls(cmn.nop)}
            >
              <SocialIcon
                network="github"
                bgColor="transparent"
                className={cls('socialIcon')}
                fgColor="rgb(255 255 255 / 65%)"
              />
            </IconButton>
          </Tooltip>
        )}
        {social.swell && (
          <Tooltip title="Swell">
            <IconButton size="small" href={social.swell} target="_blank" rel="noopener noreferrer">
              <WavesRounded className={cls(cmn.pSec)} fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </div>
      <div>
        <Tooltip title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
          <IconButton size="small" onClick={onAddToFavorites} className={cls('bgPrim')}>
            <FavoriteBorderOutlined
              className={cls(cmn.pSec)}
              fontSize="small"
              color={isFavorite ? 'secondary' : 'action'}
            />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  )
}

export default SocialButtons
