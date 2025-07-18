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
 * @file HomeBanner.tsx
 * @copyright SKALE Labs 2025-Present
 */

import { useEffect, useState } from 'react'
import { Button } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { cmn, cls } from '@skalenetwork/metaport'
import { useNavigate } from 'react-router-dom'
import { useStatsigClient, useExperiment, useFeatureGate } from '@statsig/react-bindings'
import { EXPLORE_CARDS } from './HomeComponents'

interface BannerConfig {
  bannerText: string
  buttonText: string
  buttonLink: string
  variant: string
  isInExperiment: boolean
  cardName: string
  selectedCardIndex: number 
}

interface HomeBannerProps {
  onBannerCardSelected?: (selectedCardIndex: number) => void
}

export default function HomeBanner({ onBannerCardSelected }: HomeBannerProps): JSX.Element {
  const theme = useTheme()
  const isXs = useMediaQuery(theme.breakpoints.down('sm'))
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()
  
  const statsigClient = useStatsigClient()
  const experiment = useExperiment('home_page_top_card_cta_test')
  const isExperimentEnabled = useFeatureGate('home_page_top_card_test_enabled')
  const [bannerConfig, setBannerConfig] = useState<BannerConfig | null>(null)

  const updateCardStats = (action: 'view' | 'click', cardName: string) => {
    if (process.env.NODE_ENV === 'development') {
      const saved = localStorage.getItem('banner_card_stats')
      const stats = saved ? JSON.parse(saved) : {}
      
      if (!stats[cardName]) {
        stats[cardName] = { views: 0, clicks: 0 }
      }
      
      if (action === 'view') {
        stats[cardName].views++
      } else if (action === 'click') {
        stats[cardName].clicks++
      }
      
      localStorage.setItem('banner_card_stats', JSON.stringify(stats))
      
      const ctr = stats[cardName].views > 0 ? 
        ((stats[cardName].clicks / stats[cardName].views) * 100).toFixed(1) : '0.0'
      
      console.log(`📊 ${cardName} Performance: ${ctr}% CTR (${stats[cardName].clicks}/${stats[cardName].views})`)
    }
  }

  const trackBannerInteraction = (eventType: 'view' | 'click', bannerConfig: BannerConfig) => {
    const baseProperties = {
      experiment: bannerConfig.isInExperiment ? 'home_page_top_card_cta_test' : 'control',
      cardName: bannerConfig.cardName,
      selectedCardIndex: bannerConfig.selectedCardIndex,
      isRandomReplacement: bannerConfig.isInExperiment.toString(),
      timestamp: new Date().toISOString(),
      variant: bannerConfig.variant
    }

    if (eventType === 'view') {
      statsigClient.logEvent('home_banner_viewed', bannerConfig.variant, {
        ...baseProperties,
        bannerText: bannerConfig.bannerText
      })

      const cardEventName = `banner_view_${bannerConfig.cardName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`
      statsigClient.logEvent(cardEventName, bannerConfig.variant, baseProperties)

      updateCardStats('view', bannerConfig.cardName)
      
    } else if (eventType === 'click') {
      statsigClient.logEvent('home_banner_clicked', bannerConfig.variant, {
        ...baseProperties,
        buttonText: bannerConfig.buttonText,
        buttonLink: bannerConfig.buttonLink
      })

      const cardEventName = `banner_click_${bannerConfig.cardName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`
      statsigClient.logEvent(cardEventName, bannerConfig.variant, baseProperties)

      statsigClient.logEvent('cta_conversion_from_banner', bannerConfig.variant, {
        sourceCard: bannerConfig.cardName,
        destinationUrl: bannerConfig.buttonLink,
        experiment: bannerConfig.isInExperiment ? 'home_page_top_card_cta_test' : 'control'
      })

      updateCardStats('click', bannerConfig.cardName)
    }
  }

  useEffect(() => {
    if (isExperimentEnabled && EXPLORE_CARDS.length >= 4) {
      const variant = experiment.groupName || 'control'
      
      const availableCards = EXPLORE_CARDS.slice(1, 5) 
      const randomIndex = Math.floor(Math.random() * availableCards.length)
      const selectedCard = availableCards[randomIndex]
      const selectedCardIndex = randomIndex + 1 
      
      let bannerText = selectedCard.name
      let buttonText = 'Get Started'
      
      switch (selectedCard.name) {
        case 'Stake your SKL':
          buttonText = 'Start Staking'
          break
        case 'Play on Nebula':
          buttonText = 'Explore Games'
          break
        case "Explore SKALE's DeFi":
          buttonText = 'Explore DeFi'
          break
        case 'Swap on SKALE':
          buttonText = 'Start Swapping'
          break
        default:
          buttonText = 'Get Started'
      }
      
      setBannerConfig({
        bannerText,
        buttonText,
        buttonLink: selectedCard.url || '/bridge',
        variant,
        isInExperiment: true,
        cardName: selectedCard.name,
        selectedCardIndex
      })

      onBannerCardSelected?.(selectedCardIndex)

      statsigClient.logEvent('home_banner_experiment_exposed', variant, {
        experiment: 'home_page_top_card_cta_test',
        selectedCard: selectedCard.name,
        randomIndex: randomIndex.toString(),
        selectedCardIndex: selectedCardIndex.toString(),
        bannerText: bannerText,
        buttonText: buttonText,
        originalBannerText: 'Bridge to SKALE'
      })
    } else {
      setBannerConfig({
        bannerText: 'Bridge to SKALE',
        buttonText: 'Bridge Now',
        buttonLink: '/bridge',
        variant: 'control',
        isInExperiment: false,
        cardName: 'Bridge to SKALE',
        selectedCardIndex: 0 
      })

      onBannerCardSelected?.(0)
    }
  }, [isExperimentEnabled, experiment, statsigClient])

  useEffect(() => {
    if (bannerConfig) {
      statsigClient.logEvent('home_banner_viewed', bannerConfig.variant, {
        experiment: bannerConfig.isInExperiment ? 'home_page_top_card_cta_test' : 'control',
        cardName: bannerConfig.cardName,
        bannerText: bannerConfig.bannerText,
        isRandomReplacement: bannerConfig.isInExperiment.toString()
      })
    }
  }, [bannerConfig, statsigClient])

  const handleBannerClick = () => {
    if (!bannerConfig) return

    console.log('🎯 Banner Clicked!', {
      cardName: bannerConfig.cardName,
      buttonText: bannerConfig.buttonText,
      isExperiment: bannerConfig.isInExperiment,
      variant: bannerConfig.variant
    })

    statsigClient.logEvent('home_banner_clicked', bannerConfig.variant, {
      experiment: bannerConfig.isInExperiment ? 'home_page_top_card_cta_test' : 'control',
      cardName: bannerConfig.cardName,
      buttonText: bannerConfig.buttonText,
      buttonLink: bannerConfig.buttonLink,
      isRandomReplacement: bannerConfig.isInExperiment.toString()
    })

    statsigClient.logEvent('cta_conversion_from_banner', bannerConfig.variant, {
      sourceCard: bannerConfig.cardName,
      destinationUrl: bannerConfig.buttonLink,
      experiment: bannerConfig.isInExperiment ? 'home_page_top_card_cta_test' : 'control'
    })

    if (bannerConfig.buttonLink.startsWith('http')) {
      window.open(bannerConfig.buttonLink, '_blank')
    } else {
      navigate(bannerConfig.buttonLink)
    }
  }

  if (!bannerConfig) return <></>

  return (
    <div
      className={cls('home-banner', cmn.mtop10, cmn.flex, cmn.flexc, cmn.flexcv)}
      style={{ marginBottom: '24px' }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: isXs ? '15px' : '20px',
          padding: isMobile ? '20px 15px' : '30px 20px',
          textAlign: 'center'
        }}
      >
        <h1 className={cls('home-banner-title', cmn.pPrim, cmn.nom)}>{bannerConfig.bannerText}</h1>
        <Button
          size={isXs ? 'small' : 'medium'}
          variant="contained"
          color="primary"
          className={cls('btn', [isXs ? 'btnSm' : 'btnMd'])}
          fullWidth={isMobile}
          style={{ minWidth: isMobile ? 'auto' : '180px' }}
          onClick={handleBannerClick}
        >
          {bannerConfig.buttonText}
        </Button>
      </div>
    </div>
  )
}
