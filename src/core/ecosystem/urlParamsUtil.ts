

import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

export const useUrlParams = (): {
  getCheckedItemsFromUrl: () => string[]
  setCheckedItemsInUrl: (checkedItems: string[]) => void
  getTabIndexFromUrl: () => number
  setTabIndexInUrl: (tabIndex: number) => void
  getSearchTermFromUrl: () => string
  setSearchTermInUrl: (searchTerm: string) => void
} => {
  const [searchParams, setSearchParams] = useSearchParams()

  const getCheckedItemsFromUrl = useCallback((): string[] => {
    const categories = searchParams.get('categories')
    return categories !== null ? categories.split(',') : []
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

  const getTabIndexFromUrl = useCallback((): number => {
    const tabIndex = searchParams.get('tab')
    return tabIndex !== null ? parseInt(tabIndex, 10) : 0
  }, [searchParams])

  const setTabIndexInUrl = useCallback(
    (tabIndex: number) => {
      searchParams.set('tab', tabIndex.toString())
      setSearchParams(searchParams)
    },
    [searchParams, setSearchParams]
  )

  const getSearchTermFromUrl = useCallback((): string => {
    const searchTerm = searchParams.get('search')
    return searchTerm ?? ''
  }, [searchParams])

  const setSearchTermInUrl = useCallback(
    (searchTerm: string) => {
      if (searchTerm.trim() !== '') {
        searchParams.set('search', searchTerm.trim())
      } else {
        searchParams.delete('search')
      }
      setSearchParams(searchParams)
    },
    [searchParams, setSearchParams]
  )

  return {
    getCheckedItemsFromUrl,
    setCheckedItemsInUrl,
    getTabIndexFromUrl,
    setTabIndexInUrl,
    getSearchTermFromUrl,
    setSearchTermInUrl
  }
}
