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
 * @file CategoryCard.tsx
 * @copyright SKALE Labs 2024-Present
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { cmn, cls, styles, SkPaper } from '@skalenetwork/metaport'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'

interface CategoryCardProps {
  categoryName: string
  fullName: string
  projectCount: number
}

const CategoryCard: React.FC<CategoryCardProps> = ({ categoryName, fullName, projectCount }) => {
  return (
    <Link to={`/ecosystem?categories=${categoryName}`}>
      <SkPaper gray className={cls('br__tile')}>
        <div className={cls(cmn.flex, cmn.flexcv, cmn.m10)}>
          <div className={cls(cmn.flexg)}>
            <div className={cls(cmn.flex, cmn.flexg, cmn.flexcv)}>
              <h4 className={cls(cmn.cap, cmn.nom, cmn.pPrim, cmn.p, cmn.p600, 'pOneLine')}>
                {fullName}
              </h4>
            </div>
            <p className={cls(cmn.p, cmn.p3, cmn.pSec, cmn.mtop5)}>
              {projectCount} project{projectCount !== 1 ? 's' : ''}
            </p>
          </div>
          <div className={cls(cmn.mleft10, cmn.mri5, cmn.flex, cmn.flexcv)}>
            <ArrowForwardRoundedIcon className={cls(cmn.pSec, styles.chainIconxs)} />
          </div>
        </div>
      </SkPaper>
    </Link>
  )
}

export default CategoryCard
