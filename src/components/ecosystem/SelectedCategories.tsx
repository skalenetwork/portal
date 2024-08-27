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
import { categories } from '../../core/ecosystem/categories'

interface SelectedCategoriesProps {
  checkedItems: string[]
  setCheckedItems: (items: string[]) => void
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
  const handleDelete = (itemToDelete: string) => {
    setCheckedItems(checkedItems.filter((item) => item !== itemToDelete))
  }

  const clearAll = () => {
    setCheckedItems([])
  }

  const getCategoryName = (key: string): string => categories[key]?.name || key

  const getSubcategoryName = (categoryKey: string, subcategoryKey: string): string => {
    const category = categories[categoryKey]
    if (
      category &&
      typeof category.subcategories === 'object' &&
      !Array.isArray(category.subcategories)
    ) {
      return category.subcategories[subcategoryKey]?.name || subcategoryKey
    }
    return subcategoryKey
  }

  if (checkedItems.length === 0) return null

  return (
    <Box className={cls(cmn.flex, cmn.flexcv, 'flex-w', cmn.mbottf10)}>
      {checkedItems.map((item) => {
        const [category, subcategory] = item.split('_')
        return (
          <Chip
            variant="outlined"
            key={item}
            label={
              <CustomChipLabel
                category={getCategoryName(category)}
                subcategory={subcategory ? getSubcategoryName(category, subcategory) : undefined}
              />
            }
            onDelete={() => handleDelete(item)}
            deleteIcon={<CloseIcon className={cls(styles.chainIconxs)} />}
            className={cls('outlined', cmn.p600)}
          />
        )
      })}
      <Typography className={cls(cmn.p, cmn.p4, cmn.pPrim, cmn.mleft10, cmn.mri10)}>
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
