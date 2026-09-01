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
 * @file ThemeProvider.tsx
 * @copyright SKALE Labs 2021-Present
 */

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type ThemeMode = 'light' | 'dark'

type ThemeContextValue = {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
  toggleMode: () => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

type ThemeProviderProps = {
  children: React.ReactNode
}

const STORAGE_KEY = 'skale:theme'

function getPreferredMode(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'dark'
  }

  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') {
    return stored
  }

  return 'light'
}

function applyModeToDocument(mode: ThemeMode) {
  if (typeof document === 'undefined') {
    return
  }

  const root = document.documentElement
  if (mode === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

export function ThemeProvider(props: ThemeProviderProps) {
  const [mode, setModeState] = useState<ThemeMode>(() => getPreferredMode())

  useEffect(() => {
    applyModeToDocument(mode)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, mode)
    }
  }, [mode])

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      setMode: setModeState,
      toggleMode: () => setModeState((current) => (current === 'dark' ? 'light' : 'dark'))
    }),
    [mode]
  )

  return <ThemeContext.Provider value={value}>{props.children}</ThemeContext.Provider>
}

export function useThemeMode() {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useThemeMode must be used within ThemeProvider')
  }
  return ctx
}
