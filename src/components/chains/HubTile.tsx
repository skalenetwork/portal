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

import { cmn, cls, SkPaper, styles } from '@skalenetwork/metaport'
import { type types, metadata } from '@/core'

import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded'

import ChainLogo from '../ChainLogo'
import { formatNumber } from '../../core/timeHelper'

import { MAINNET_CHAIN_LOGOS } from '../../core/constants'

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

  const shortAlias = metadata.getChainShortAlias(props.chainsMeta, props.schainName)
  const alias = metadata.getAlias(props.chainsMeta, props.schainName, undefined, true)
  const chainDescription = metadata.getChainDescription(chainMeta)

  return (
    <Link to={'/chains/' + shortAlias} className="cmn.flex, cmn.pPrim, cmn.flexg">
      <SkPaper
        gray
        className="'titleSectionOut', 'hoverable', 'pointer', cmn.flexg"
        background={props.bg ? metadata.chainBg(props.chainsMeta, props.schainName) : ''}
      >
        <Tooltip title="Click to see Hub details">
          <div className="'titleSectionBg', cmn.flex, cmn.flexcv">
            <div
              className="cmn.flex, cmn.flexcv, cmn.flexg, cmn.mtop20, cmn.mbott20, cmn.mleft20"
            >
              <div className="styles.chainIconlg, cmn.flex, cmn.flexcv">
                <ChainLogo
                  network={props.network}
                  chainName={props.schainName}
                  logos={MAINNET_CHAIN_LOGOS}
                  className="responsive-logo"
                />
              </div>
              <div
                className="[cmn.mleft20, !props.isXs], [cmn.mleft10, props.isXs], cmn.flexg"
              >
                <h4 className=" cmn.p700, 'pOneLine'">{alias}</h4>
                <p
                  className={cls(

                    [text - xs, !props.isXs],
                    [text - xs, props.isXs],
                    [mr - 2.5, props.isXs],
                    cmn.pSec
                  )}
                >
                  {chainDescription.split('.', 1)[0]}
                </p>
              </div>
            </div>
            {props.isXs || !props.showStats ? null : (
              <div className="'chipSm', mr-2.5, cmn.flex, cmn.flexcv">
                <TrendingUpRoundedIcon />
                <p className=" text-xs, cmn.mleft10">
                  {schainMetrics
                    ? formatNumber(schainMetrics.chain_stats?.transactions_today)
                    : '...'}
                  + Daily Tx
                </p>
              </div>
            )}
            {!props.isXs && (
              <div className="cmn.mri20, styles.chainIconxs">
                <ArrowForwardIosRoundedIcon className="cmn.pSec" />
              </div>
            )}
          </div>
        </Tooltip>
      </SkPaper>
    </Link>
  )
}
