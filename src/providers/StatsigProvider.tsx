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
 * @file StatsigProvider.tsx
 * @copyright SKALE Labs 2025-Present
 */

import React from 'react'
import { StatsigProvider } from '@statsig/react-bindings'

interface StatsigWrapperProps {
  children: React.ReactNode
  userId?: string
}

export default function StatsigWrapper({ children, userId }: StatsigWrapperProps) {
  const statsigOptions = {
    environment: { 
      tier: process.env.NODE_ENV === 'production' ? 'production' : 'development' 
    },
    initTimeoutMs: 3000,
    disableAutoLogging: false
  }

  return (
    <StatsigProvider
      sdkKey={import.meta.env.VITE_STATSIG_CLIENT_KEY!}
      user={{ 
        userID: userId || 'anonymous',
        custom: {
          pageType: 'home'
        }
      }}
      options={statsigOptions}
    >
      {children}
    </StatsigProvider>
  )
}
