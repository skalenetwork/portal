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
 * @file App.tsx
 * @copyright SKALE Labs 2024-Present
 */

import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useParams } from 'react-router-dom'

import {
  MetaportCore,
  fromWei,
  interfaces,
  styles,
  cmn,
  cls,
  SkPaper
} from '@skalenetwork/metaport'

import { Button, Grid } from '@mui/material'
import Container from '@mui/material/Container'
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded'
import TrackChangesRoundedIcon from '@mui/icons-material/TrackChangesRounded'
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded'
import SavingsRoundedIcon from '@mui/icons-material/SavingsRounded'
import DataSaverOffRoundedIcon from '@mui/icons-material/DataSaverOffRounded'
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded'
import LinkRoundedIcon from '@mui/icons-material/LinkRounded'
import WidgetsRoundedIcon from '@mui/icons-material/WidgetsRounded'
import InfoRoundedIcon from '@mui/icons-material/InfoRounded'
import HubRoundedIcon from '@mui/icons-material/HubRounded'

import ChainCategories from '../components/ChainCategories'
import ChainLogo from '../components/ChainLogo'
import SkStack from '../components/SkStack'
import Tile from '../components/Tile'
import LinkSurface from '../components/LinkSurface'
import Breadcrumbs from '../components/Breadcrumbs'
import CollapsibleDescription from '../components/CollapsibleDescription'
import HubTile from '../components/ecosystem/HubTile'
import AccordionSection from '../components/AccordionSection'

import { findChainName } from '../core/chain'

import { IAddressCounters, IMetrics } from '../core/types'
import { formatNumber } from '../core/timeHelper'
import { chainBg, getChainAlias } from '../core/metadata'
import { addressUrl, getExplorerUrl, getTotalAppCounters } from '../core/explorer'
import { DAPP_RADAR_BASE_URL, MAINNET_CHAIN_LOGOS } from '../core/constants'

export default function App(props: {
  mpc: MetaportCore
  loadData: () => Promise<void>
  metrics: IMetrics | null
  isXs: boolean
  chainsMeta: interfaces.ChainsMetadataMap
}) {
  let { chain, app } = useParams()
  if (chain === undefined || app === undefined) return 'No such app'

  const network = props.mpc.config.skaleNetwork
  const [expanded, setExpanded] = useState<string | false>('panel3')
  const [counters, setCounters] = useState<IAddressCounters | null>(null)

  chain = findChainName(props.chainsMeta, chain ?? '')

  const chainAlias = getChainAlias(props.chainsMeta, chain)
  const appAlias = getChainAlias(props.chainsMeta, chain, app)
  const appMeta = props.chainsMeta[chain]?.apps?.[app]!
  const appDescription = appMeta.description ?? 'No description'
  const dAppRadarUrl = `${DAPP_RADAR_BASE_URL}${app}`

  const expolorerUrl = getExplorerUrl(network, chain)

  useEffect(() => {
    props.loadData()
  }, [])

  useEffect(() => {
    if (
      app === undefined ||
      chain === undefined ||
      props.metrics === null ||
      !props.metrics.metrics[chain] ||
      !props.metrics.metrics[chain].apps_counters[app]
    )
      return
    setCounters(getTotalAppCounters(props.metrics.metrics[chain].apps_counters[app]))
  }, [props.metrics])

  function handleChange(panel: string | false) {
    setExpanded(expanded && panel === expanded ? false : panel)
  }

  function formatGas(): string | null {
    if (!props.metrics || !counters) return null
    const gasSpentGwei = BigInt(counters.gas_usage_count) * BigInt(props.metrics.gas)
    return formatNumber(Number(fromWei(gasSpentGwei, '9')))
  }

  // const breadcrumbs: BreadcrumbSection[] = [{
  //   text: 'Ecosystem',
  //   icon: <ArrowBackIosNewRoundedIcon />,
  //   url: '/ecosystem'
  // }]

  return (
    <Container maxWidth="md">
      <div className={cls('chainDetails', cmn.mbott20)}>
        <Helmet>
          <title>SKALE Portal - {appAlias}</title>
          <meta name="description" content={appDescription} />
          <meta property="og:title" content={`SKALE Portal - ${appAlias}`} />
          <meta property="og:description" content={appDescription} />
        </Helmet>
        <SkPaper background={chainBg(props.chainsMeta, chain, app)} className={cls(cmn.mtop10)}>
          <SkStack>
            <Breadcrumbs
              sections={[
                {
                  text: props.isXs ? '' : 'Ecosystem',
                  icon: <ArrowBackIosNewRoundedIcon />,
                  url: '/ecosystem'
                },
                {
                  text: props.isXs ? '' : chainAlias,
                  icon: <LinkRoundedIcon />,
                  url: `/ecosystem/${chain}`
                },
                {
                  text: appAlias,
                  icon: <WidgetsRoundedIcon />
                }
              ]}
            />
            <div className={cls(cmn.flexg)}></div>
            <ChainCategories category={appMeta.tags} alias={appAlias} />
          </SkStack>

          <div className={cls(cmn.pCent)}>
            <Container maxWidth="sm" className={cls('logo', cmn.pCent)}>
              <ChainLogo
                network={props.mpc.config.skaleNetwork}
                chainName={chain}
                logos={MAINNET_CHAIN_LOGOS}
                app={app}
              />
            </Container>
          </div>

          <SkStack>
            <Tile
              grow
              children={
                <div>
                  <h2 className={cls(cmn.nom)}>{appAlias}</h2>
                  <CollapsibleDescription text={appDescription} />
                </div>
              }
            />
          </SkStack>
          <SkStack className={cmn.mtop10}>
            <Tile
              className={cls(cmn.flex, cmn.flexcv)}
              grow={!appMeta.contracts}
              children={
                <SkStack>
                  <div>
                    {appMeta.url ? (
                      <a target="_blank" rel="noreferrer" href={appMeta.url} className="undec">
                        <Button
                          size="medium"
                          className={cls(styles.btnAction, cmn.mri10)}
                          startIcon={<ArrowOutwardRoundedIcon />}
                        >
                          Open Website
                        </Button>
                      </a>
                    ) : null}
                  </div>
                  <div>
                    {appMeta.url ? (
                      <a target="_blank" rel="noreferrer" href={dAppRadarUrl} className="undec">
                        <Button
                          size="medium"
                          className={cls(styles.btnAction, cmn.mri10)}
                          startIcon={<TrackChangesRoundedIcon />}
                        >
                          Open DappRadar
                        </Button>
                      </a>
                    ) : null}
                  </div>
                </SkStack>
              }
            />
            {appMeta.contracts ? (
              <Tile
                grow
                text="Total transactions"
                value={counters ? formatNumber(Number(counters.transactions_count)) : undefined}
                icon={<DataSaverOffRoundedIcon />}
              />
            ) : null}
            {appMeta.contracts ? (
              <Tile
                grow
                text="Gas saved"
                childrenRi={
                  <InfoRoundedIcon className={cls(cmn.pSec, styles.chainIconxs, cmn.mleft10)} />
                }
                tooltip={
                  props.metrics && counters
                    ? `Given gas price ${props.metrics.gas} Gwei. ${counters.gas_usage_count} of gas used.`
                    : undefined
                }
                value={props.metrics && counters ? `${formatGas()} ETH` : undefined}
                icon={<SavingsRoundedIcon />}
              />
            ) : null}
          </SkStack>
          <div></div>
        </SkPaper>
        <SkPaper gray className={cls(cmn.mtop20)}>
          <AccordionSection
            handleChange={handleChange}
            expanded={expanded}
            panel="panel3"
            title="Runs on SKALE Hub"
            icon={<HubRoundedIcon />}
          >
            <HubTile
              network={props.mpc.config.skaleNetwork}
              schainName={chain}
              isXs={props.isXs}
              metrics={null}
              chainsMeta={props.chainsMeta}
            />
          </AccordionSection>
          {appMeta.contracts ? (
            <AccordionSection
              expandedByDefault={true}
              title="Smart contracts"
              icon={<ArticleRoundedIcon />}
            >
              <div>
                <Grid container spacing={2} className={cls(cmn.full)}>
                  {appMeta.contracts.map((contractAddress: string, index: number) => (
                    <Grid key={contractAddress} item lg={6} xs={12}>
                      <LinkSurface
                        className={cls(styles.fullHeight)}
                        title={`Contract ${index + 1}`}
                        value={contractAddress}
                        url={addressUrl(expolorerUrl, contractAddress)}
                      />
                    </Grid>
                  ))}
                </Grid>
              </div>
            </AccordionSection>
          ) : (
            <div></div>
          )}
        </SkPaper>
      </div>
    </Container>
  )
}
