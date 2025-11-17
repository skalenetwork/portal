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
 * @file SearchBar.tsx
 * @copyright SKALE Labs 2024-Present
 */

import React from 'react'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import Tooltip from '@mui/material/Tooltip'

interface SearchBarProps {
  searchTerm: string
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onClear: () => void
  className?: string
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  onClear,
  className
}) => (
  <div className={`flex items-center ${className || ''}`}>
    <TextField
      fullWidth
      className="skInput"
      placeholder="Search categories"
      value={searchTerm}
      onChange={onSearchChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon className="primary" />
          </InputAdornment>
        ),
        endAdornment: (
          <Tooltip title="Clear all" arrow>
            <IconButton onClick={onClear} size="small">
              <ClearIcon className="'primary" />
            </IconButton>
          </Tooltip>
        )
      }}
    />
  </div>
)

export const highlightMatch = (text: string, searchTerm: string): React.ReactNode => {
  if (!searchTerm) return text
  const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'))
  return parts.map((part, index) =>
    part.toLowerCase() === searchTerm.toLowerCase() ? (
      <span key={index} style={{ backgroundColor: '#008d4787' }}>
        {part}
      </span>
    ) : (
      part
    )
  )
}

export default SearchBar
