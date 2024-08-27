import React from 'react'
import { type types } from '@/core'
import AppCard from './AppCardV2'
import { Box, Grid, Typography } from '@mui/material'
import { cls, cmn, SkPaper } from '@skalenetwork/metaport'
import Carousel from '../Carousel'
import { isNewApp } from '../../core/ecosystem/utils'
import { getAppMeta } from '../../core/ecosystem/apps'

interface TrendingAppsProps {
  skaleNetwork: types.SkaleNetwork
  chainsMeta: types.ChainsMetadataMap
  useCarousel?: boolean
  newApps: types.AppWithChainAndName[]
  trendingApps: types.AppWithChainAndName[]
}

const TrendingApps: React.FC<TrendingAppsProps> = ({
  skaleNetwork,
  chainsMeta,
  useCarousel,
  newApps,
  trendingApps
}) => {
  const renderAppCards = () => {
    return trendingApps.map((app) => {
      const isNew = isNewApp({ chain: app.chain, app: app.appName }, newApps)
      if (!getAppMeta(chainsMeta, app.chain, app.appName)) return null

      return (
        <Grid key={`${app.chain}-${app.appName}`} item xs={12} sm={6} md={4} lg={4}>
          <Box className={cls('fl-centered dappCard')}>
            <AppCard
              skaleNetwork={skaleNetwork}
              schainName={app.chain}
              appName={app.appName}
              chainsMeta={chainsMeta}
              isNew={isNew}
            />
          </Box>
        </Grid>
      )
    })
  }

  if (trendingApps.length === 0) {
    return (
      <SkPaper gray className="titleSection">
        <div className={cls(cmn.mtop20, cmn.mbott20)}>
          <p className={cls(cmn.p, cmn.p3, cmn.pSec, cmn.pCent)}>
            No trending apps match your current filters
          </p>
        </div>
      </SkPaper>
    )
  }

  if (useCarousel) {
    return (
      <Carousel>
        {trendingApps.map((app) => {
          const isNew = isNewApp({ chain: app.chain, app: app.appName }, newApps)
          if (!getAppMeta(chainsMeta, app.chain, app.appName)) return null
          return (
            <Box key={`${app.chain}-${app.appName}`} className={cls('fl-centered dappCard')}>
              <AppCard
                skaleNetwork={skaleNetwork}
                schainName={app.chain}
                appName={app.appName}
                chainsMeta={chainsMeta}
                isNew={isNew}
              />
            </Box>
          )
        })}
      </Carousel>
    )
  }

  return (
    <Grid container spacing={2}>
      {renderAppCards()}
    </Grid>
  )
}

export default TrendingApps
