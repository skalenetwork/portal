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
 * @file ChainCard.tsx
 * @copyright SKALE Labs 2022-Present
 */

import { Link } from 'react-router-dom'
import { type types, metadata } from '@/core'

import Button from '@mui/material/Button'

import Logo from './Logo'
import { useThemeMode } from '@skalenetwork/metaport'

export default function ChainCard(props: {
  skaleNetwork: types.SkaleNetwork
  schain: types.ISChain
  chainsMeta: types.ChainsMetadataMap
  transactions?: number
}) {
  const { mode } = useThemeMode()
  const shortAlias = metadata.getChainShortAlias(props.chainsMeta, props.schain.name)
  return (
    <div>
      <div className="flex justify-center items-center">
        <div
          className="br__tile"
          style={{
            background: metadata.chainBg(props.skaleNetwork, props.chainsMeta, props.schain.name, mode)
          }}
        >
          <Link to={'/chains/' + shortAlias} className="br__tileLogo br__tileIns flex">
            <div className="flex grow"></div>
            <div className="flex items-center inheritSize">
              <Logo
                chainsMeta={props.chainsMeta}
                skaleNetwork={props.skaleNetwork}
                chainName={props.schain.name}
              />
            </div>
          </Link>
          <div className="flex items-center mb-2.5 br__tileBott w-full"></div>
        </div>
        <Link to={'/chains/' + shortAlias}>
          <Button size="small" className="cardBtn">
            <span
              style={{
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                display: 'block',
                textOverflow: 'ellipsis'
              }}
            >
              {metadata.getAlias(
                props.skaleNetwork,
                props.chainsMeta,
                props.schain.name,
                undefined,
                true
              )}
            </span>
          </Button>
        </Link>
      </div>
    </div>
  )
}
