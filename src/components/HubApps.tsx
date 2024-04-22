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
 * @file HubApps.tsx
 * @copyright SKALE Labs 2024-Present
 */

import { useState, useEffect } from 'react'
import { cmn, cls, type interfaces, ChainIcon } from '@skalenetwork/metaport'

export default function HubApps(props: {
  skaleNetwork: interfaces.SkaleNetwork
  meta: interfaces.ChainMetadata
  chainName: string
}) {
  if (props.meta.apps === undefined) return

  const [appNames, setAppNames] = useState<string[]>([])

  useEffect(() => {
    if (!props.meta.apps) return
    setAppNames(Object.keys(props.meta.apps).sort(() => 0.5 - Math.random()))
    const intervalId = setInterval(() => {
      if (!props.meta.apps) return
      setAppNames(Object.keys(props.meta.apps).sort(() => 0.5 - Math.random()))
    }, 3000)
    return () => {
      clearInterval(intervalId) // Clear interval on component unmount
    }
  }, [])

  return (
    <div
      className={cls(cmn.flex, cmn.flexcv, cmn.mtop10, cmn.mri10)}
      style={{ position: 'absolute', display: 'flex', justifyContent: 'end', width: '100%' }}
    >
      <div className={cls('appIconHub', cmn.flex, cmn.flexcv)}>
        {appNames.slice(0, 2).map((appName: string) => (
          <div className={cls(cmn.flex, cmn.mri5)}>
            <ChainIcon
              skaleNetwork={props.skaleNetwork}
              chainName={props.chainName}
              app={appName}
              size="xs"
            />
          </div>
        ))}
        <p className={cls(cmn.nom, cmn.p, cmn.p5)}>
          {appNames.length === 1 ? props.meta.apps![appNames[0]].alias : `${appNames.length}+ apps`}
        </p>
      </div>
    </div>
  )
}
