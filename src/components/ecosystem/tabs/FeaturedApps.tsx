

import React, { useMemo } from 'react'
import { Grid, Box, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import { cls, cmn, SkPaper } from '@skalenetwork/metaport'
import AppCard from '../AppCardV2'
import Carousel from '../../Carousel'
import { type types, metadata } from '@/core'
import { useLikedApps } from '../../../LikedAppsContext'
import { isTrending, isNewApp } from '../../../core/ecosystem/utils'

interface FeaturedAppsProps {
  featuredApps: types.AppWithChainAndName[]
  skaleNetwork: types.SkaleNetwork
  chainsMeta: types.ChainsMetadataMap
  trendingApps: types.AppWithChainAndName[]
  newApps: types.AppWithChainAndName[]
  useCarousel?: boolean
  gray?: boolean
  showSeeMoreButton?: boolean
  chainName?: string
}

const FeaturedApps: React.FC<FeaturedAppsProps> = ({
  featuredApps,
  skaleNetwork,
  chainsMeta,
  newApps,
  trendingApps,
  useCarousel = false,
  gray = true,
  showSeeMoreButton = false,
  chainName
}) => {
  const { getMostLikedApps, getAppId, getMostLikedRank } = useLikedApps()
  const trendingAppIds = useMemo(() => getMostLikedApps(), [getMostLikedApps])
  const filteredFeaturedApps = useMemo(() => {
    const filtered = featuredApps.filter((app) => {
      const chainData = chainsMeta[app.chain]?.apps?.[app.appName]
      return chainData?.featured === true
    })
    return filtered
  }, [featuredApps, chainsMeta])

  const renderAppCard = (app: types.AppWithChainAndName) => {
    const isNew = isNewApp({ chain: app.chain, app: app.appName }, newApps)
    const appId = getAppId(app.chain, app.appName)

    return (
      <AppCard
        key={`${app.chain}-${app.appName}`}
        skaleNetwork={skaleNetwork}
        schainName={app.chain}
        appName={app.appName}
        chainsMeta={chainsMeta}
        mostLiked={getMostLikedRank(trendingAppIds, appId)}
        trending={isTrending(trendingApps, app.chain, app.appName)}
        isNew={isNew}
        isFeatured={true}
        gray={gray}
      />
    )
  }

  if (useCarousel) {
    return <Carousel>{featuredApps.map(renderAppCard)}</Carousel>
  }

  if (featuredApps.length === 0) {
    return (
      <SkPaper gray className="titleSection">
        <div className={cls(cmn.mtop20, cmn.mbott20)}>
          <p className={cls(cmn.p, cmn.p2, cmn.pSec, cmn.pCent)}>
            🚫 No featured apps match your current filters
          </p>
        </div>
      </SkPaper>
    )
  }

  return (
    <>
      <Grid container spacing={2}>
        {filteredFeaturedApps.map((app) => (
          <Grid key={`${app.chain}-${app.appName}`} item xs={12} sm={6} md={4} lg={4}>
            <Box className={cls('fl-centered dappCard')}>{renderAppCard(app)}</Box>
          </Grid>
        ))}
      </Grid>
      {showSeeMoreButton && chainName !== null && chainName !== undefined && chainName.trim() !== '' && (
        <Box className={cls(cmn.flex, cmn.flexc, cmn.mtop20)}>
          <Link 
            to={`/ecosystem?search=${encodeURIComponent(metadata.getAlias(chainsMeta, chainName))}`}
            style={{ textDecoration: 'none' }}
          >
            <Button
              variant="outlined"
              endIcon={<ArrowForwardRoundedIcon />}
              className={cls('btn')}
            >
              See more
            </Button>
          </Link>
        </Box>
      )}
    </>
  )
}

export default FeaturedApps
