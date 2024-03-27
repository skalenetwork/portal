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
 * @file AppCard.tsx
 * @copyright SKALE Labs 2022-Present
 */

import { Link } from 'react-router-dom'
import {
  cmn,
  cls,
  chainBg,
  getChainAlias,
  CHAINS_META,
  ChainIcon,
  type interfaces
} from '@skalenetwork/metaport'

import Button from '@mui/material/Button'

export default function AppCard(props: {
  skaleNetwork: interfaces.SkaleNetwork
  schainName: string
  appName: string
}) {
  function getChainShortAlias(meta: interfaces.ChainsMetadataMap, name: string): string {
    return meta[name]?.shortAlias !== undefined ? meta[name].shortAlias! : name
  }

  const chainsMeta: interfaces.ChainsMetadataMap = CHAINS_META[props.skaleNetwork]

  const shortAlias = getChainShortAlias(chainsMeta, props.schainName)

  return (
    <div>
      <div className="fl-centered">
        <div
          className={cls('br__tile')}
          style={{ background: chainBg(props.skaleNetwork, props.schainName, props.appName) }}
        >
          <Link to={'/chains/' + shortAlias} className={cls('br__tileLogo', cmn.flex)}>
            <div className={cls(cmn.flex, cmn.flexg)}></div>
            <div className={cls(cmn.flex, cmn.flexcv, 'inheritSize')}>
              <ChainIcon
                chainName={props.schainName}
                app={props.appName}
                skaleNetwork={props.skaleNetwork}
                size="lg"
              />
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
                  {getChainAlias(props.skaleNetwork, props.schainName, props.appName, true)}
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
