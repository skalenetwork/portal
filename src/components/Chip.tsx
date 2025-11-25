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

const Chip: React.FC<{
  label: string
  icon?: React.ReactNode
  onClick?: () => void
  className?: string
}> = ({ label, icon, onClick, className }) => {
  return (
    <div
      className={`chipXs ${className || ''} flex items-center text-foreground bg-muted ${onClick !== undefined ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {icon && <div className="mr-1.5 flex">{icon}</div>}
      <p className="text-[8pt]" style={{ whiteSpace: 'nowrap' }}>
        {label}
      </p>
    </div>
  )
}

export const ChipTrending: React.FC<{ trending?: number }> = ({ trending }) => {
  return (
    <Chip
      label={trending ? `#${trending} on Trending` : 'Trending'}
      className="ml-1.5 chipTrending chipXs"
    />
  )
}

export const ChipMostLiked: React.FC<{}> = ({ }) => {
  return <Chip label="Most Liked" className="ml-1.5 chipMostLiked chipXs" />
}

export const ChipNew: React.FC<{}> = ({ }) => {
  return <Chip label="NEW" className="ml-1.5 chipNewApp chipXs" />
}

export const ChipFeatured: React.FC<{}> = ({ }) => {
  return <Chip label="Featured" className="ml-1.5 chipFeatured chipXs" />
}

export const ChipPreTge: React.FC<{}> = ({ }) => {
  return <Chip label="Pre-TGE" className="ml-1.5 chipPreTge chipXs" />
}

export default Chip
