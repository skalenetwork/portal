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
 * @copyright SKALE Labs 2024-Present
 */

import { Link } from 'react-router-dom'
import { cmn, cls, SkPaper } from '@skalenetwork/metaport'
import { type types } from '@/core'

import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'

import { MAINNET_CHAIN_LOGOS } from '../../core/constants'
import { getChainShortAlias } from '../../core/chain'
import { chainBg, getChainAlias } from '../../core/metadata'

import ChainLogo from '../ChainLogo'
import CollapsibleDescription from '../CollapsibleDescription'
import ChainActions from './ChainActions'
import Ship from '../Ship'

import { formatNumber } from '../../core/timeHelper'

const ChainCard: React.FC<{
  skaleNetwork: types.SkaleNetwork
  schain: types.ISChain
  chainsMeta: types.ChainsMetadataMap
  transactions: number | null
}> = ({ skaleNetwork, schain, chainsMeta, transactions }) => {
  const shortAlias = getChainShortAlias(chainsMeta, schain.name)
  const url = `/chains/${shortAlias}`

  const chainMeta = chainsMeta[schain.name]

  const handleConnectChain = () => {
    // Implement the logic to connect to the chain
    console.log(`Connecting to chain: ${schain.name}`)
  }

  return (
    <SkPaper gray fullHeight className="sk-app-card">
      <Link to={url}>
        <div className={cls(cmn.flex)}>
          <div className="sk-app-logo sk-logo-sm br__tile">
            <div
              className={cls('logo-wrapper')}
              style={{ background: chainBg(chainsMeta, schain.name) }}
            >
              <ChainLogo
                className={cls('responsive-logo')}
                network={skaleNetwork}
                chainName={schain.name}
                logos={MAINNET_CHAIN_LOGOS}
              />
            </div>
            <div className={cls(cmn.flex, cmn.flexg)}></div>
          </div>
          <div className={cls(cmn.flexg)}></div>
          <div>
            <Ship
              label={`${transactions ? formatNumber(transactions) : '...'} + Daily Tx`}
              icon={<TrendingUpRoundedIcon />}
            />
          </div>
        </div>
        <div className={cls(cmn.flex, cmn.flexcv, cmn.mtop10)}>
          <p className={cls(cmn.p, cmn.pPrim, cmn.p600, cmn.p1, 'shortP', cmn.flexg, cmn.mri5)}>
            {getChainAlias(chainsMeta, schain.name)}
          </p>
        </div>
        <CollapsibleDescription text={chainMeta.description || 'No description'} />
      </Link>
      <ChainActions
        className={cls(cmn.mtop20)}
        chainMeta={chainsMeta[schain.name]}
        schainName={schain.name}
        skaleNetwork={skaleNetwork}
        onConnectChain={handleConnectChain}
      />
    </SkPaper>
  )
}

export default ChainCard
