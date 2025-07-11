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
 * @file AppCardV2.tsx
 * @copyright SKALE Labs 2024-Present
 */

import { Link } from 'react-router-dom'
import { cmn, cls, SkPaper, ChainIcon } from '@skalenetwork/metaport'
import { type types, metadata } from '@/core'
import Logo from '../Logo'

import CollapsibleDescription from '../CollapsibleDescription'
import CategoriesChips from './CategoriesChips'
import SocialButtons from './Socials'
import { ChipNew, ChipPreTge, ChipTrending, ChipFeatured } from '../Chip'
import { OFFCHAIN_APP } from '../../core/constants'

export default function AppCard(props: {
  skaleNetwork: types.SkaleNetwork
  schainName: string
  appName: string
  chainsMeta: types.ChainsMetadataMap
  transactions?: number
  newApps?: types.AppWithChainAndName[]
  isNew?: boolean
  isFeatured?: boolean
  mostLiked?: number
  trending?: boolean
  gray?: boolean
}) {
  const shortAlias = metadata.getChainShortAlias(props.chainsMeta, props.schainName)
  const url = `/ecosystem/${shortAlias}/${props.appName}`
  const appMeta = props.chainsMeta[props.schainName]?.apps?.[props.appName]

  const gray = props.gray ?? true

  if (!appMeta) return

  const appDescription = appMeta.description ?? 'No description'

  const statusChips = []
  if (props.isFeatured) statusChips.push(<ChipFeatured key="featured" />)
  if (props.trending) statusChips.push(<ChipTrending key="trending" />)
  if (props.isNew) statusChips.push(<ChipNew key="new" />)
  if (metadata.isPreTge(appMeta)) statusChips.push(<ChipPreTge key="pretge" />)

  const maxStatusChips = 2
  const visibleStatusChips = statusChips.slice(0, maxStatusChips)

  return (
    <SkPaper gray={gray} fullHeight className="sk-app-card">
      <Link to={url}>
        <div>
          <div className={cls(cmn.flex)}>
            <Logo
              chainsMeta={props.chainsMeta}
              skaleNetwork={props.skaleNetwork}
              chainName={props.schainName}
              appName={props.appName}
            />
            <div className={cls(cmn.flex, cmn.flexg)}></div>
            {props.schainName !== OFFCHAIN_APP && (
              <ChainIcon skaleNetwork={props.skaleNetwork} chainName={props.schainName} />
            )}
          </div>
        </div>
        <div className={cls(cmn.flex, cmn.flexcv, cmn.mtop10)}>
          <p className={cls(cmn.p, cmn.pPrim, cmn.p600, cmn.p1, 'shortP', cmn.flexg, cmn.mri10)}>
            {metadata.getAlias(props.chainsMeta, props.schainName, props.appName)}
          </p>
          <div className={cls(cmn.flex, cmn.flexcv)}>{visibleStatusChips}</div>
        </div>
        <CollapsibleDescription text={appDescription} />
        <CategoriesChips categories={appMeta.categories} className={cls(cmn.mtop20)} />
      </Link>
      <SocialButtons
        social={appMeta.social}
        chainName={props.schainName}
        appName={props.appName}
        className={cls(cmn.mtop20)}
      />
    </SkPaper>
  )
}
