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
 * @file SkIconBth.tsx
 * @copyright SKALE Labs 2024-Present
 */

import React, { useState, useCallback } from 'react'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import Tooltip, { TooltipProps } from '@mui/material/Tooltip'
import { SvgIconProps } from '@mui/material/SvgIcon'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { cls } from '@skalenetwork/metaport'

type IconType = React.ComponentType<SvgIconProps>

interface SkIconBtnProps extends Omit<IconButtonProps, 'children'> {
  icon: IconType
  iconClassName?: string
  tooltipTitle?: React.ReactNode
  tooltipProps?: Partial<TooltipProps>
  primary?: boolean
}

const SkIconBtn: React.FC<SkIconBtnProps> = ({
  icon: Icon,
  onClick,
  className,
  iconClassName,
  size = 'medium',
  tooltipTitle,
  tooltipProps,
  primary = true,
  ...props
}) => {
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const handleTooltipToggle = useCallback(() => {
    if (isMobile) {
      setTooltipOpen((prevOpen) => !prevOpen)
    }
  }, [isMobile])

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (isMobile) {
        handleTooltipToggle()
      }
      if (onClick) {
        onClick(event)
      }
    },
    [isMobile, onClick, handleTooltipToggle]
  )

  const button = (
    <IconButton
      onClick={handleClick}
      className="styles.paperGrey, 'sk-icon-btn', `sk-icon-btn-${size}`, className"
      size={size}
      {...props}
    >
      <Icon
        className={cls(
          iconClassName,
          ['text-primary', primary],
          ['text-secondary', !primary],
          'sk-icon-btn-img'
        )}
      />
    </IconButton>
  )

  if (tooltipTitle) {
    return (
      <Tooltip
        title={tooltipTitle}
        {...tooltipProps}
        open={isMobile ? tooltipOpen : undefined}
        onClose={handleTooltipToggle}
        onOpen={handleTooltipToggle}
      >
        {button}
      </Tooltip>
    )
  }

  return button
}

export default SkIconBtn
