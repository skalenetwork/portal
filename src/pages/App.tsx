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

import { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useParams } from 'react-router-dom'

import { MetaportCore, fromWei, styles, cmn, cls, SkPaper } from '@skalenetwork/metaport'
import { type types } from '@/core'

import { Button, Grid } from '@mui/material'
import Container from '@mui/material/Container'
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded'
import SavingsRoundedIcon from '@mui/icons-material/SavingsRounded'
import DataSaverOffRoundedIcon from '@mui/icons-material/DataSaverOffRounded'
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded'
import WidgetsRoundedIcon from '@mui/icons-material/WidgetsRounded'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import HubRoundedIcon from '@mui/icons-material/HubRounded'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'

import ChainLogo from '../components/ChainLogo'
import SkStack from '../components/SkStack'
import Tile from '../components/Tile'
import LinkSurface from '../components/LinkSurface'
import Breadcrumbs from '../components/Breadcrumbs'
import CollapsibleDescription from '../components/CollapsibleDescription'
import HubTile from '../components/chains/HubTile'
import AccordionSection from '../components/AccordionSection'

import { findChainName } from '../core/chain'

import { formatNumber } from '../core/timeHelper'
import { chainBg, getChainAlias } from '../core/metadata'
import { addressUrl, getExplorerUrl, getTotalAppCounters } from '../core/explorer'
import { MAINNET_CHAIN_LOGOS, MAX_APPS_DEFAULT, OFFCHAIN_APP } from '../core/constants'
import SocialButtons from '../components/ecosystem/Socials'
import AppCategoriesChips from '../components/ecosystem/CategoriesShips'
import { useLikedApps } from '../LikedAppsContext'
import { useAuth } from '../AuthContext'
import ErrorTile from '../components/ErrorTile'
import { ShipNew, ShipPreTge, ShipTrending } from '../components/Ship'
import { getRecentApps, isNewApp } from '../core/ecosystem/utils'

export default function App(props: {
  mpc: MetaportCore
  loadData: () => Promise<void>
  metrics: types.IMetrics | null
  isXs: boolean
  chainsMeta: types.ChainsMetadataMap
}) {
  let { chain, app } = useParams()
  const { likedApps, appLikes, toggleLikedApp, getAppId, getTrendingApps } = useLikedApps()
  const { isSignedIn, handleSignIn } = useAuth()

  const newApps = useMemo(
    () => getRecentApps(props.chainsMeta, MAX_APPS_DEFAULT),
    [props.chainsMeta]
  )

  if (chain === undefined || app === undefined) return 'No such app'

  const network = props.mpc.config.skaleNetwork
  const [expanded, setExpanded] = useState<string | false>('panel3')
  const [counters, setCounters] = useState<types.IAddressCounters | null>(null)

  chain = findChainName(props.chainsMeta, chain ?? '')
  const chainMeta = props.chainsMeta[chain]
  if (!chainMeta)
    return (
      <Container maxWidth="md">
        <ErrorTile errorMsg={`No such chain: ${chain}`} />
      </Container>
    )

  const appAlias = getChainAlias(props.chainsMeta, chain, app)
  const appMeta = chainMeta.apps?.[app]

  if (!appMeta)
    return (
      <Container maxWidth="md">
        <ErrorTile errorMsg={`No such app: ${app}`} />
      </Container>
    )

  const appDescription = appMeta.description ?? 'No description'

  const appId = getAppId(chain, app)
  const isLiked = likedApps.includes(appId)
  const likesCount = appLikes[appId] || 0

  const trendingAppIds = useMemo(() => getTrendingApps(), [getTrendingApps])
  const isNew = isNewApp({ chain, app }, newApps)

  const handleFavoriteClick = async () => {
    if (!isSignedIn) {
      await handleSignIn()
    }
    await toggleLikedApp(appId)
  }

  const explorerUrl = getExplorerUrl(network, chain)

  const isAppChain = chainMeta.apps && Object.keys(chainMeta.apps).length === 1

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

  return (
    <Container maxWidth="md">
      <div className={cls('chainDetails', cmn.mbott20)}>
        <Helmet>
          <title>SKALE Portal - {appAlias}</title>
          <meta name="description" content={appDescription} />
          <meta property="og:title" content={`SKALE Portal - ${appAlias}`} />
          <meta property="og:description" content={appDescription} />
        </Helmet>

        <div className={cls(cmn.flex)}>
          <Breadcrumbs
            className="bg"
            sections={[
              {
                text: 'Ecosystem',
                icon: <ArrowBackIosNewRoundedIcon />,
                url: '/ecosystem'
              },
              {
                text: appAlias,
                icon: <WidgetsRoundedIcon />
              }
            ]}
          />
          <div className={cls(cmn.flexg)}></div>
        </div>
        <SkPaper gray className={cls(cmn.mtop10)}>
          <div className={cls(cmn.m10)}>
            <div className={cls('responsive-app-header', cmn.flex, cmn.flexcvd)}>
              <div className={cls('sk-app-logo', 'sk-logo-md')}>
                <div
                  className={cls('logo-wrapper borderLight')}
                  style={{
                    background: chainBg(props.chainsMeta, chain, app),
                    flexShrink: 0
                  }}
                >
                  <ChainLogo
                    className={cls('responsive-logo')}
                    network={network}
                    chainName={chain}
                    app={app}
                    logos={MAINNET_CHAIN_LOGOS}
                  />
                </div>
              </div>
              <div className={cls('app-info', cmn.flexg)}>
                <SkStack>
                  <div className={cls(cmn.flexg, cmn.mbott10)}>
                    <AppCategoriesChips categories={appMeta.categories} />
                  </div>
                  <Button
                    className={cls(cmn.mbott10, 'btn btnSm')}
                    variant="contained"
                    startIcon={isLiked ? <FavoriteRoundedIcon /> : <FavoriteBorderOutlinedIcon />}
                    onClick={handleFavoriteClick}
                  >
                    {isLiked ? 'Favorite' : 'Add to favorites'}
                  </Button>
                </SkStack>

                <div className={cls(cmn.flex, cmn.flexcv)}>
                  <h2 className={cls(cmn.nom, cmn.p1)}>{appAlias}</h2>
                  <div className={cls(cmn.flex, cmn.mleft10)}>
                    {trendingAppIds.includes(appId) && <ShipTrending />}
                    {isNew && <ShipNew />}
                    {appMeta.tags?.includes('pretge') && <ShipPreTge />}
                  </div>
                </div>

                <CollapsibleDescription text={appDescription} expandable />
                <SocialButtons size="md" social={appMeta.social} className={cls(cmn.mtop20)} />
              </div>
            </div>
          </div>
        </SkPaper>
        <SkPaper gray className={cls(cmn.mtop10)}>
          <SkStack>
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
                  !props.isXs ? (
                    <InfoOutlinedIcon className={cls(cmn.pSec, styles.chainIconxs, cmn.mleft10)} />
                  ) : undefined
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
            <Tile
              grow
              text="Favorites"
              value={likesCount.toString()}
              icon={<FavoriteRoundedIcon />}
            />
          </SkStack>
        </SkPaper>
        {chain !== OFFCHAIN_APP && (
          <SkPaper gray className={cls(cmn.mtop10, 'fwmobile')}>
            <AccordionSection
              handleChange={handleChange}
              expanded={expanded}
              panel="panel3"
              title={`Runs on SKALE ${isAppChain ? 'Chain' : 'Hub'}`}
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
                          url={addressUrl(explorerUrl, contractAddress)}
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
        )}
      </div>
    </Container>
  )
}
