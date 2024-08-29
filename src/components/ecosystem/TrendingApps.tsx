import React, { useMemo } from 'react'
import { type types } from '@/core'
import AppCard from './AppCardV2'
import { Box, Grid } from '@mui/material'
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
  const filteredApps = useMemo(
    () => trendingApps.filter((app) => getAppMeta(chainsMeta, app.chain, app.appName)),
    [trendingApps, chainsMeta]
  )

  const renderAppCard = (app: types.AppWithChainAndName) => {
    const isNew = isNewApp({ chain: app.chain, app: app.appName }, newApps)
    return (
      <Box key={`${app.chain}-${app.appName}`} className={cls('fl-centered dappCard')}>
        <AppCard
          skaleNetwork={skaleNetwork}
          schainName={app.chain}
          appName={app.appName}
          chainsMeta={chainsMeta}
          isNew={isNew}
          trending={1}
        />
      </Box>
    )
  }

  if (filteredApps.length === 0) {
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
    return <Carousel>{filteredApps.map(renderAppCard)}</Carousel>
  }

  return (
    <Grid container spacing={2}>
      {filteredApps.map((app) => (
        <Grid key={`${app.chain}-${app.appName}`} item xs={12} sm={6} md={4} lg={4}>
          {renderAppCard(app)}
        </Grid>
      ))}
    </Grid>
  )
}

export default React.memo(TrendingApps)
