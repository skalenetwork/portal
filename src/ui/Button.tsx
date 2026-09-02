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
 * @file Button.tsx
 * @copyright SKALE Labs 2026-Present
 */

import { Button as MuiButton, type ButtonProps } from '@mui/material'
import { cn } from '.'

const BASE =
  'normal-case! font-semibold! tracking-[0.02857em]! rounded-lg! shadow-none! disabled:text-foreground/70!'

const VARIANTS = {
  default: 'bg-primary! text-primary-foreground! hover:bg-primary/90! disabled:bg-primary/15!',
  secondary: 'bg-muted! text-foreground! hover:bg-muted/70!',
  outline: 'bg-transparent! text-foreground! border! border-border! hover:bg-muted!',
  ghost: 'bg-transparent! text-foreground! hover:bg-muted!',
  destructive: 'bg-destructive! text-white! hover:bg-destructive/90!'
} as const

const SIZES = {
  sm: 'text-[0.7025rem]! leading-[1.5]! px-[1.5em]! py-[0.5em]!',
  md: 'text-[0.8025rem]! leading-[2.5]! px-[2em]! py-[0.6em]!',
  lg: 'text-[0.8025rem]! leading-[1.6]! px-[3.5em]! py-[0.9em]!',
  icon: 'min-w-0! p-2!'
} as const

export type ButtonVariant = keyof typeof VARIANTS
export type ButtonSize = keyof typeof SIZES

export default function Button({
  variant = 'default',
  size = 'md',
  className,
  ...props
}: Omit<ButtonProps, 'variant' | 'size' | 'color'> & {
  variant?: ButtonVariant
  size?: ButtonSize
  href?: string
  target?: string
  rel?: string
}) {
  return (
    <MuiButton
      variant="text"
      disableElevation
      className={cn(BASE, VARIANTS[variant], SIZES[size], className)}
      {...props}
    />
  )
}
