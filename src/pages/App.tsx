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
import { type types, metadata, units, constants } from '@/core'

import {
  explorer,
  MetaportCore,
  SkPaper,
  useWagmiAccount,
  useConnectModal,
  Tile
} from '@skalenetwork/metaport'

import { Button } from '@mui/material'
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
import HourglassBottomRoundedIcon from '@mui/icons-material/HourglassBottomRounded'
import HourglassTopRoundedIcon from '@mui/icons-material/HourglassTopRounded'
import HourglassFullRoundedIcon from '@mui/icons-material/HourglassFullRounded'
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'

import { useApps } from '../useApps'

import { getAppMetaWithChainApp } from '../core/ecosystem/apps'
import { formatNumber } from '../core/timeHelper'
import { MAX_APPS_DEFAULT, OFFCHAIN_APP } from '../core/constants'
import { getRecentApps, isNewApp, isTrending, isFeatured } from '../core/ecosystem/utils'

import SocialButtons from '../components/ecosystem/Socials'
import CategoriesChips from '../components/ecosystem/CategoriesChips'
import { useLikedApps } from '../LikedAppsContext'
import { useAuth } from '../AuthContext'
import ErrorTile from '../components/ErrorTile'
import { ChipNew, ChipPreTge, ChipTrending, ChipFeatured } from '../components/Chip'
import AppScreenshots from '../components/ecosystem/AppScreenshots'
import RecommendedApps from '../components/ecosystem/RecommendedApps'
import Logo from '../components/Logo'
import LinkSurface from '../components/LinkSurface'
import Breadcrumbs from '../components/Breadcrumbs'
import CollapsibleDescription from '../components/CollapsibleDescription'
import HubTile from '../components/chains/HubTile'
import AccordionSection from '../components/AccordionSection'

export default function App(props: {
  mpc: MetaportCore
  loadData: () => Promise<void>
  metrics: types.IMetrics | null
  isXs: boolean
  chainsMeta: types.ChainsMetadataMap
}) {
  let { chain, app } = useParams()
  const { likedApps, appLikes, toggleLikedApp, getAppId, refreshLikedApps } = useLikedApps()
  const { isSignedIn, handleSignIn } = useAuth()

  const { address } = useWagmiAccount()
  const { openConnectModal } = useConnectModal()

  const newApps = useMemo(
    () => getRecentApps(props.chainsMeta, MAX_APPS_DEFAULT),
    [props.chainsMeta]
  )

  if (chain === undefined || app === undefined) return 'No such app'

  const network = props.mpc.config.skaleNetwork
  const [expanded, setExpanded] = useState<string | false>('panel3')
  const [counters, setCounters] = useState<types.IAddressCounters | null>(null)

  chain = metadata.findChainName(props.chainsMeta, chain ?? '')
  const chainMeta = props.chainsMeta[chain]
  if (!chainMeta)
    return (
      <Container maxWidth="md">
        <ErrorTile errorMsg={`No such chain: ${chain}`} />
      </Container>
    )

  const appAlias = metadata.getAlias(props.chainsMeta, chain, app)
  const appMeta = chainMeta.apps?.[app]

  if (!appMeta)
    return (
      <Container maxWidth="md">
        <ErrorTile errorMsg={`No such app: ${app}`} />
      </Container>
    )

  const appDescription = appMeta.description ?? 'No description'

  const { trendingApps, allApps, featuredApps } = useApps(props.chainsMeta, props.metrics)

  const appId = getAppId(chain, app)
  const isLiked = likedApps.includes(appId)
  const likesCount = appLikes[appId] || 0

  const isNew = isNewApp({ chain, app }, newApps)
  const trending = isTrending(trendingApps, chain, app)
  const featured = isFeatured({ chain, app }, featuredApps)

  const handleToggleLike = async () => {
    if (!address) {
      openConnectModal?.()
      return
    }
    if (!isSignedIn) {
      await handleSignIn()
      return
    }
    await toggleLikedApp(appId)
    refreshLikedApps()
  }

  const explorerUrl = explorer.getExplorerUrl(network, chain)

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
    setCounters(explorer.getTotalAppCounters(props.metrics.metrics[chain].apps_counters[app]))
  }, [props.metrics])

  function handleChange(panel: string | false) {
    setExpanded(expanded && panel === expanded ? false : panel)
  }

  function formatGas(): string | null {
    if (!props.metrics || !counters) return null
    const gasSpentWei = BigInt(counters.gas_usage_count) * BigInt(props.metrics.gas)
    return formatNumber(Number(units.fromWei(gasSpentWei, constants.DEFAULT_ERC20_DECIMALS)))
  }

  return (
    <Container maxWidth="md">
      <div className="'chainDetails' mb-5">
        <Helmet>
          <title>SKALE Portal - {appAlias}</title>
          <meta name="description" content={appDescription} />
          <meta property="og:title" content={`SKALE Portal - ${appAlias}`} />
          <meta property="og:description" content={appDescription} />
        </Helmet>

        <div className="flex">
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
          <div className="flex-grow"></div>
        </div>
        <SkPaper gray className="mt-2.5">
          <div className="m-2.5">
            <div className="'responsive-app-header' flex items-center">
              <Logo
                chainsMeta={props.chainsMeta}
                skaleNetwork={network}
                chainName={chain}
                appName={app}
                size="md"
              />

              <div className="'app-info' flex-grow">
                <div className="[flex !props.isXs]">
                  <div className="flex-grow mb-2.5">
                    <CategoriesChips categories={appMeta.categories} all />
                  </div>
                  <Button
                    className="mb-2.5 [mt-2.5, props.isXs] 'btn btnSm favsBtn'"
                    variant="contained"
                    startIcon={isLiked ? <FavoriteRoundedIcon /> : <FavoriteBorderOutlinedIcon />}
                    onClick={handleToggleLike}
                  >
                    {isLiked ? 'Favorite' : 'Add to favorites'}
                  </Button>
                </div>

                <div className="flex items-center">
                  <h2 className="m-0 text-base">{appAlias}</h2>
                  <div className="flex ml-2.5">
                    {featured && <ChipFeatured />}
                    {trending && <ChipTrending />}
                    {isNew && <ChipNew />}
                    {metadata.isPreTge(appMeta) && <ChipPreTge />}
                  </div>
                </div>

                <CollapsibleDescription text={appDescription} expandable />
                <SocialButtons size="md" social={appMeta.social} className="mt-5" />
              </div>
            </div>
          </div >
        </SkPaper >
        <SkPaper gray className="mt-2.5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {appMeta.contracts && (
              <div className="col-span-1">
                <Tile
                  grow
                  text="Total transactions"
                  value={counters ? formatNumber(Number(counters.transactions_count)) : undefined}
                  icon={<DataSaverOffRoundedIcon />}
                />
              </div>
            )}
            {appMeta.contracts && (
              <div className="col-span-1">
                <Tile
                  grow
                  text="Gas saved"
                  childrenRi={
                    !props.isXs ? (
                      <InfoOutlinedIcon
                        className="text-secondary styles.chainIconxs ml-2.5"
                      />
                    ) : undefined
                  }
                  tooltip={
                    props.metrics && counters
                      ? `Given gas price ${props.metrics.gas} wei. ${counters.gas_usage_count} of gas used.`
                      : undefined
                  }
                  value={props.metrics && counters ? `${formatGas()} ETH` : undefined}
                  icon={<SavingsRoundedIcon />}
                />
              </div>
            )}
            <div className={`col-span-1 ${appMeta.contracts ? 'md:col-span-1 lg:col-span-1' : 'md:col-span-2 lg:col-span-3'}`}>
              <Tile
                grow
                text="Favorites"
                value={likesCount.toString()}
                icon={<FavoriteRoundedIcon />}
              />
            </div>
            {appMeta.contracts && (
              <div className="col-span-1">
                <Tile
                  grow
                  text="30d transactions"
                  value={
                    counters ? formatNumber(Number(counters.transactions_last_30_days)) : undefined
                  }
                  icon={<HourglassFullRoundedIcon />}
                />
              </div>
            )}
            {appMeta.contracts && (
              <div className="col-span-1">
                <Tile
                  grow
                  text="7d transactions"
                  value={
                    counters ? formatNumber(Number(counters.transactions_last_7_days)) : undefined
                  }
                  icon={<HourglassBottomRoundedIcon />}
                />
              </div>
            )}
            {appMeta.contracts && (
              <div className="col-span-1">
                <Tile
                  grow
                  text="Daily transactions"
                  value={counters ? formatNumber(Number(counters.transactions_today)) : undefined}
                  icon={<HourglassTopRoundedIcon />}
                />
              </div>
            )}
          </div>
        </SkPaper>
        <AppScreenshots chainName={chain} appName={app} skaleNetwork={network} />
        {
          chain !== OFFCHAIN_APP && (
            <SkPaper gray className="mt-2.5, 'fwmobile'">
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
                      {appMeta.contracts.map((contractAddress: string, index: number) => (
                        <div key={contractAddress} className="col-span-1">
                          <LinkSurface
                            className="styles.fullHeight"
                            title={`Contract ${index + 1}`}
                            value={contractAddress}
                            url={explorer.addressUrl(explorerUrl, contractAddress)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </AccordionSection>
              ) : (
                <div></div>
              )}
            </SkPaper>
          )
        }

        <SkPaper gray className="mt-2.5, 'fwmobile'">
          <AccordionSection
            expandedByDefault
            title="Discover more"
            icon={<AutoAwesomeRoundedIcon />}
            marg={false}
          >
            <RecommendedApps
              className="mt-2.5"
              skaleNetwork={props.mpc.config.skaleNetwork}
              chainsMeta={props.chainsMeta}
              allApps={allApps}
              currentApp={getAppMetaWithChainApp(props.chainsMeta, chain, app)}
              newApps={newApps}
              trendingApps={trendingApps}
              featuredApps={featuredApps}
              useCarousel={true}
            />
          </AccordionSection>
        </SkPaper>
      </div >
    </Container >
  )
}
