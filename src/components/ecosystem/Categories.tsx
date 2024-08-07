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

import React, { useState, useMemo, useRef, useEffect } from 'react'
import { cmn, cls } from '@skalenetwork/metaport'

import {
  type CheckedItems,
  type ExpandedItems,
  getSelectedSubcategoriesCount,
  filterCategories
} from '../../core/ecosystem/categoryUtils'

import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import Menu from '@mui/material/Menu'
import Button from '@mui/material/Button'
import ManageSearchRoundedIcon from '@mui/icons-material/ManageSearchRounded'
import { categories, type Category } from '../../core/ecosystem/categories'

import SearchBar, { highlightMatch } from './SearchBar'
import SubcategoryList from './SubcategoryList'

interface CategoryDisplayProps {
  checkedItems: CheckedItems
  setCheckedItems: React.Dispatch<React.SetStateAction<CheckedItems>>
}

const CategoryDisplay: React.FC<CategoryDisplayProps> = ({ checkedItems, setCheckedItems }) => {
  const [expandedItems, setExpandedItems] = useState<ExpandedItems>({})
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [buttonWidth, setButtonWidth] = useState<number | undefined>(undefined)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (buttonRef.current != null) {
      setButtonWidth(buttonRef.current.offsetWidth)
    }
  }, [])

  useEffect(() => {
    Object.entries(categories).forEach(([category, data]) => {
      const subs = data.subcategories
      if (typeof subs === 'object' && !Array.isArray(subs)) {
        const subcategoryKeys = Object.keys(subs)
        const checkedSubcategories = subcategoryKeys.filter(
          (sub) => checkedItems[`${category}_${sub}`]
        )

        if (checkedSubcategories.length > 0) {
          setCheckedItems((prev) => {
            const newState = { ...prev }
            delete newState[category]
            return newState
          })
        }
      }
    })
  }, [checkedItems, setCheckedItems])

  const handleCheck = (category: string, subcategory: string | null = null): void => {
    setCheckedItems((prev) => {
      const newState = { ...prev }
      if (subcategory != null) {
        const key = `${category}_${subcategory}`
        newState[key] = !prev[key]
        if (!newState[key]) delete newState[key]
        delete newState[category]
      } else {
        setExpandedItems((prev) => ({ ...prev, [category]: true }))
        if (newState[category]) {
          delete newState[category]
        } else {
          newState[category] = true
          const subs = categories[category].subcategories
          if (typeof subs === 'object' && !Array.isArray(subs)) {
            Object.keys(subs).forEach((subKey) => {
              delete newState[`${category}_${subKey}`]
            })
          }
        }
      }
      return newState
    })
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
    const newSearchTerm = event.target.value
    setSearchTerm(newSearchTerm)

    const newExpandedItems = { ...expandedItems }
    Object.entries(categories).forEach(([shortName, data]) => {
      const subs = data.subcategories
      if (typeof subs === 'object' && !Array.isArray(subs)) {
        const hasMatchingSubcategory = Object.values(subs).some((sub) =>
          sub.name.toLowerCase().includes(newSearchTerm.toLowerCase())
        )
        const categoryMatches = data.name.toLowerCase().includes(newSearchTerm.toLowerCase())

        newExpandedItems[shortName] =
          hasMatchingSubcategory || (categoryMatches && newSearchTerm !== '')
      }
    })
    setExpandedItems(newExpandedItems)
  }

  const handleClearSearch = (): void => {
    setSearchTerm('')
    setExpandedItems({})
  }

  const filteredCategories = useMemo(() => filterCategories(searchTerm), [searchTerm])

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
    <div>
      <Button
        variant="text"
        ref={buttonRef}
        onClick={handleMenuOpen}
        startIcon={<ManageSearchRoundedIcon />}
        className={cls('outlined', 'skMenuBtn', 'btn', cmn.pPrim)}
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
            maxHeight: '500pt',
            width: buttonWidth,
            borderRadius: '25px',
            margin: '10px 0'
          }
        }}
      >
        <div className={cls(cmn.padd10)}>
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
                      checked={Boolean(checkedItems[shortName])}
                      onChange={() => {
                        handleCheck(shortName)
                      }}
                    />
                  }
                  label={
                    <span className={cls(cmn.p, cmn.p2, cmn.p600)}>
                      {highlightMatch(data.name, searchTerm)}
                    </span>
                  }
                  className={cls(cmn.flexg)}
                />
                {getSelectedSubcategoriesCount(shortName, checkedItems) > 0 && (
                  <FiberManualRecordIcon color="primary" style={{ fontSize: '8pt' }} />
                )}
                {typeof data.subcategories === 'object' &&
                  !Array.isArray(data.subcategories) &&
                  Object.keys(data.subcategories).length > 0 && (
                    <IconButton
                      onClick={() => {
                        toggleExpand(shortName)
                      }}
                      size="small"
                    >
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
