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
 * @file UseScrollPosition.tsx
 * @copyright SKALE Labs 2025-Present
 */

import { useEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import { PATH_CONFIGS, type PathConfigsType } from './core/constants'

const scrollPositions = new Map<string, number>()

type PathConfig = {
  attempts: number[]
  priority: string
}

const getpathConfig = (path: string): PathConfig => {
  if (path in PATH_CONFIGS) {
    return PATH_CONFIGS[path as keyof PathConfigsType]
  }
  return { attempts: [0, 10, 50, 100], priority: 'normal' }
}

export default function useScrollPosition() {
  const location = useLocation()
  const navigationType = useNavigationType()
  const currentPath = location.pathname

  useEffect(() => {
    const handleScroll = () => {
      scrollPositions.set(currentPath, window.scrollY)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [currentPath])

  useEffect(() => {
    const config = getpathConfig(currentPath)
    let attemptsLeft = [...config.attempts]
    const savedPosition = scrollPositions.get(currentPath)

    const attemptScroll = () => {
      if (savedPosition !== undefined) {
        window.scrollTo({ top: savedPosition, behavior: 'instant' })
        return true
      }
      return false
    }

    if (config.priority === 'high') {
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          attemptScroll()
        })
      )
    }

    const scheduleAttempts = () => {
      attemptsLeft.forEach((delay) => {
        setTimeout(() => {
          attemptScroll()
        }, delay)
      })
    }
    scheduleAttempts()

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        attemptScroll()
        observer.disconnect()
      }
    })

    setTimeout(() => {
      document
        .querySelectorAll('.content-container, main, [role="main"], .app-content')
        .forEach((el) => {
          observer.observe(el)
        })
    }, 10)

    const mutationObserver = new MutationObserver(() => {
      attemptScroll()
    })

    setTimeout(() => {
      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
      })
      setTimeout(() => {
        mutationObserver.disconnect()
      }, 1000)
    }, 20)

    return () => {
      observer.disconnect()
      mutationObserver.disconnect()
    }
  }, [currentPath, navigationType])
}
