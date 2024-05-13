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
import { Link } from 'react-router-dom'
import { Collapse, Grid, IconButton, Tooltip } from '@mui/material'

import {
  cmn,
  cls,
  chainBg,
  getChainAlias,
  CHAINS_META,
  type interfaces,
  SkPaper,
  styles
} from '@skalenetwork/metaport'

import RemoveCircleRoundedIcon from '@mui/icons-material/RemoveCircleRounded'
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded'

import { MAINNET_CHAIN_LOGOS } from '../core/constants'
import { timestampToDate } from '../core/helper'

import AppCard from './AppCard'
import ChainLogo from './ChainLogo'


export default function HubCard(props: { skaleNetwork: interfaces.SkaleNetwork; schain: any[] }) {
  const [show, setShow] = useState<boolean>(true)

  function getChainShortAlias(meta: interfaces.ChainsMetadataMap, name: string): string {
    return meta[name]?.shortAlias !== undefined ? meta[name].shortAlias! : name
  }

  const chainsMeta: interfaces.ChainsMetadataMap = CHAINS_META[props.skaleNetwork]
  const chainMeta = chainsMeta[props.schain[0]]

  const shortAlias = getChainShortAlias(chainsMeta, props.schain[0])
  const alias = getChainAlias(props.skaleNetwork, props.schain[0], undefined, true)

  const appCards: ReactElement[] = []

  if (chainMeta.apps) {
    for (const appName in chainMeta.apps) {
      if (chainMeta.apps.hasOwnProperty(appName)) {
        appCards.push(
          <Grid key={appName} className="fl-centered dappCard" item lg={3} md={4} sm={6} xs={12}>
            <AppCard
              skaleNetwork={props.skaleNetwork}
              schainName={props.schain[0]}
              appName={appName}
            />
          </Grid>
        )
      }
    }
  }

  const chainDescription = chainMeta?.description
    ? chainMeta.description
    : `Chain was created on ${timestampToDate(props.schain[5])}`

  return (
    <div>
      <div>
        <SkPaper
          gray
          className={cls('titleSectionOut', 'border')}
          background={chainBg(props.skaleNetwork, props.schain[0])}
        >
          <div className={cls('titleSectionBg', cmn.flex, cmn.flexcv)}>
            <Tooltip title="Click to see Hub details">
              <Link
                to={'/chains/' + shortAlias}
                className={cls(cmn.flex, cmn.pPrim, cmn.flexg, 'hoverable')}
              >
                <div
                  className={cls(
                    cmn.flex,
                    cmn.flexcv,
                    cmn.flexg,
                    cmn.mtop20,
                    cmn.mbott20,
                    cmn.mleft20
                  )}
                >
                  <ChainLogo
                    chainName={props.schain[0]}
                    logos={MAINNET_CHAIN_LOGOS}
                    className={cls(styles.chainIconlg)}
                  />
                  <div className={cls(cmn.mleft20, [cmn.flexg, true])}>
                    <h4 className={cls(cmn.p, cmn.p700, 'pOneLine')}>{alias}</h4>
                    <p className={cls(cmn.p, cmn.p4, cmn.pSec)}>
                      {chainDescription.split('.', 1)[0]}
                    </p>
                  </div>
                </div>
              </Link>
            </Tooltip>
            <Tooltip title={`Click to ${show ? 'hide' : 'show'} Hub apps`}>
              <IconButton
                onClick={() => {
                  setShow(!show)
                }}
                className={cls(cmn.mri20)}
              >
                {show ? (
                  <RemoveCircleRoundedIcon className={cls(styles.chainIconxs, cmn.pSec)} />
                ) : (
                  <AddCircleRoundedIcon className={cls(styles.chainIconxs, cmn.pSec)} />
                )}
              </IconButton>
            </Tooltip>
          </div>
        </SkPaper>

        <Collapse in={show}>
          <div className={cls(cmn.mtop10, cmn.flex)}>
            <div className={cls('nestedSection', ['nestedSectionXs', false], cmn.mtop10)}></div>
            <Grid container spacing={2} className={cls(cmn.mtop10)}>
              {appCards}
            </Grid>
          </div>
        </Collapse>
      </div>
    </div>
  )
}
