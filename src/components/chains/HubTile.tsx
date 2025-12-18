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

import { SkPaper, useThemeMode } from '@skalenetwork/metaport'
import { type types, metadata } from '@/core'

import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded'

import ChainLogo from '../ChainLogo'
import { formatNumber } from '../../core/timeHelper'

import { MAINNET_CHAIN_LOGOS } from '../../core/constants'
import { ChevronRight, TrendingUp } from 'lucide-react'

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
  const { mode } = useThemeMode()
  useEffect(() => {
    if (props.metrics !== null && props.metrics.metrics[props.schainName]) {
      setSchainMetrics(props.metrics.metrics[props.schainName])
    }
  }, [props.metrics])

  const chainMeta = props.chainsMeta[props.schainName]

  const shortAlias = metadata.getChainShortAlias(props.chainsMeta, props.schainName)
  const alias = metadata.getAlias(
    props.network,
    props.chainsMeta,
    props.schainName,
    undefined,
    true
  )
  const chainDescription = metadata.getChainDescription(chainMeta)

  return (
    <Link to={'/chains/' + shortAlias} className="flex text-primary grow">
      <SkPaper
        gray
        className="titleSectionOut hoverable pointer grow"
        background={
          props.bg ? metadata.chainBg(props.network, props.chainsMeta, props.schainName, mode) : ''
        }
      >
        <Tooltip title="Click to see Hub details">
          <div className="bg-background! flex items-center rounded-3xl ">
            <div className="flex items-center grow mt-5 mb-5 ml-5 ">
              <div className="w-[45px] h-[45px] flex items-center">
                <ChainLogo
                  network={props.network}
                  chainName={props.schainName}
                  logos={MAINNET_CHAIN_LOGOS}
                  className="responsive-logo"
                />
              </div>
              <div className={`${!props.isXs ? 'ml-5' : 'ml-2.5'} grow`}>
                <h4 className="font-bold text-lg text-foreground">{alias}</h4>
                <p className={`text-xs ${props.isXs ? 'mr-2.5' : ''} text-secondary-foreground`}>
                  {chainDescription.split('.', 1)[0]}
                </p>
              </div>
            </div>
            {props.isXs || !props.showStats ? null : (
              <div className="chipSm mr-2.5 flex items-center">
                <TrendingUp />
                <p className="text-xs ml-2.5">
                  {schainMetrics
                    ? formatNumber(schainMetrics.chain_stats?.transactions_today)
                    : '...'}
                  + Daily Tx
                </p>
              </div>
            )}
            {!props.isXs && (
              <div className="mr-5 w-4 h-4">
                <ChevronRight className="text-secondary-foreground" />
              </div>
            )}
          </div>
        </Tooltip>
      </SkPaper>
    </Link>
  )
}
