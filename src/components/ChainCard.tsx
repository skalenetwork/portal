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
import { cmn, cls } from '@skalenetwork/metaport'
import { type types, metadata } from '@/core'

import Button from '@mui/material/Button'

import Logo from './Logo'

export default function ChainCard(props: {
  skaleNetwork: types.SkaleNetwork
  schain: types.ISChain
  chainsMeta: types.ChainsMetadataMap
  transactions?: number
}) {
  const shortAlias = metadata.getChainShortAlias(props.chainsMeta, props.schain.name)
  return (
    <div>
      <div className="fl-centered">
        <div
          className={cls('br__tile')}
          style={{ background: metadata.chainBg(props.chainsMeta, props.schain.name) }}
        >
          <Link
            to={'/chains/' + shortAlias}
            className={cls('br__tileLogo', 'br__tileIns', cmn.flex)}
          >
            <div className={cls(cmn.flex, cmn.flexg)}></div>
            <div className={cls(cmn.flex, cmn.flexcv, 'inheritSize')}>
            <Logo chainsMeta={props.chainsMeta} skaleNetwork= {props.skaleNetwork} chainName={props.schain.name}/>
            </div>
          </Link>
          <div className={cls(cmn.flex, cmn.flexcv, cmn.mbott10, 'br__tileBott', 'fullW')}></div>
        </div>
        <Link to={'/chains/' + shortAlias}>
          <Button size="small" className={'cardBtn'}>
            <span
              style={{
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                display: 'block',
                textOverflow: 'ellipsis'
              }}
            >
              {metadata.getAlias(props.chainsMeta, props.schain.name, undefined, true)}
            </span>
          </Button>
        </Link>
      </div>
    </div>
  )
}
