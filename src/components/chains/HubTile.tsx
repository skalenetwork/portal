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

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Tooltip } from '@mui/material'

import { cmn, cls, getChainAlias, SkPaper, styles } from '@skalenetwork/metaport'
import { type types } from '@/core'

import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded'

import ChainLogo from '../ChainLogo'
import { formatNumber } from '../../core/timeHelper'

import { MAINNET_CHAIN_LOGOS } from '../../core/constants'
import { getChainDescription, getChainShortAlias } from '../../core/chain'
import { chainBg } from '../../core/metadata'

export default function HubTile(props: {
  network: types.SkaleNetwork
  metrics: types.IMetrics | null
  schainName: string
  isXs: boolean
  chainsMeta: types.ChainsMetadataMap
  bg?: boolean
  showStats?: boolean
}) {
  const [schainMetrics, setSchainMetrics] = useState<types.IChainMetrics | null>(null)

  useEffect(() => {
    if (props.metrics !== null && props.metrics.metrics[props.schainName]) {
      setSchainMetrics(props.metrics.metrics[props.schainName])
    }
  }, [props.metrics])

  const chainMeta = props.chainsMeta[props.schainName]

  const shortAlias = getChainShortAlias(props.chainsMeta, props.schainName)
  const alias = getChainAlias(props.network, props.schainName, undefined, true)
  const chainDescription = getChainDescription(chainMeta)

  return (
    <Link to={'/chains/' + shortAlias} className={cls(cmn.flex, cmn.pPrim, cmn.flexg)}>
      <SkPaper
        gray
        className={cls('titleSectionOut', 'hoverable', 'pointer', cmn.flexg)}
        background={props.bg ? chainBg(props.chainsMeta, props.schainName) : ''}
      >
        <Tooltip title="Click to see Hub details">
          <div className={cls('titleSectionBg', cmn.flex, cmn.flexcv)}>
            <div
              className={cls(cmn.flex, cmn.flexcv, cmn.flexg, cmn.mtop20, cmn.mbott20, cmn.mleft20)}
            >
              <ChainLogo
                network={props.network}
                chainName={props.schainName}
                logos={MAINNET_CHAIN_LOGOS}
                className={cls(styles.chainIconlg)}
              />
              <div
                className={cls([cmn.mleft20, !props.isXs], [cmn.mleft10, props.isXs], cmn.flexg)}
              >
                <h4 className={cls(cmn.p, cmn.p700, 'pOneLine')}>{alias}</h4>
                <p
                  className={cls(
                    cmn.p,
                    [cmn.p4, !props.isXs],
                    [cmn.p5, props.isXs],
                    [cmn.mri10, props.isXs],
                    cmn.pSec
                  )}
                >
                  {chainDescription.split('.', 1)[0]}
                </p>
              </div>
            </div>
            {props.isXs || !props.showStats ? null : (
              <div className={cls('shipHot', 'shipSm', cmn.mri10, cmn.flex, cmn.flexcv)}>
                <TrendingUpRoundedIcon />
                <p className={cls(cmn.p, cmn.p5, cmn.mleft10)}>
                  {schainMetrics
                    ? formatNumber(schainMetrics.chain_stats?.transactions_today)
                    : '...'}
                  + Daily Tx
                </p>
              </div>
            )}
            {!props.isXs && (
              <div className={cls(cmn.mri20, styles.chainIconxs)}>
                <ArrowForwardIosRoundedIcon className={cls(cmn.pSec)} />
              </div>
            )}
          </div>
        </Tooltip>
      </SkPaper>
    </Link>
  )
}
