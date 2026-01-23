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
 * @file SkBtn.tsx
 * @copyright SKALE Labs 2024-Present
 */

import Button from '@mui/material/Button'

export default function SkBtn(props: {
  text: string
  disabled?: boolean
  onClick?: () => void
  loading?: boolean
  className?: string | undefined
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning' | undefined
  size?: 'sm' | 'md'
  variant?: 'contained' | 'outlined' | 'text'
  startIcon?: React.ReactNode
}) {
  const size = props.size ?? 'md'
  return (
    <Button
      color={props.color}
      variant={props.variant}
      className={`btn sm:btnSm bg-accent-foreground! disabled:bg-muted-foreground! text-accent! disabled:text-muted! w-full! ${props.className ?? ''}`}
      disabled={props.disabled || props.loading}
      onClick={props.onClick}
      startIcon={props.startIcon}
    >
      {props.loading ? props.text : props.text}
    </Button>
  )
}