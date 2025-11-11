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
 * @file Credits.tsx
 * @copyright SKALE Labs 2025-Present
 */

import { Helmet } from 'react-helmet'

import { useState, useEffect } from 'react'

import { Contract } from 'ethers'

import { cmn, cls, type MetaportCore } from '@skalenetwork/metaport'
import { type types } from '@/core'

import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import CircularProgress from '@mui/material/CircularProgress'


import { META_TAGS } from '../core/meta'
import { getCreditStation } from '../core/credit-station'

import SkPageInfoIcon from '../components/SkPageInfoIcon'
import CreditTokensAdmin from '../components/credits/TokensAdmin'

interface CreditsProps {
  mpc: MetaportCore
  address: types.AddressType | undefined
  isXs: boolean
  loadData: () => Promise<void>
  schains: types.ISChain[]
  chainsMeta: types.ChainsMetadataMap
}

const Credits: React.FC<CreditsProps> = ({ mpc, address, isXs, loadData, schains, chainsMeta }) => {
  const [_, setIntervalId] = useState<NodeJS.Timeout>()
  const [creditStation, setCreditStation] = useState<Contract | undefined>(undefined)

  async function initCreditStation() {
    setCreditStation(await getCreditStation(mpc))
  }

  useEffect(() => {
    loadData()
    const intervalId = setInterval(loadData, 100000)
    setIntervalId(intervalId)
    initCreditStation()
  }, [])

  if (schains.length === 0 || !creditStation) {
    return (
      <div className="fullscreen-msg">
        <div className={cls(cmn.flex)}>
          <div className={cls(cmn.flex, cmn.flexcv, cmn.mri20)}>
            <CircularProgress className="fullscreen-spin" />
          </div>
          <div className={cls(cmn.flex, cmn.flexcv)}>
            <h3 className="fullscreen-msg-text">Loading credits info</h3>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Container maxWidth="md" className={cls(cmn.mbott20)}>
      <Helmet>
        <title>{META_TAGS.credits.title}</title>
        <meta name="description" content={META_TAGS.credits.description} />
        <meta property="og:title" content={META_TAGS.credits.title} />
        <meta property="og:description" content={META_TAGS.credits.description} />
      </Helmet>
      <Stack spacing={0}>
        <div className={cls(cmn.flex, cmn.flexcv)}>
          <div className={cmn.flexg}>
            <h2 className={cls(cmn.nom)}>Chain Credits Admin</h2>
            <p className={cls(cmn.nom, cmn.p, cmn.p3, cmn.pSec)}>
              Manage admin functions for SKALE Chain Credits.
            </p>
          </div>
          <SkPageInfoIcon meta_tag={META_TAGS.credits} />
        </div>
        <CreditTokensAdmin mpc={mpc} isXs={isXs} creditStation={creditStation} />
      </Stack>
    </Container >
  )
}

export default Credits
