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
import { Box } from '@mui/material'
import { ChevronLeft, ChevronRight } from 'lucide-react'

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
      <button
        onClick={scrollPrev}
        disabled={!prevBtnEnabled}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10 p-2 rounded-full bg-background/80 hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft className="text-foreground" size={17} />
      </button>
      <button
        onClick={scrollNext}
        disabled={!nextBtnEnabled}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10 p-2 rounded-full bg-background/80 hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight className="text-foreground" size={17} />
      </button>
    </Box>
  )
}

export default ScreenshotCarousel
