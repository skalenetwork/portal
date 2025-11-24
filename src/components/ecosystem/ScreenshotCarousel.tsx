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
 * @file ScreenshotCarousel.tsx
 * @copyright SKALE Labs 2024-Present
 */

import React, { useState, useEffect, useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { Box, IconButton } from '@mui/material'
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded'
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded'

type PropType = {
  screenshots: string[]
  appName: string
}

const ScreenshotCarousel: React.FC<PropType> = ({ screenshots, appName }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: false,
    dragFree: true
  })

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false)
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false)

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setPrevBtnEnabled(emblaApi.canScrollPrev())
    setNextBtnEnabled(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
  }, [emblaApi, onSelect])

  return (
    <Box position="relative" className="mt-2.5">
      <Box className="embla" ref={emblaRef} sx={{ overflow: 'hidden' }}>
        <Box className="embla__container" display="flex" height={400}>
          {screenshots.map((screenshot, index) => (
            <Box
              key={index}
              className="embla__slide"
              flex="0 0 auto"
              marginRight="10px"
              height="100%"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <img
                src={screenshot}
                alt={`${appName} screenshot ${index + 1}`}
                style={{
                  height: '100%',
                  width: 'auto',
                  maxWidth: 'none',
                  objectFit: 'cover',
                  borderRadius: '25px'
                }}
              />
            </Box>
          ))}
        </Box>
      </Box>
      <IconButton
        onClick={scrollPrev}
        disabled={!prevBtnEnabled}
        className="filled"
        size="small"
        sx={{
          position: 'absolute',
          top: '50%',
          left: '15px',
          transform: 'translateY(-50%)',
          zIndex: 1
        }}
      >
        <ArrowBackIosNewRoundedIcon className="text-secondary-foreground styles.chainIconxs" />
      </IconButton>
      <IconButton
        onClick={scrollNext}
        disabled={!nextBtnEnabled}
        className="filled"
        size="small"
        sx={{
          position: 'absolute',
          top: '50%',
          right: '15px',
          transform: 'translateY(-50%)',
          zIndex: 1
        }}
      >
        <ArrowForwardIosRoundedIcon className="text-secondary-foreground styles.chainIconxs" />
      </IconButton>
    </Box>
  )
}

export default ScreenshotCarousel
