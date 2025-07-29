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
import { Chip, Box } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { categories } from '../../core/ecosystem/categories'
import { type types, metadata } from '@/core'

interface SelectedCategoriesProps {
  checkedItems: string[]
  setCheckedItems: (items: string[]) => void
  selectedChains: string[]
  setSelectedChains: (chains: string[]) => void
  chainsMeta: types.ChainsMetadataMap
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
  selectedChains,
  setSelectedChains,
  chainsMeta,
  filteredAppsCount
}) => {
  const handleDelete = (itemToDelete: string) => {
    setCheckedItems(checkedItems.filter((item) => item !== itemToDelete))
  }

  const handleDeleteChain = (chainToDelete: string) => {
    setSelectedChains(selectedChains.filter((chain) => chain !== chainToDelete))
  }

  const clearAll = () => {
    setCheckedItems([])
    setSelectedChains([])
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

  const getChainDisplayName = (chainName: string): string => {
    return metadata.getAlias(chainsMeta, chainName) || chainName
  }

  if (checkedItems.length === 0 && selectedChains.length === 0) return null

  return (
    <Box className={cls(cmn.flex, cmn.flexcv, 'flex-w', cmn.mbottf10)}>
      {selectedChains.map((chain) => (
        <Chip
          variant="outlined"
          key={`chain-${chain}`}
          label={
            <Box display="flex" alignItems="center">
              <p className={cls(cmn.pPrim, cmn.p, cmn.p3, cmn.p600)}>
                {getChainDisplayName(chain)}
              </p>
            </Box>
          }
          onDelete={() => handleDeleteChain(chain)}
          deleteIcon={<CloseIcon className={cls(styles.chainIconxs)} />}
          className={cls('outlined', cmn.p600)}
        />
      ))}
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
      <p className={cls(cmn.p, cmn.p4, cmn.pPrim, cmn.mleft10, cmn.mri10)}>
        {filteredAppsCount} project{filteredAppsCount !== 1 ? 's' : ''}
      </p>
      <p
        className={cls(cmn.p, cmn.p500, cmn.p4, cmn.nop, cmn.nom, cmn.pSec, cmn.mleft20)}
        style={{ cursor: 'pointer' }}
        onClick={clearAll}
      >
        Clear all
      </p>
    </Box>
  )
}

export default SelectedCategories
