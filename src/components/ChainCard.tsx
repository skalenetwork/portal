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
import {
  cmn,
  cls,
  chainBg,
  getChainAlias,
  CHAINS_META,
  type interfaces
} from '@skalenetwork/metaport'

import Button from '@mui/material/Button'
import ChainLogo from './ChainLogo'

import { MAINNET_CHAIN_LOGOS } from '../core/constants'

export default function ChainCard(props: { skaleNetwork: interfaces.SkaleNetwork; schain: any[] }) {
  function getChainShortAlias(meta: interfaces.ChainsMetadataMap, name: string): string {
    return meta[name] && meta[name].shortAlias !== undefined ? meta[name].shortAlias! : name
  }

  const chainsMeta: interfaces.ChainsMetadataMap = CHAINS_META[props.skaleNetwork]

  const shortAlias = getChainShortAlias(chainsMeta, props.schain[0])

  return (
    <div>
      <div className="fl-centered">
        <div
          className={cls('br__tile')}
          style={{ background: chainBg(props.skaleNetwork, props.schain[0]) }}
        >
          <Link to={'/chains/' + shortAlias} className={cls('br__tileLogo', cmn.flex)}>
            <div className={cls(cmn.flex, cmn.flexg)}></div>
            <div className={cls(cmn.flex, cmn.flexcv, 'inheritSize')}>
              <ChainLogo chainName={props.schain[0]} logos={MAINNET_CHAIN_LOGOS} />
            </div>
            <div className={cls(cmn.flex, cmn.flexg)}></div>
          </Link>
          <div
            className={cls(
              cmn.flex,
              cmn.flexcv,
              cmn.mbott10,

              'br__tileBott',
              'fullWidth'
            )}
          >
            <Link
              to={'/chains/' + shortAlias}
              style={{
                width: '100%',
                padding: '20px 10px 0'
              }}
            >
              <Button size="small" className={'cardBtn'}>
                <span
                  style={{
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    display: 'block',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {getChainAlias(props.skaleNetwork, props.schain[0], undefined, true)}
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
