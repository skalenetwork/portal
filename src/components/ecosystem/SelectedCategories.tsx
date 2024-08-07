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
 * @file SelectedCategories.tsx
 * @copyright SKALE Labs 2024-Present
 */

import React from 'react'
import { cmn, cls, styles } from '@skalenetwork/metaport'

import { Chip, Typography, Box } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { CheckedItems } from '../../core/ecosystem/categoryUtils'
import { categories, Category, Subcategory } from '../../core/ecosystem/categories'

interface SelectedCategoriesProps {
  checkedItems: CheckedItems
  setCheckedItems: React.Dispatch<React.SetStateAction<CheckedItems>>
  filteredAppsCount: number
}

const CustomChipLabel: React.FC<{ category: string; subcategory?: string }> = ({
  category,
  subcategory
}) => (
  <Box display="flex" alignItems="center">
    <p
      className={cls([cmn.pSec, subcategory], [cmn.pPrim, !subcategory], cmn.p, cmn.p3, [
        cmn.p600,
        !subcategory
      ])}
    >
      {category}
    </p>
    {subcategory && (
      <>
        <Box component="span" className="borderLeft" sx={{ height: '1em', mx: 0.75 }} />
        <p className={cls(cmn.pPrim, cmn.p, cmn.p3, cmn.p600)}>{subcategory}</p>
      </>
    )}
  </Box>
)

const SelectedCategories: React.FC<SelectedCategoriesProps> = ({
  checkedItems,
  setCheckedItems,
  filteredAppsCount
}) => {
  const handleDelete = (category: string, fullSubcategory?: string) => {
    setCheckedItems((prev) => {
      const newCheckedItems = { ...prev }
      if (fullSubcategory) {
        delete newCheckedItems[fullSubcategory]
      } else {
        Object.keys(newCheckedItems).forEach((key) => {
          if (key.startsWith(`${category}_`)) {
            delete newCheckedItems[key]
          }
        })
        delete newCheckedItems[category]
      }
      return newCheckedItems
    })
  }

  const clearAll = () => {
    setCheckedItems({})
  }

  const getCategoryName = (key: string): string => categories[key]?.name || key

  const getSubcategoryName = (categoryKey: string, subcategoryKey: string): string => {
    const category = categories[categoryKey] as Category
    if (category && 'subcategories' in category) {
      const subcategories = category.subcategories as { [key: string]: Subcategory }
      return subcategories[subcategoryKey]?.name || subcategoryKey
    }
    return subcategoryKey
  }

  const selectedItems = Object.entries(checkedItems).filter(([_, value]) => value)

  if (selectedItems.length === 0) return

  return (
    <Box className={cls(cmn.flex, cmn.flexcv, cmn.mbottf10)}>
      {selectedItems.map(([key, _]) => {
        const [category, subcategory] = key.split('_')
        return (
          <Chip
            variant="outlined"
            key={key}
            label={
              <CustomChipLabel
                category={getCategoryName(category)}
                subcategory={subcategory ? getSubcategoryName(category, subcategory) : undefined}
              />
            }
            onDelete={() => handleDelete(category, key)}
            deleteIcon={<CloseIcon className={cls(styles.chainIconxs)} />}
            className={cls(cmn.mri10, 'outlined', cmn.p600)}
          />
        )
      })}
      <Typography className={cls(cmn.p, cmn.p4, cmn.pPrim, cmn.mleft10, cmn.mri20)}>
        {filteredAppsCount} project{filteredAppsCount !== 1 ? 's' : ''}
      </Typography>
      <Typography
        variant="body2"
        className={cls(cmn.p, cmn.p500, cmn.p4, cmn.nop, cmn.nom, cmn.pSec, cmn.mleft20)}
        style={{ cursor: 'pointer' }}
        onClick={clearAll}
      >
        Clear all
      </Typography>
    </Box>
  )
}

export default SelectedCategories
