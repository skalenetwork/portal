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
 * @file AppScreenshots.tsx
 * @copyright SKALE Labs 2024-Present
 */

import React, { useState, useEffect } from 'react'
import { cls, cmn, SkPaper } from '@skalenetwork/metaport'
import { constants } from '@/core'

import { Collapse } from '@mui/material'
import ExploreRoundedIcon from '@mui/icons-material/ExploreRounded'

import ScreenshotCarousel from './ScreenshotCarousel'
import AccordionSection from '../AccordionSection'

interface AppScreenshotsProps {
  chainName: string
  appName: string
  skaleNetwork: string
}

const AppScreenshots: React.FC<AppScreenshotsProps> = ({ chainName, appName, skaleNetwork }) => {
  const [screenshots, setScreenshots] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchScreenshots = async (): Promise<void> => {
    setLoading(true)
    setError(null)
    const screenshotUrls: string[] = []
    let index = 1

    const baseUrl = `${constants.BASE_METADATA_URL}/${skaleNetwork}/screenshots`

    while (true) {
      let found = false
      for (const ext of ['png', 'jpg']) {
        const url = `${baseUrl}/${chainName}-${appName}-${index}.${ext}`
        try {
          const response = await fetch(url, { method: 'HEAD' })
          if (response.ok) {
            screenshotUrls.push(url)
            found = true
            break
          }
        } catch (err) {
          console.error(`Error checking screenshot: ${url}`, err)
        }
      }
      if (!found) break
      index++
    }

    if (screenshotUrls.length === 0) {
      setError('No screenshots found for this app.')
    } else {
      setScreenshots(screenshotUrls)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchScreenshots()
  }, [chainName, appName, skaleNetwork])

  return (
    <Collapse in={!loading && !error}>
      <SkPaper gray className="cmn.mtop10, 'fwmobile'">
        <AccordionSection
          expandedByDefault
          title="Explore project"
          icon={<ExploreRoundedIcon />}
          marg={false}
        >
          <ScreenshotCarousel screenshots={screenshots} appName={appName} />
        </AccordionSection>
      </SkPaper>
    </Collapse>
  )
}

export default AppScreenshots
