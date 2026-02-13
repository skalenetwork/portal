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
import { Search } from 'lucide-react'
import { useThemeMode, styles } from '@skalenetwork/metaport'

interface SearchBarProps {
  searchTerm: string
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange, className }) => {
  const { mode } = useThemeMode()

  return (
    <div className={`flex items-center ${className || ''}`}>
      <TextField
        fullWidth
        placeholder="Search categories"
        value={searchTerm}
        onChange={onSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search className="text-muted-foreground w-4! h-4!" />
            </InputAdornment>
          )
        }}
        className={`${styles.skInput} ${mode === 'light' && styles.skInputLight} bg-background! border border-border rounded-full`}
        sx={{
          '& .MuiOutlinedInput-root': { borderRadius: '50px' },
          '& fieldset': { border: 'none' }
        }}
      />
    </div>
  )
}

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
