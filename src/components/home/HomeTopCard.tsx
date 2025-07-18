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
 * @file HomeTopCard.tsx
 * @copyright SKALE Labs 2025-Present
 */

import { useEffect, useState } from 'react'
import { useStatsigClient, useExperiment, useFeatureGate } from '@statsig/react-bindings'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, Button, Typography, Box } from '@mui/material'
import SwapHorizontalCircleOutlinedIcon from '@mui/icons-material/SwapHorizontalCircleOutlined'
import PieChartOutlineRoundedIcon from '@mui/icons-material/PieChartOutlineRounded'
import SportsEsportsOutlinedIcon from '@mui/icons-material/SportsEsportsOutlined'
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined'
import { cls, cmn } from '@skalenetwork/metaport'

interface TopCardConfig {
  bannerText: string
  buttonText: string
  buttonLink: string
  variant: string
  isInExperiment: boolean
  cardName: string
  icon: JSX.Element
}

export default function HomeTopCard() {
  const statsigClient = useStatsigClient()
  const experiment = useExperiment('home_page_top_card_cta_test')
  const isExperimentEnabled = useFeatureGate('home_page_top_card_test_enabled')
  const navigate = useNavigate()
  const [cardConfig, setCardConfig] = useState<TopCardConfig | null>(null)

  useEffect(() => {
    if (isExperimentEnabled) {
      const variant = experiment.groupName || 'control'
      
      const bannerText = experiment.get('banner_text', 'Bridge SKL and other popular tokens to SKALE')
      const buttonText = experiment.get('button_text', 'Start Bridging')
      const buttonLink = experiment.get('button_link', '/bridge')
      
      let cardName = 'Bridge to SKALE'
      let icon = <SwapHorizontalCircleOutlinedIcon />
      
      if (bannerText.includes('validator') || bannerText.includes('delegate')) {
        cardName = 'Stake your SKL'
        icon = <PieChartOutlineRoundedIcon />
      } else if (bannerText.includes('games') || bannerText.includes('gaming')) {
        cardName = 'Play on Nebula'
        icon = <SportsEsportsOutlinedIcon />
      } else if (bannerText.includes('DeFi') || bannerText.includes('Europa')) {
        cardName = "Explore SKALE's DeFi"
        icon = <PublicOutlinedIcon />
      } else if (bannerText.includes('Swap') || bannerText.includes('SushiSwap')) {
        cardName = 'Swap on SKALE'
        icon = <SwapHorizontalCircleOutlinedIcon />
      }
      
      setCardConfig({
        bannerText,
        buttonText,
        buttonLink,
        variant,
        isInExperiment: true,
        cardName,
        icon
      })

      statsigClient.logEvent('home_top_card_experiment_exposed', variant, {
        experiment: 'home_page_top_card_cta_test',
        cardName: cardName,
        bannerText: bannerText,
        buttonText: buttonText
      })
    } else {
      setCardConfig({
        bannerText: 'Bridge SKL and other popular tokens to SKALE',
        buttonText: 'Start Bridging',
        buttonLink: '/bridge',
        variant: 'control',
        isInExperiment: false,
        cardName: 'Bridge to SKALE',
        icon: <SwapHorizontalCircleOutlinedIcon />
      })
    }
  }, [isExperimentEnabled, experiment, statsigClient])

  useEffect(() => {
    if (cardConfig) {
      statsigClient.logEvent('home_top_card_viewed', cardConfig.variant, {
        experiment: cardConfig.isInExperiment ? 'home_page_top_card_cta_test' : 'control',
        cardName: cardConfig.cardName,
        bannerText: cardConfig.bannerText
      })
    }
  }, [cardConfig, statsigClient])

  const handleCardClick = () => {
    if (!cardConfig) return

    statsigClient.logEvent('home_top_card_clicked', cardConfig.variant, {
      experiment: cardConfig.isInExperiment ? 'home_page_top_card_cta_test' : 'control',
      cardName: cardConfig.cardName,
      buttonText: cardConfig.buttonText,
      buttonLink: cardConfig.buttonLink
    })

    if (cardConfig.buttonLink.startsWith('http')) {
      window.open(cardConfig.buttonLink, '_blank')
    } else {
      navigate(cardConfig.buttonLink)
    }
  }

  if (!cardConfig) return null

  return (
    <Card 
      className={cls(cmn.mtop20, cmn.mbott20, cmn.pointer)}
      onClick={handleCardClick}
      sx={{
        background: 'linear-gradient(135deg, #00d4aa 0%, #0099cc 100%)',
        color: 'white',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 25px rgba(0, 212, 170, 0.3)'
        },
        transition: 'all 0.3s ease'
      }}
    >
      <CardContent className={cls(cmn.p15)}>
        <Box className={cls(cmn.flex, cmn.flexcv, cmn.mbott15)}>
          <Box className={cls(cmn.mri10)} sx={{ color: 'white' }}>
            {cardConfig.icon}
          </Box>
          <Typography variant="h6" component="h2" sx={{ color: 'white', fontWeight: 600 }}>
            {cardConfig.cardName}
          </Typography>
        </Box>
        
        <Typography 
          variant="body1" 
          className={cls(cmn.mbott15)}
          sx={{ color: 'rgba(255, 255, 255, 0.9)' }}
        >
          {cardConfig.bannerText}
        </Typography>
        
        <Button
          variant="contained"
          fullWidth
          onClick={(e) => {
            e.stopPropagation()
            handleCardClick()
          }}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.3)'
            }
          }}
        >
          {cardConfig.buttonText}
        </Button>
      </CardContent>
    </Card>
  )
}
