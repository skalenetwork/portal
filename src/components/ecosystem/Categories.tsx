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
 * @file Categories.tsx
 * @copyright SKALE Labs 2024-Present
 */

import React, { useState, useMemo, useRef } from 'react'
import { filterCategories } from '../../core/ecosystem/utils'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import Button from '@mui/material/Button'
import { type Category } from '../../core/ecosystem/categories'
import { useThemeMode } from '@skalenetwork/metaport'
import SearchBar, { highlightMatch } from './SearchBar'
import SubcategoryList from './SubcategoryList'
import { TextSearch, ChevronDown, ChevronUp, Circle } from 'lucide-react'

interface CategoryDisplayProps {
  checkedItems: string[]
  setCheckedItems: (items: string[]) => void
  isXs?: boolean
}

const CategoryDisplay: React.FC<CategoryDisplayProps> = ({
  checkedItems,
  setCheckedItems,
  isXs
}) => {
  const { mode } = useThemeMode()
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const buttonRef = useRef<HTMLButtonElement>(null)

  const filteredCategories = useMemo(() => filterCategories(searchTerm), [searchTerm])

  const handleCheck = (category: string, subcategory: string | null = null): void => {
    const newCheckedItems = [...checkedItems]
    const itemToToggle = subcategory ? `${category}_${subcategory}` : category

    if (newCheckedItems.includes(itemToToggle)) {
      const index = newCheckedItems.indexOf(itemToToggle)
      newCheckedItems.splice(index, 1)

      if (!subcategory) {
        setExpandedItems((prev) => ({ ...prev, [category]: false }))
      }
    } else {
      if (subcategory) {
        const mainCategoryIndex = newCheckedItems.indexOf(category)
        if (mainCategoryIndex !== -1) {
          newCheckedItems.splice(mainCategoryIndex, 1)
        }
        newCheckedItems.push(itemToToggle)
      } else {
        const subcategoriesToRemove = newCheckedItems.filter((item) =>
          item.startsWith(`${category}_`)
        )
        subcategoriesToRemove.forEach((item) => {
          const index = newCheckedItems.indexOf(item)
          if (index !== -1) {
            newCheckedItems.splice(index, 1)
          }
        })
        newCheckedItems.push(category)
        setExpandedItems((prev) => ({ ...prev, [category]: true }))
      }
    }

    setCheckedItems(newCheckedItems)
  }

  const toggleExpand = (category: string): void => {
    setExpandedItems((prev) => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = (): void => {
    setAnchorEl(null)
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value)
  }

  const handleClearSearch = (): void => {
    setSearchTerm('')
    setExpandedItems({})
  }

  const getSelectedSubcategoriesCount = (category: string): number => {
    return checkedItems.filter((item) => item.startsWith(`${category}_`)).length
  }

  const renderSubcategories = (shortName: string, data: Category): JSX.Element | null => {
    const subs = data.subcategories
    if (typeof subs !== 'object' || Array.isArray(subs) || !expandedItems[shortName]) {
      return null
    }

    const filteredSubs = Object.entries(subs).reduce(
      (acc, [key, value]) => {
        if (value.name.toLowerCase().includes(searchTerm.toLowerCase()) || searchTerm === '') {
          acc[key] = value
        }
        return acc
      },
      {} as Record<string, { name: string }>
    )

    if (Object.keys(filteredSubs).length === 0) {
      return null
    }

    return (
      <SubcategoryList
        key={`subcategories-${shortName}`}
        category={shortName}
        subcategories={filteredSubs}
        checkedItems={checkedItems}
        onCheck={handleCheck}
        searchTerm={searchTerm}
      />
    )
  }

  return (
    <div className={isXs ? 'w-full' : ''}>
      <Button
        variant="text"
        ref={buttonRef}
        onClick={handleMenuOpen}
        startIcon={<TextSearch />}
        className="btn btnMd tab text-foreground! text-xs ease-in-out transition-transform duration-150 active:scale-[0.97]"
        style={{ background: 'transparent' }}
      >
        Browse by categories
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        slotProps={{
          paper: {
            style: {
              maxHeight: 'calc(80vh - 100px)',
              width: buttonRef.current?.offsetWidth
            },
            className: `mt-2.5! overflow-visible rounded-3xl! ${mode === 'dark' ? 'bg-black! text-white!' : 'bg-white! text-foreground!'
              } shadow-sm! border-none! ring-0! [&_.MuiList-root]:p-0! ${mode === 'dark' ? '[&_.MuiList-root]:bg-black!' : '[&_.MuiList-root]:bg-white!'
              }`
          }
        }}
      >
        <div className="p-2.5">
          {isXs && (
            <Button className="btn w-full outlined mb-2.5" onClick={handleMenuClose}>
              Close
            </Button>
          )}
          <SearchBar
            className="mb-5"
            searchTerm={searchTerm}
            onSearchChange={handleSearch}
            onClear={handleClearSearch}
          />
          {filteredCategories.map(([shortName, data], index) => (
            <div
              key={shortName}
              className={`w-full mb-2.5 ${index !== filteredCategories.length - 1 ? 'divider' : ''}`}
            >
              <div className="flex items-center">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checkedItems.includes(shortName)}
                      onChange={() => handleCheck(shortName)}
                      sx={{
                        color: mode === 'dark' ? '#ffffff' : '#000000',
                        '&.Mui-checked': {
                          color: mode === 'dark' ? '#ffffff' : '#000000'
                        }
                      }}
                    />
                  }
                  label={
                    <span className={`text-sm font-semibold ${mode === 'dark' ? 'text-white' : 'text-black'}`}>
                      {highlightMatch(data.name, searchTerm)}
                    </span>
                  }
                  className="grow"
                />
                {getSelectedSubcategoriesCount(shortName) > 0 && (
                  <Circle fill="currentColor" size={8} className="text-primary" />
                )}
                {typeof data.subcategories === 'object' &&
                  !Array.isArray(data.subcategories) &&
                  Object.keys(data.subcategories).length > 0 && (
                    <IconButton
                      onClick={() => toggleExpand(shortName)}
                      size="small"
                      sx={{ color: mode === 'dark' ? '#ffffff' : '#000000' }}
                    >
                      {expandedItems[shortName] ? <ChevronUp /> : <ChevronDown />}
                    </IconButton>
                  )}
              </div>
              {renderSubcategories(shortName, data)}
            </div>
          ))}
        </div>
      </Menu>
    </div>
  )
}

export default CategoryDisplay
