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
import { SocialIcon } from 'react-social-icons/component'
import 'react-social-icons/discord'
import 'react-social-icons/github'
import 'react-social-icons/telegram'
import 'react-social-icons/x'
import { type types } from '@/core'
import SwellIcon from './SwellIcon'
import EpicGamesStoreLogo from '../../assets/egs.svg'
import DuneLogo from '../../assets/dune.svg'
import { Globe, MessagesSquare, Target } from 'lucide-react'

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
  all = false,
  size = 'sm',
  className
}) => {
  const isMd = size === 'md'

  const socialLinks = [
    {
      key: 'website',
      icon: (
        <Globe
          className={`${isMd ? 'text-foreground' : 'text-muted-foreground'}`}
          size={isMd ? 24 : 17}
        />
      ),
      title: 'Website'
    },
    {
      key: 'epic-games-store',
      icon: (
        <img
          src={EpicGamesStoreLogo}
          className={`customSocialIcon ${isMd ? 'customSocialIconMd' : ''}`}
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
          className={`${isMd ? 'text-foreground' : 'text-muted-foreground'}`}
        />
      ),
      title: 'Swell'
    },
    {
      key: 'dappradar',
      icon: (
        <Target
          className={`${isMd ? 'text-foreground' : 'text-muted-foreground'}`}
          size={isMd ? 24 : 17}
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
        <img
          src={DuneLogo}
          className={`customSocialIcon ${isMd ? 'text-foreground' : 'opacity-60'}`}
          alt="dune-logo"
        />
      ),
      title: 'Dune Analytics'
    },
    {
      key: 'forum',
      icon: (
        <MessagesSquare
          className={`${isMd ? 'text-foreground' : 'text-muted-foreground'}`}
          size={isMd ? 24 : 17}
        />
      ),
      title: 'SKALE Forum'
    }
  ]

  const visibleLinks = isMd || all ? socialLinks : socialLinks.slice(0, MAX_SOCIALS_SM)

  return (
    <div className={`flex items-center ${className || ''}`}>
      {social && (
        <div className="flex items-center grow">
          {visibleLinks.map(({ key, icon, network, title }) => {
            const link = social[key as keyof types.AppSocials]
            if (!link) return null

            return (
              <div className={isMd ? 'mr-2.5' : 'mr-1.5'} key={key}>
                <Tooltip key={key} title={title}>
                  <IconButton
                    size={isMd ? 'medium' : 'small'}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center ${isMd ? 'min-w-7 min-h-7' : 'min-w-[30px] min-h-[30px]'} ${network ? 'p-0!' : ''} ${isMd ? 'bg-muted!' : ''}`}
                  >
                    {icon || (
                      <SocialIcon
                        network={network}
                        bgColor="transparent"
                        className={`socialIcon ${isMd ? 'socialIconMd' : ''}`}
                        fgColor={isMd ? 'var(--foreground)' : 'var(--muted-foreground)'}
                      />
                    )}
                  </IconButton>
                </Tooltip>
              </div>
            )
          })}
        </div>
      )}
      {!social && <div className="grow"></div>}
    </div>
  )
}

export default SocialButtons
