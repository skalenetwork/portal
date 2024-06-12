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

import { useState, ReactElement } from 'react'
import { Grid, Tooltip } from '@mui/material'

import { cmn, cls, chainBg, type interfaces } from '@skalenetwork/metaport'

import { sortObjectByKeys } from '../core/helper'

import AppCard from './AppCard'
import { IMetrics, ISChain } from '../core/types'
import HubTile from './ecosystem/HubTile'

export default function HubCard(props: {
  skaleNetwork: interfaces.SkaleNetwork
  schain: ISChain
  metrics: IMetrics | null
  isXs: boolean
  chainsMeta: interfaces.ChainsMetadataMap
}) {
  const [show, setShow] = useState<boolean>(false)
  const chainMeta = props.chainsMeta[props.schain.name]
  const appCards: ReactElement[] = []

  if (chainMeta.apps) {
    for (const appName in sortObjectByKeys(chainMeta.apps)) {
      if (chainMeta.apps.hasOwnProperty(appName)) {
        appCards.push(
          <Grid key={appName} className="fl-centered dappCard" item lg={3} md={4} sm={6} xs={6}>
            <AppCard
              skaleNetwork={props.skaleNetwork}
              schainName={props.schain.name}
              appName={appName}
              chainsMeta={props.chainsMeta}
            />
          </Grid>
        )
      }
    }
  }
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
        <div className={cls(cmn.mtop10, cmn.flex)}>
          <div className={cls('nestedSection', ['nestedSectionXs', props.isXs], cmn.mtop10)}></div>
          <Grid container spacing={2} className={cls(cmn.mtop10)}>
            {show ? appCards : appCards.length === 4 ? appCards : appCards.slice(0, 3)}
            {appCards.length > 7 ? (
              <Grid className="fl-centered dappCard" item lg={3} md={4} sm={6} xs={6}>
                <Tooltip title={show ? 'Click hide apps' : 'Click to show more apps'}>
                  <div
                    onClick={() => {
                      setShow(!show)
                    }}
                    className={cls('br__tile', 'pointer')}
                    style={{ background: chainBg(props.skaleNetwork, props.schain.name) }}
                  >
                    <div className={cls('titleSectionBg', 'br__tileIns', cmn.flex)}>
                      <div className={cls(cmn.flex, cmn.flexg)}></div>
                      <div className={cls(cmn.flex, cmn.flexcv, 'inheritSize')}>
                        <p className={cls(cmn.p, cmn.p2, cmn.p700)}>
                          {show ? 'Hide apps' : `+${appCards.length - 3} Apps`}
                        </p>
                      </div>
                      <div className={cls(cmn.flex, cmn.flexg)}></div>
                    </div>
                  </div>
                </Tooltip>
              </Grid>
            ) : null}
          </Grid>
        </div>
      </div>
    </div>
  )
}
