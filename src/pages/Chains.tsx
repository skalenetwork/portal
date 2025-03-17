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
 * @file Chains.tsx
 * @copyright SKALE Labs 2023-Present
 */

import { Helmet } from 'react-helmet'

import { useEffect } from 'react'

import { cmn, cls, useMetaportStore, useWagmiAccount } from '@skalenetwork/metaport'
import { constants } from '@/core'

import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import CircularProgress from '@mui/material/CircularProgress'

import StarRoundedIcon from '@mui/icons-material/StarRounded'
import HubRoundedIcon from '@mui/icons-material/HubRounded'
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded'

import ChainsSection from '../components/chains/ChainsSection'
import { META_TAGS } from '../core/meta'
import SkPageInfoIcon from '../components/SkPageInfoIcon'
import usePortalStore from '../PortalStore'

export default function Chains() {
  const { schains, chainsMeta, metrics, loadData } = usePortalStore((state) => ({
    loadData: state.loadData,
    schains: state.schains,
    metrics: state.metrics,
    chainsMeta: state.chainsMeta
  }))

  const { address } = useWagmiAccount()

  useEffect(() => {
    loadData(mpc, address)
  }, [])

  const mpc = useMetaportStore((state) => state.mpc)
  const network = mpc.config.skaleNetwork

  if (!schains || schains.length === 0 || !chainsMeta) {
    return <div>Loading chains...</div>
  }

  const appChains = schains.filter(
    (schain) =>
      chainsMeta[schain.name] &&
      (!chainsMeta[schain.name].apps ||
        (chainsMeta[schain.name].apps && Object.keys(chainsMeta[schain.name].apps!).length === 1))
  )

  const otherChains = schains.filter((schain) => !chainsMeta[schain.name])

  if (schains.length === 0) {
    return (
      <div className="fullscreen-msg">
        <div className={cls(cmn.flex)}>
          <div className={cls(cmn.flex, cmn.flexcv, cmn.mri20)}>
            <CircularProgress className="fullscreen-spin" />
          </div>
          <div className={cls(cmn.flex, cmn.flexcv)}>
            <h3 className="fullscreen-msg-text">Loading SKALE Chains</h3>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Container maxWidth="md" className={cls(cmn.mbott20)}>
      <Helmet>
        <title>{META_TAGS.chains.title}</title>
        <meta name="description" content={META_TAGS.chains.description} />
        <meta property="og:title" content={META_TAGS.chains.title} />
        <meta property="og:description" content={META_TAGS.chains.description} />
      </Helmet>
      <Stack spacing={0}>
        <div className={cls(cmn.flex, cmn.flexcv)}>
          <div className={cmn.flexg}>
            <h2 className={cls(cmn.nom)}>SKALE Chains</h2>
            <p className={cls(cmn.nom, cmn.p, cmn.p3, cmn.pSec)}>
              Connect, get block explorer links and endpoints
            </p>
          </div>
          <SkPageInfoIcon meta_tag={META_TAGS.chains} />
        </div>
        <ChainsSection
          name="SKALE Hubs"
          schains={schains.filter(
            (schain) =>
              chainsMeta[schain.name] &&
              chainsMeta[schain.name].apps &&
              Object.keys(chainsMeta[schain.name].apps!).length > 1
          )}
          chainsMeta={chainsMeta}
          metrics={metrics}
          skaleNetwork={network}
          size="lg"
          icon={<HubRoundedIcon color="primary" />}
        />
        {appChains.length !== 0 && (
          <ChainsSection
            name="App Chains"
            schains={appChains}
            chainsMeta={chainsMeta}
            metrics={metrics}
            skaleNetwork={network}
            size="md"
            icon={<StarRoundedIcon color="primary" />}
          />
        )}
        {network !== constants.MAINNET_CHAIN_NAME && otherChains.length !== 0 && (
          <ChainsSection
            name="Other Chains"
            schains={otherChains}
            chainsMeta={chainsMeta}
            metrics={metrics}
            skaleNetwork={network}
            size="md"
            icon={<CategoryRoundedIcon color="primary" />}
          />
        )}
        <div className={cls(cmn.mbott20, cmn.mtop20)}></div>
      </Stack>
    </Container>
  )
}
