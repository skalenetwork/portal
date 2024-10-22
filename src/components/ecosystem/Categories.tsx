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
import { cmn, cls } from '@skalenetwork/metaport'
import { filterCategories } from '../../core/ecosystem/utils'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import Menu from '@mui/material/Menu'
import Button from '@mui/material/Button'
import ManageSearchRoundedIcon from '@mui/icons-material/ManageSearchRounded'
import { type Category } from '../../core/ecosystem/categories'
import SearchBar, { highlightMatch } from './SearchBar'
import SubcategoryList from './SubcategoryList'

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
    <div className={cls(['fullW', isXs])}>
      <Button
        variant="text"
        ref={buttonRef}
        onClick={handleMenuOpen}
        startIcon={<ManageSearchRoundedIcon />}
        className={cls('outlined', 'skMenuBtn', 'btn', cmn.pPrim, ['fullW', isXs])}
        style={{ background: 'transparent' }}
      >
        Browse by categories
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        className="skMenu outlined"
        PaperProps={{
          style: {
            maxHeight: 'calc(80vh - 100px)',
            width: buttonRef.current?.offsetWidth,
            borderRadius: '25px',
            margin: '10px 0'
          }
        }}
      >
        <div className={cls(cmn.padd10)}>
          {isXs && (
            <Button className={cls('btn fullW outlined', cmn.mbott10)} onClick={handleMenuClose}>
              Close
            </Button>
          )}
          <SearchBar
            className={cls(cmn.mbott10)}
            searchTerm={searchTerm}
            onSearchChange={handleSearch}
            onClear={handleClearSearch}
          />
          {filteredCategories.map(([shortName, data], index) => (
            <div
              key={shortName}
              className={cls(
                cmn.fullWidth,
                cmn.mbott10,
                index !== filteredCategories.length - 1 && 'divider'
              )}
            >
              <div className={cls(cmn.flex, cmn.flexcv)}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checkedItems.includes(shortName)}
                      onChange={() => handleCheck(shortName)}
                    />
                  }
                  label={
                    <span className={cls(cmn.p, cmn.p3, cmn.p600)}>
                      {highlightMatch(data.name, searchTerm)}
                    </span>
                  }
                  className={cls(cmn.flexg)}
                />
                {getSelectedSubcategoriesCount(shortName) > 0 && (
                  <FiberManualRecordIcon color="primary" style={{ fontSize: '8pt' }} />
                )}
                {typeof data.subcategories === 'object' &&
                  !Array.isArray(data.subcategories) &&
                  Object.keys(data.subcategories).length > 0 && (
                    <IconButton onClick={() => toggleExpand(shortName)} size="small">
                      {expandedItems[shortName] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
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
