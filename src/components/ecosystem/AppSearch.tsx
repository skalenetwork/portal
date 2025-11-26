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
 * @file AppSearch.tsx
 * @copyright SKALE Labs 2024-Present
 */

import React from 'react'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'

interface SearchComponentProps {
  searchTerm: string
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>
  className?: string
}

const SearchComponent: React.FC<SearchComponentProps> = ({
  searchTerm,
  setSearchTerm,
  className
}) => {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  return (
    <div className={className}>
      <TextField
        fullWidth
        placeholder="Search projects"
        value={searchTerm}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon className="text-primary chainIcons" />
            </InputAdornment>
          )
        }}
        className="skInput"
      />
    </div>
  )
}

export default SearchComponent
