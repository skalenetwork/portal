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
 * @file SortToggle.tsx
 * @copyright SKALE Labs 2024-Present
 */

import { useState } from 'react'
import { ToggleButtonGroup, ToggleButton } from '@mui/material'
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded'
import ContrastRoundedIcon from '@mui/icons-material/ContrastRounded'
import { ArrowDown10, IdCard } from 'lucide-react'

interface SortToggleProps {
  onChange: (sort: 'id' | 'status') => void
  className?: string
}

const SortToggle: React.FC<SortToggleProps> = ({ onChange, className }) => {
  const [sortBy, setSortBy] = useState<'id' | 'status'>('id')

  const handleChange = (_: React.MouseEvent<HTMLElement>, newSort: 'id' | 'status') => {
    if (newSort !== null) {
      setSortBy(newSort)
      onChange(newSort)
    }
  }

  return (
    <ToggleButtonGroup
      value={sortBy}
      exclusive
      onChange={handleChange}
      aria-label="delegation sort"
      className={`${className} bg-background! rounded-full! p-1! w-fit`}
      size="small"
    >
      <ToggleButton
        value="id"
        aria-label="sort by id"
        className={`capitalize! text-xs ${sortBy === 'id' ? 'text-foreground! bg-foreground/10! shadow-xs!' : 'text-muted-foreground!'}`}
      >
        <IdCard size={14} className="mr-1.5" />
        Sort by ID
      </ToggleButton>
      <ToggleButton
        value="status"
        aria-label="sort by status"
        className={`capitalize! text-xs ${sortBy === 'status' ? 'text-foreground! bg-foreground/10! shadow-xs!' : 'text-muted-foreground!'}`}
      >
        <ArrowDown10 size={14} className="mr-1.5" />
        Sort by Status
      </ToggleButton>
    </ToggleButtonGroup>
  )
}

export default SortToggle
