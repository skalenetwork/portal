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
 * @file Carousel.tsx
 * @copyright SKALE Labs 2024-Present
 */

import React, { useState, ReactNode } from 'react'
import { Box, IconButton, useTheme, useMediaQuery } from '@mui/material'

import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded'
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded'

interface CarouselProps {
  children: ReactNode[]
  showArrows?: boolean
  className?: string
}

const Carousel: React.FC<CarouselProps> = ({ children, showArrows = true, className }) => {
  const [startIndex, setStartIndex] = useState(0)
  const theme = useTheme()
  const isXs = useMediaQuery(theme.breakpoints.only('xs'))
  const isSm = useMediaQuery(theme.breakpoints.only('sm'))
  const isMd = useMediaQuery(theme.breakpoints.only('md'))

  let itemsToShow = 3 // Default for lg and up
  if (isXs) {
    itemsToShow = 1
  } else if (isSm) {
    itemsToShow = 2
  } else if (isMd) {
    itemsToShow = 3
  }

  const handlePrev = () => {
    setStartIndex((prevIndex) => Math.max(0, prevIndex - 1))
  }

  const handleNext = () => {
    setStartIndex((prevIndex) => Math.min(children.length - itemsToShow, prevIndex + 1))
  }

  const visibleChildren = children.slice(startIndex, startIndex + itemsToShow)

  const prevDisabled = startIndex === 0
  const nextDisabled = startIndex >= children.length - itemsToShow

  return (
    <Box sx={{ position: 'relative' }} className={className}>
      <Box
        sx={{
          display: 'flex',
          gap: theme.spacing(2),
          overflow: 'hidden'
        }}
      >
        {visibleChildren.map((child, index) => (
          <Box
            key={index}
            sx={{
              flexShrink: 0,
              width: {
                xs: '100%',
                sm: 'calc(50% - 8px)',
                md: 'calc(33.333% - 10.667px)',
                lg: 'calc(33.333% - 10.667px)'
              }
            }}
          >
            {child}
          </Box>
        ))}
      </Box>
      {showArrows && children.length > itemsToShow && (
        <Box className="mt-2.5 skArrows">
          <IconButton
            onClick={handlePrev}
            disabled={prevDisabled}
            size="small"
            className="ml-1.5 bg-card! disabled:bg-transparent!"
          >
            <ArrowBackIosRoundedIcon className="text-secondary-foreground!" />
          </IconButton>
          <IconButton
            onClick={handleNext}
            disabled={nextDisabled}
            size="small"
            className="ml-1.5 bg-card! disabled:bg-transparent!"
          >
            <ArrowForwardIosRoundedIcon className="text-secondary-foreground!" />
          </IconButton>
        </Box>
      )}
    </Box>
  )
}

export default Carousel
