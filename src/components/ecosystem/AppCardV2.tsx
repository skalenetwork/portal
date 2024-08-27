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
import { type types } from '@/core'

import ChainLogo from '../ChainLogo'
import { MAINNET_CHAIN_LOGOS, OFFCHAIN_APP } from '../../core/constants'
import { getChainShortAlias } from '../../core/chain'
import { chainBg, getChainAlias } from '../../core/metadata'

import CollapsibleDescription from '../CollapsibleDescription'
import CategoriesChips from './CategoriesChips'
import SocialButtons from './Socials'
import { ChipTrending, ChipNew, ChipPreTge } from '../Chip'

export default function AppCard(props: {
  skaleNetwork: types.SkaleNetwork
  schainName: string
  appName: string
  chainsMeta: types.ChainsMetadataMap
  transactions?: number
  newApps?: types.AppWithChainAndName[]
  isTrending?: boolean
  isNew?: boolean
}) {
  const shortAlias = getChainShortAlias(props.chainsMeta, props.schainName)
  const url = `/ecosystem/${shortAlias}/${props.appName}`
  const appMeta = props.chainsMeta[props.schainName]?.apps?.[props.appName]

  if (!appMeta) return

  const appDescription = appMeta.description ?? 'No description'

  return (
    <SkPaper gray fullHeight className="sk-app-card">
      <Link to={url}>
        <div className={cls(cmn.flex)}>
          <div className="sk-app-logo sk-logo-sm br__tile">
            <div
              className={cls('logo-wrapper borderLight')}
              style={{ background: chainBg(props.chainsMeta, props.schainName, props.appName) }}
            >
              <ChainLogo
                className={cls('responsive-logo')}
                network={props.skaleNetwork}
                chainName={props.schainName}
                app={props.appName}
                logos={MAINNET_CHAIN_LOGOS}
              />
            </div>
            <div className={cls(cmn.flex, cmn.flexg)}></div>
          </div>
          <div className={cls(cmn.flexg)}></div>
          {props.schainName !== OFFCHAIN_APP && (
            <ChainIcon skaleNetwork={props.skaleNetwork} chainName={props.schainName} />
          )}
        </div>
        <div className={cls(cmn.flex, cmn.flexcv, cmn.mtop10)}>
          <p className={cls(cmn.p, cmn.pPrim, cmn.p600, cmn.p1, 'shortP', cmn.flexg, cmn.mri5)}>
            {getChainAlias(props.chainsMeta, props.schainName, props.appName)}
          </p>
          {props.isTrending && <ChipTrending />}
          {props.isNew && <ChipNew />}
          {appMeta.tags?.includes('pretge') && <ChipPreTge />}
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
