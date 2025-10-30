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
 * @file SubcategoryList.tsx
 * @copyright SKALE Labs 2024-Present
 */

import React from 'react'
import { FormControlLabel, Checkbox } from '@mui/material'
import { cls, cmn } from '@skalenetwork/metaport'
import { highlightMatch } from './SearchBar'

interface Subcategory {
  name: string
}

interface SubcategoryListProps {
  category: string
  subcategories: Record<string, Subcategory>
  checkedItems: string[]
  onCheck: (category: string, subcategory: string) => void
  searchTerm: string
}

const SubcategoryList: React.FC<SubcategoryListProps> = ({
  category,
  subcategories,
  checkedItems,
  onCheck,
  searchTerm
}) => (
  <div className="cmn.mleft20, cmn.fullWidth, cmn.mtop5">
    {Object.entries(subcategories).map(([shortName, subcategory]) => (
      <div
        key={`${category}_${shortName}`}
        className="cmn.flex, cmn.flexcv, cmn.fullWidth, cmn.mbott5"
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={checkedItems.includes(`${category}_${shortName}`)}
              onChange={() => {
                onCheck(category, shortName)
              }}
            />
          }
          label={
            <span className=" text-sm, text-xs00">
              {highlightMatch(subcategory.name, searchTerm)}
            </span>
          }
        />
      </div>
    ))}
  </div>
)

export default SubcategoryList
