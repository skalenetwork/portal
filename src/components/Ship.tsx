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
}> = ({ label, icon, onClick }) => {
  return (
    <div
      className={cls('skShip', 'shipSm', cmn.flex, cmn.flexcv, cmn.pPrim, [
        'pointer',
        onClick !== undefined
      ])}
      onClick={onClick}
    >
      {icon && <div className={cls(cmn.mri5, cmn.flex)}>{icon}</div>}
      <p className={cls(cmn.p, cmn.p5)}>{label}</p>
    </div>
  )
}

export default Ship
