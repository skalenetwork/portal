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
import { cmn, cls, chainBg, getChainAlias, type interfaces } from '@skalenetwork/metaport'

import Button from '@mui/material/Button'

import ChainLogo from './ChainLogo'

import { MAINNET_CHAIN_LOGOS } from '../core/constants'
import { ISChain } from '../core/types'
import { getChainShortAlias } from '../core/chain'

export default function ChainCard(props: {
  skaleNetwork: interfaces.SkaleNetwork
  schain: ISChain
  chainsMeta: interfaces.ChainsMetadataMap
  transactions?: number
}) {
  const shortAlias = getChainShortAlias(props.chainsMeta, props.schain.name)
  return (
    <div>
      <div className="fl-centered">
        <div
          className={cls('br__tile')}
          style={{ background: chainBg(props.skaleNetwork, props.schain.name) }}
        >
          <Link
            to={'/ecosystem/' + shortAlias}
            className={cls('br__tileLogo', 'br__tileIns', cmn.flex)}
          >
            <div className={cls(cmn.flex, cmn.flexg)}></div>
            <div className={cls(cmn.flex, cmn.flexcv, 'inheritSize')}>
              <ChainLogo
                network={props.skaleNetwork}
                chainName={props.schain.name}
                logos={MAINNET_CHAIN_LOGOS}
              />
            </div>
            <div className={cls(cmn.flex, cmn.flexg)}></div>
          </Link>
          <div
            className={cls(cmn.flex, cmn.flexcv, cmn.mbott10, 'br__tileBott', 'fullWidth')}
          ></div>
        </div>
        <Link to={'/ecosystem/' + shortAlias}>
          <Button size="small" className={'cardBtn'}>
            <span
              style={{
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                display: 'block',
                textOverflow: 'ellipsis'
              }}
            >
              {getChainAlias(props.skaleNetwork, props.schain.name, undefined, true)}
            </span>
          </Button>
        </Link>
      </div>
    </div>
  )
}
