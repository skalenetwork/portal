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
import LoadingButton from '@mui/lab/LoadingButton'

import { cls } from '@skalenetwork/metaport'

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
  return props.loading ? (
    <LoadingButton
      color={props.color}
      loading
      loadingPosition="start"
      size="small"
      variant={props.variant}
      className={cls(
        'btn',
        ['btnSm', size === 'sm'],
        ['btnSmLoading', size === 'sm'],
        props.className
      )}
    >
      {props.text}
    </LoadingButton>
  ) : (
    <Button
      color={props.color}
      variant={props.variant}
      className={cls('btn', 'btn' + props.color, props.className, ['btnSm', size === 'sm'])}
      disabled={props.disabled}
      onClick={props.onClick}
      startIcon={props.startIcon}
    >
      {props.text}
    </Button>
  )
}
