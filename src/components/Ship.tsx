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
 * @file Ship.tsx
 * @copyright SKALE Labs 2024-Present
 */

import { cls, cmn } from '@skalenetwork/metaport'

const Ship: React.FC<{
  label: string
  icon?: React.ReactNode
  onClick?: () => void
  className?: string
}> = ({ label, icon, onClick, className }) => {
  return (
    <div
      className={cls('skShip', 'shipSm', className, cmn.flex, cmn.flexcv, cmn.pPrim, [
        'pointer',
        onClick !== undefined
      ])}
      onClick={onClick}
    >
      {icon && <div className={cls(cmn.mri5, cmn.flex)}>{icon}</div>}
      <p className={cls(cmn.p, cmn.p5)} style={{ whiteSpace: 'nowrap' }}>
        {label}
      </p>
    </div>
  )
}

export const ShipTrending: React.FC<{}> = ({}) => {
  return <Ship label="Trending" className={cls(cmn.mleft5, 'shipTrending', 'shipXs')} />
}

export const ShipNew: React.FC<{}> = ({}) => {
  return <Ship label="NEW" className={cls(cmn.mleft5, 'shipNewApp', 'shipXs')} />
}

export const ShipPreTge: React.FC<{}> = ({}) => {
  return <Ship label="Pre-TGE" className={cls(cmn.mleft5, 'shipPreTge', 'shipXs')} />
}

export default Ship
