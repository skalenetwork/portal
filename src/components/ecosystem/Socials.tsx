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

const BRANDS: Record<string, [string, string]> = {
  x: [
    'X (Twitter)',
    'm16 17.537h10.125l6.992 9.242 8.084-9.242h4.908L35.39 29.79 48 46.463h-9.875l-7.734-10.111-8.85 10.11h-4.908l11.465-13.105zm5.73 2.783 17.75 23.205h2.72L24.647 20.32z'
  ],
  telegram: [
    'Telegram',
    'm11.887 33.477c3.73-2.055 7.894-3.77 11.785-5.497 6.695-2.824 13.414-5.597 20.203-8.18 1.324-.44 3.695-.87 3.93 1.087-.13 2.773-.653 5.527-1.012 8.281-.914 6.055-1.969 12.094-2.996 18.133-.356 2.008-2.875 3.05-4.488 1.761-3.871-2.613-7.778-5.207-11.598-7.882-1.254-1.274-.094-3.102 1.027-4.012 3.188-3.145 6.575-5.816 9.598-9.121.816-1.973-1.594-.313-2.39.2-4.368 3.007-8.63 6.202-13.235 8.847-2.352 1.297-5.094.187-7.445-.535-2.11-.871-5.2-1.75-3.38-3.082m0 0'
  ],
  discord: [
    'Discord',
    'm36.903 18.5a29.6 29.6 0 0 1 7.374 2.269c4.045 5.914 6.055 12.585 5.313 20.283a29.6 29.6 0 0 1-9.05 4.537 21.7 21.7 0 0 1-1.936-3.12 19.3 19.3 0 0 0 3.055-1.46 11 11 0 0 1-.747-.562 21.25 21.25 0 0 1-18.082 0c-.242.186-.492.377-.748.562a19 19 0 0 0 3.05 1.457 22 22 0 0 1-1.937 3.123 29.7 29.7 0 0 1-9.043-4.54c-.633-6.638.632-13.37 5.299-20.275a29.8 29.8 0 0 1 7.38-2.274q.522.935.944 1.92a27.5 27.5 0 0 1 8.183 0q.422-.985.945-1.92m-10.97 18.467c-1.762 0-3.218-1.6-3.218-3.568s1.405-3.581 3.213-3.581c1.807 0 3.252 1.614 3.222 3.581-.031 1.968-1.42 3.568-3.216 3.568m11.875 0c-1.765 0-3.216-1.6-3.216-3.568s1.406-3.581 3.216-3.581 3.244 1.614 3.213 3.581c-.03 1.968-1.417 3.568-3.213 3.568'
  ],
  github: [
    'GitHub',
    'm37.1 47.2c-.8.2-1.1-.3-1.1-.8V42c0-1.5-.5-2.5-1.1-3 3.6-.4 7.3-1.7 7.3-7.9 0-1.7-.6-3.2-1.6-4.3.2-.4.7-2-.2-4.2 0 0-1.3-.4-4.4 1.6-1.3-.4-2.6-.5-4-.5s-2.7.2-4 .5c-3.1-2.1-4.4-1.6-4.4-1.6-.9 2.2-.3 3.8-.2 4.2-1 1.1-1.6 2.5-1.6 4.3 0 6.1 3.7 7.5 7.3 7.9-.5.4-.9 1.1-1 2.1-.9.4-3.2 1.1-4.7-1.3 0 0-.8-1.5-2.5-1.6 0 0-1.6 0-.1 1 0 0 1 .5 1.8 2.3 0 0 .9 3.1 5.4 2.1v2.7c0 .4-.3.9-1.1.8-6.3-2-10.9-8-10.9-15.1 0-8.8 7.2-16 16-16s16 7.2 16 16c0 7.1-4.6 13.1-10.9 15.2'
  ]
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
    ...Object.entries(BRANDS).map(([key, [title, path]]) => ({
      key,
      title,
      icon: (
        <svg
          viewBox="0 0 64 64"
          width={isMd ? 24 : 17}
          height={isMd ? 24 : 17}
          fill="currentColor"
          fillRule="evenodd"
          className={isMd ? 'text-foreground' : 'text-muted-foreground'}
        >
          <path d={path} />
        </svg>
      )
    })),
    {
      key: 'dune',
      icon: (
        <img
          src={DuneLogo}
          className={`customSocialIcon ${isMd ? 'text-foreground' : 'opacity-60'}`}
          alt="dune-logo"
          style={{ width: isMd ? 24 : 17, height: isMd ? 24 : 17 }}
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
          {visibleLinks.map(({ key, icon, title }) => {
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
                    className={`flex items-center justify-center ${isMd ? 'min-w-7 min-h-7' : 'min-w-[30px] min-h-[30px]'} ${isMd ? 'bg-muted!' : ''}`}
                  >
                    {icon}
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
