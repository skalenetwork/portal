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
 * @file categoryUtils.tsx
 * @copyright SKALE Labs 2024-Present
 */

import { categories } from './categories'

export interface CheckedItems {
  [key: string]: boolean
}

export interface ExpandedItems {
  [key: string]: boolean
}

export const getSelectedSubcategoriesCount = (
  category: string,
  checkedItems: CheckedItems
): number => {
  const subcategories = categories[category].subcategories
  if (typeof subcategories === 'object' && !Array.isArray(subcategories)) {
    return Object.keys(subcategories).filter((subKey) => checkedItems[`${category}_${subKey}`])
      .length
  }
  return 0
}

export const getSelectedCategoriesCount = (checkedItems: CheckedItems): number => {
  return Object.keys(categories).filter(
    (category) =>
      checkedItems[category] ||
      Object.keys(checkedItems).some((key) => key.startsWith(`${category}_`))
  ).length
}

export const filterCategories = (searchTerm: string) => {
  return Object.entries(categories).filter(([_, data]) => {
    const categoryMatch = data.name.toLowerCase().includes(searchTerm.toLowerCase())
    const subcategoryMatch =
      typeof data.subcategories === 'object' &&
      !Array.isArray(data.subcategories) &&
      Object.values(data.subcategories).some((sub) =>
        sub.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    return categoryMatch || subcategoryMatch
  })
}
