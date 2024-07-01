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
 * @file AppChains.tsx
 * @copyright SKALE Labs 2024-Present
 */

import { cmn, cls, type interfaces, SkPaper, styles } from '@skalenetwork/metaport'

import CategorySection from './CategorySection'
import appChainsIcon from '../assets/appChains.png'
import { IMetrics } from '../core/types'

export default function AppChains(props: {
  skaleNetwork: interfaces.SkaleNetwork
  schains: any[]
  metrics: IMetrics | null
  chainsMeta: interfaces.ChainsMetadataMap
  isXs: boolean
}) {
  return (
    <div className={cls(cmn.mtop20)}>
      <div>
        <SkPaper
          gray
          className={cls(cmn.mbott10, 'titleSectionOut', 'border', cmn.flex, cmn.flexcv)}
          background="linear-gradient(270deg, rgb(50 12 41), rgb(37 6 39))"
        >
          <div className={cls(cmn.flex, cmn.flexcv, cmn.flexg, 'titleSection')}>
            <img className={cls(styles.chainIconlg)} src={appChainsIcon} />
            <div
              className={cls(
                [cmn.mleft20, !props.isXs],
                [cmn.mleft10, props.isXs],
                [cmn.flexg, true]
              )}
            >
              <h4 className={cls(cmn.p, cmn.p700, 'pOneLine')}>AppChains</h4>
              <p
                className={cls(
                  cmn.p,
                  [cmn.p4, !props.isXs],
                  [cmn.p5, props.isXs],
                  [cmn.mri10, props.isXs],
                  cmn.pSec
                )}
              >
                Apps and games hosted on dedicated SKALE Chains
              </p>
            </div>
          </div>
        </SkPaper>
        <div className={cls(['nestedSection', !props.isXs], cmn.mtop20, cmn.ptop20, cmn.mbott5)}>
          <div className={cls([cmn.mleft10, props.isXs])}>
            <CategorySection
              skaleNetwork={props.skaleNetwork}
              category="appChains"
              schains={props.schains}
              metrics={props.metrics}
              chainsMeta={props.chainsMeta}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
