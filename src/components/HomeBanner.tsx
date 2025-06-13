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
 * @file HomeBanner.tsx
 * @copyright SKALE Labs 2025-Present
 */

import { Button } from '@mui/material'
import { cmn, cls } from '@skalenetwork/metaport'
import { Link } from 'react-router-dom'

export default function HomeBanner(): JSX.Element {
  return (
    <div className={cls('home-banner', cmn.mtop20, cmn.mbott20, cmn.flex, cmn.flexc, cmn.flexcv)}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        <h1 className={cls('home-banner-title', cmn.p7, cmn.pPrim, cmn.nom)}>
          Bridge to SKALE
        </h1>
        <Link to="/bridge">
          <Button size="medium" variant="contained" className={cls('btn')}>
            Bridge Now
          </Button>
        </Link>
      </div>
    </div>
  )
}