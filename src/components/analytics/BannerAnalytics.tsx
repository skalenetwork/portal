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
 * @file BannerAnalytics.tsx
 * @copyright SKALE Labs 2025-Present
 */


import { useState, useEffect } from 'react'
import { Card, CardContent, Typography, Box, Grid, Chip } from '@mui/material'
import { useStatsigClient } from '@statsig/react-bindings'

interface CardStats {
  cardName: string
  views: number
  clicks: number
  ctr: number
}

export default function BannerAnalytics(): JSX.Element | null {
  const [cardStats, setCardStats] = useState<CardStats[]>([])
  const [totalStats, setTotalStats] = useState({ views: 0, clicks: 0, ctr: 0 })
  const statsigClient = useStatsigClient()

  useEffect(() => {
    const loadStats = () => {
      const savedStats = localStorage.getItem('banner_card_stats')
      if (savedStats) {
        const stats = JSON.parse(savedStats)
        
        const cardPerformance: CardStats[] = [
          'Bridge to SKALE',
          'Stake your SKL', 
          'Play on Nebula',
          "Explore SKALE's DeFi",
          'Swap on SKALE'
        ].map(cardName => {
          const views = stats[cardName]?.views || 0
          const clicks = stats[cardName]?.clicks || 0
          const ctr = views > 0 ? (clicks / views) * 100 : 0
          
          if (statsigClient && clicks > 0) {
            console.log(`📈 Logging banner_click for ${cardName}:`, {
              clicks,
              ctr,
              environment: process.env.NODE_ENV
            })
            
            statsigClient.logEvent('banner_click', clicks, { 
              banner_name: cardName,
              click_percentage: ctr.toString(),
              environment: process.env.NODE_ENV || 'development'
            })
          }
          
          return { cardName, views, clicks, ctr }
        })

        const totalViews = cardPerformance.reduce((sum, card) => sum + card.views, 0)
        const totalClicks = cardPerformance.reduce((sum, card) => sum + card.clicks, 0)
        const totalCTR = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0

        if (statsigClient && totalClicks > 0) {
          console.log('🔄 Sending banner analytics to Statsig...', {
            environment: process.env.NODE_ENV,
            totalClicks,
            statsigClientReady: !!statsigClient
          })
          
          cardPerformance.forEach(card => {
            if (card.clicks > 0) {
              const clickDistributionPercent = (card.clicks / totalClicks) * 100
              console.log(`📊 Logging banner_click_distribution for ${card.cardName}:`, {
                percentage: clickDistributionPercent,
                clicks: card.clicks,
                totalClicks
              })
              
              statsigClient.logEvent('banner_click_distribution', clickDistributionPercent, {
                banner_name: card.cardName,
                clicks: card.clicks.toString(),
                total_clicks: totalClicks.toString(),
                environment: process.env.NODE_ENV || 'development'
              })
            }
          })
        } else {
          console.log('❌ Not sending to Statsig:', {
            statsigClient: !!statsigClient,
            totalClicks,
            environment: process.env.NODE_ENV
          })
        }

        setCardStats(cardPerformance)
        setTotalStats({ views: totalViews, clicks: totalClicks, ctr: totalCTR })
      }
    }

    loadStats()b
    const interval = setInterval(loadStats, 2000)
    return () => clearInterval(interval)
  }, [statsigClient])


  if (process.env.NODE_ENV === 'production') {
    return null
  }

  return (
    <Card sx={{ margin: 2, backgroundColor: '#f8f9fa', border: '2px solid #e0e0e0' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          📊 Banner Click Analytics (Live)
          <Chip label="DEV MODE" size="small" color="primary" />
        </Typography>

        <Box mb={3} p={2} sx={{ backgroundColor: '#e3f2fd', borderRadius: 1 }}>
          <Grid container spacing={2} textAlign="center">
            <Grid item xs={4}>
              <Typography variant="h4" color="primary">{totalStats.views}</Typography>
              <Typography variant="caption">Total Views</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h4" color="success.main">{totalStats.clicks}</Typography>
              <Typography variant="caption">Total Clicks</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h4">
                {totalStats.ctr.toFixed(1)}%
              </Typography>
              <Typography variant="caption">Overall CTR</Typography>
            </Grid>
          </Grid>
        </Box>

        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
          🎯 Click Percentage by Banner Card:
        </Typography>
        
        {cardStats.map((card) => (
          <Box key={card.cardName} mb={2} p={2} sx={{ backgroundColor: '#fff', borderRadius: 1, border: '1px solid #e0e0e0' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="subtitle2" fontWeight="bold">
                {card.cardName}
              </Typography>
              <Chip 
                label={`${card.ctr.toFixed(1)}%`}
                variant="filled"
                size="small"
                sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}
              />
            </Box>  
          
            
            <Box display="flex" justifyContent="space-between" mt={1}>
              <Typography variant="caption" color="text.secondary">
                <strong>{card.clicks} clicks</strong> / {card.views} views
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {totalStats.clicks > 0 ? `${((card.clicks / totalStats.clicks) * 100).toFixed(1)}% of total clicks` : 'No clicks yet'}
              </Typography>
            </Box>
          </Box>
        ))}

        {cardStats.some(card => card.views > 0) && (
          <Box mt={3} p={2} sx={{ backgroundColor: '#fff3e0', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom fontWeight="bold">
              🏆 Performance Ranking (CTR):
            </Typography>
            {cardStats
              .filter(card => card.views > 0)
              .sort((a, b) => b.ctr - a.ctr)
              .map((card, index) => (
                <Box key={card.cardName} display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2">
                    {index + 1}. <strong>{card.cardName}</strong>
                  </Typography>
                  <Chip 
                    label={`${card.ctr.toFixed(1)}%`}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              ))}
          </Box>
        )}

        <Box mt={2} p={1} sx={{ backgroundColor: '#f0f0f0', borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary">
            💡 Refresh the page and click different banner buttons to see real-time analytics. 
            Data is tracked locally and sent to Statsig in all environments (check browser console for logs).
            <br />
            📈 <strong>To view data in Statsig:</strong> Go to Events → "banner_click_distribution" → 
            Group by "banner_name" to see what percentage of total clicks each banner gets.
            <br />
            🔍 <strong>Debug:</strong> Open browser console to see if events are being sent to Statsig.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}
