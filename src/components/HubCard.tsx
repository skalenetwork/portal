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
 * @file HubCard.tsx
 * @copyright SKALE Labs 2024-Present
 */

import { cmn, cls, type interfaces } from '@skalenetwork/metaport'

import HubTile from './chains/HubTile'
import HubApps from './chains/HubApps'

import { IMetrics, ISChain } from '../core/types'

export default function HubCard(props: {
  skaleNetwork: interfaces.SkaleNetwork
  schain: ISChain
  metrics: IMetrics | null
  isXs: boolean
  chainsMeta: interfaces.ChainsMetadataMap
}) {
  return (
    <div>
      <div>
        <HubTile
          bg={true}
          network={props.skaleNetwork}
          schainName={props.schain.name}
          isXs={props.isXs}
          showStats={true}
          metrics={props.metrics}
          chainsMeta={props.chainsMeta}
        />
        <div className={cls(cmn.mtop20, cmn.flex)}>
          <div className={cls(['nestedSection', !props.isXs])}></div>
          <div className={cls(cmn.flexg, cmn.mtop10, [cmn.mleft10, props.isXs])}>
            <HubApps
              skaleNetwork={props.skaleNetwork}
              schainName={props.schain.name}
              chainsMeta={props.chainsMeta}
              bg={true}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
