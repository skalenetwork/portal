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
 * @file urlParamsUtil.ts
 * @copyright SKALE Labs 2024-Present
 */

import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

export const useUrlParams = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const getCheckedItemsFromUrl = useCallback(() => {
    const categories = searchParams.get('categories')
    return categories ? categories.split(',') : []
  }, [searchParams])

  const setCheckedItemsInUrl = useCallback(
    (checkedItems: string[]) => {
      if (checkedItems.length > 0) {
        searchParams.set('categories', checkedItems.join(','))
      } else {
        searchParams.delete('categories')
      }
      setSearchParams(searchParams)
    },
    [searchParams, setSearchParams]
  )

  const getTabIndexFromUrl = () => {
    const params = new URLSearchParams(window.location.search)
    const tabIndex = params.get('tab')
    return tabIndex ? parseInt(tabIndex, 10) : 0
  }

  const setTabIndexInUrl = (tabIndex: number) => {
    const params = new URLSearchParams(window.location.search)
    params.set('tab', tabIndex.toString())
    window.history.replaceState({}, '', `${window.location.pathname}?${params}`)
  }

  return {
    getCheckedItemsFromUrl,
    setCheckedItemsInUrl,
    getTabIndexFromUrl,
    setTabIndexInUrl
  }
}
