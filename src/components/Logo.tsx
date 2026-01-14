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
 * @file Logo.tsx
 * @copyright SKALE Labs 2025-Present
 */

import { type types, metadata } from '@/core'
import { cls, useThemeMode } from '@skalenetwork/metaport'
import { MAINNET_CHAIN_LOGOS } from '../core/constants'
import ChainLogo from '../components/ChainLogo'

interface LogoProps {
  chainsMeta: types.ChainsMetadataMap
  skaleNetwork: types.SkaleNetwork
  chainName: string
  appName?: string
  size?: 'xs' | 'sm' | 'md'
}

const Logo: React.FC<LogoProps> = ({ chainsMeta, skaleNetwork, chainName, appName, size }) => {
  size = size || 'xs'
  const { mode } = useThemeMode()
  return (
    <div className={cls('sk-app-logo', `sk-logo-${size}`, 'br__tile')}>
      <div
        className="logo-wrapper borderLight"
        style={{
          background: metadata.chainBg(skaleNetwork, chainsMeta, chainName, appName, mode)
        }}
      >
        <ChainLogo
          className="responsive-logo"
          network={skaleNetwork}
          chainName={chainName}
          app={appName}
          logos={MAINNET_CHAIN_LOGOS}
        />
      </div>
      <div className="flex grow"></div>
    </div>
  )
}

export default Logo
