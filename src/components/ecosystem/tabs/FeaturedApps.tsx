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
  * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  * GNU Affero General Public License for more details.
  *
  * You should have received a copy of the GNU Affero General Public License
  * along with this program. If not, see <https://www.gnu.org/licenses/>.
  */
 /**
  * @file FeaturedApps.tsx
  * @copyright SKALE Labs 2025-Present
  */

 import React, { useMemo } from 'react'
 import { Grid, Box } from '@mui/material'
 import { cls, cmn, SkPaper } from '@skalenetwork/metaport'
 import AppCard from '../AppCardV2'
 import Carousel from '../../Carousel'
 import { type types } from '@/core'
 import { useLikedApps } from '../../../LikedAppsContext'
 import { isTrending } from '../../../core/ecosystem/utils'
 import { isNewApp } from '../../../core/ecosystem/utils'



 interface FeaturedAppsProps {
   featuredApps: types.AppWithChainAndName[]
   skaleNetwork: types.SkaleNetwork
   chainsMeta: types.ChainsMetadataMap
   trendingApps: types.AppWithChainAndName[]
   newApps: types.AppWithChainAndName[]
   useCarousel?: boolean
 }

 const FeaturedApps: React.FC<FeaturedAppsProps> = ({
   featuredApps,
   skaleNetwork,
   chainsMeta,
   newApps,
   trendingApps,
   useCarousel = false

 }) => {
   const { getMostLikedApps, getAppId, getMostLikedRank } = useLikedApps()
   const trendingAppIds = useMemo(() => getMostLikedApps(), [getMostLikedApps])
   const filteredFeaturedApps = useMemo(() => {
     const filtered = featuredApps.filter((app) => {
       const chainData = chainsMeta[app.chain]?.apps?.[app.appName];
       return chainData?.featured === true;
     });
     return filtered;
   }, [featuredApps, chainsMeta]);

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
           <p className={cls(cmn.p, cmn.p3, cmn.pSec, cmn.pCent)}>
             No featured apps match your current filters
           </p>
         </div>
       </SkPaper>
     )
   }

   return (
     <Grid container spacing={2}>
       {filteredFeaturedApps.map((app) => (
         <Grid key={`${app.chain}-${app.appName}`} item xs={12} sm={6} md={4} lg={4}>
           <Box className={cls('fl-centered dappCard')}>{renderAppCard(app)}</Box>
         </Grid>
       ))}
     </Grid>
   )
 }

 export default FeaturedApps