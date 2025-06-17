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
 * @file Chip.tsx
 * @copyright SKALE Labs 2024-Present
 */

import { cls, cmn } from '@skalenetwork/metaport'

const Chip: React.FC<{
  label: string
  icon?: React.ReactNode
  onClick?: () => void
  className?: string
}> = ({ label, icon, onClick, className }) => {
  return (
    <div
      className={cls('skChip', 'chipSm', className, cmn.flex, cmn.flexcv, cmn.pPrim, [
        'pointer',
        onClick !== undefined
      ])}
      onClick={onClick}
    >
      {icon && <div className={cls(cmn.mri5, cmn.flex)}>{icon}</div>}
      <p className={cls(cmn.p, cmn.p5)} style={{ whiteSpace: 'nowrap' }}>
        {label}
      </p>
    </div>
  )
}

export const ChipTrending: React.FC<{ trending?: number }> = ({ trending }) => {
  return (
    <Chip
      label={trending ? `#${trending} on Trending` : 'Trending'}
      className={cls(cmn.mleft5, 'chipTrending', 'chipXs')}
    />
  )
}

export const ChipMostLiked: React.FC<{}> = ({}) => {
  return <Chip label="Most Liked" className={cls(cmn.mleft5, 'chipMostLiked', 'chipXs')} />
}

export const ChipNew: React.FC<{}> = ({}) => {
  return <Chip label="NEW" className={cls(cmn.mleft5, 'chipNewApp', 'chipXs')} />
}

export const ChipFeatured: React.FC<{}> = ({}) => {
   return <Chip label="Featured" className={cls(cmn.mleft5, 'chipFeatured', 'chipXs')} />
 }

export const ChipPreTge: React.FC<{}> = ({}) => {
  return <Chip label="Pre-TGE" className={cls(cmn.mleft5, 'chipPreTge', 'chipXs')} />
}

export default Chip
