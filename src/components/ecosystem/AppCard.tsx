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
import { type types, metadata } from '@/core'

import Button from '@mui/material/Button'
import ChainLogo from '../ChainLogo'
import { MAINNET_CHAIN_LOGOS } from '../../core/constants'
import { formatNumber } from '../../core/timeHelper'

export default function AppCard(props: {
  skaleNetwork: types.SkaleNetwork
  schainName: string
  appName: string
  chainsMeta: types.ChainsMetadataMap
  transactions?: number
}) {
  const shortAlias = metadata.getChainShortAlias(props.chainsMeta, props.schainName)
  const url = `/ecosystem/${shortAlias}/${props.appName}`

  return (
    <div>
      <div className="flex justify-center items-center">
        <div
          className="br__tile borderLight radius"
          style={{
            background: metadata.chainBg(
              props.skaleNetwork,
              props.chainsMeta,
              props.schainName,
              props.appName
            )
          }}
        >
          <Link to={url} className="br__tileLogo br__tileIns flex">
            <div className="flex grow"></div>
            <div className="flex items-center inheritSize">
              <ChainLogo
                network={props.skaleNetwork}
                chainName={props.schainName}
                app={props.appName}
                logos={MAINNET_CHAIN_LOGOS}
              />
            </div>
            <div className="flex grow"></div>
          </Link>
          <div className="flex items-center mb-2.5 br__tileBott fullW"></div>
        </div>
        <Link to={url}>
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
                props.schainName,
                props.appName
              )}
            </span>
          </Button>
          {props.transactions ? (
            <div>
              <p className="text-xs text-secondary-foreground text-center mt-1.25 mr-1.25">
                {formatNumber(props.transactions)} Txs
              </p>
            </div>
          ) : (
            <div></div>
          )}
        </Link>
      </div>
    </div>
  )
}
