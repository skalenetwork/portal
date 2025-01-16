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
 * @file ChainLogo.tsx
 * @copyright SKALE Labs 2022-Present
 */

import { useEffect, useState } from 'react'
import { metadata, type types } from '@/core'
import Jazzicon from 'react-jazzicon'

function hashCode(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return hash
}

function getPseudoRandomNumber(
  seed: string,
  min: number = 1000000000,
  max: number = 100000000000000
): number {
  const seedValue = hashCode(seed)
  const range = max - min
  const rng = Math.sin(seedValue) * 10000
  const randomInt = min + Math.floor((rng - Math.floor(rng)) * range)
  return randomInt
}

export default function ChainLogo(props: {
  network: types.SkaleNetwork
  chainName: string
  app?: string
  className?: string
  logos: any
}) {
  let logoName = props.chainName
  if (props.app) {
    logoName += `-${props.app}`
  }
  const baseLocalPath = logoName
    .replace(/^(_+)/, '$1')
    .replace(/-([a-z0-9])/gi, (_, g) => g.toUpperCase())

  const [url, setUrl] = useState<any | null>(props.logos[baseLocalPath])

  useEffect(() => {
    loadLogo()
  }, [])

  async function checkUrl(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: 'GET' })
      return response.status === 200
    } catch (error) {
      console.error(`Error checking URL: ${url}`, error)
      return false
    }
  }

  async function loadLogo() {
    if (url) return
    const baseUrl = metadata.getMetaLogoUrl(props.network, logoName)
    const pngPath = baseUrl + '.png'
    const svgPath = baseUrl + '.svg'
    if (await checkUrl(pngPath)) {
      setUrl(pngPath)
      return
    } else if (await checkUrl(svgPath)) {
      setUrl(svgPath)
      return
    }
  }

  if (url) {
    return <img className={props.className} src={url.default ? url.default : url} />
  }
  return (
    <div className="br__tileDefaultLogo">
      <Jazzicon
        diameter={55}
        svgStyles={{
          width: '100%',
          height: '100%'
        }}
        seed={getPseudoRandomNumber(props.chainName + props.app)}
      />
    </div>
  )
}
