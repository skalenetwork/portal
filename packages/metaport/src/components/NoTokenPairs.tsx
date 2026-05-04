/**
 * @license
 * SKALE Metaport
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * @file NoTokenPairs.tsx
 * @copyright SKALE Labs 2026-Present
 */

import { RouteOff } from 'lucide-react'
import SkPaper from './SkPaper'

export default function NoTokenPairs() {
  return (
    <SkPaper gray className="mt-3.5 p-6!">
      <div className="flex items-center">
        <span className="flex items-center justify-center w-[35px] h-[35px] rounded-full bg-orange-100 dark:bg-orange-400/15 shrink-0">
          <RouteOff size={14} className="text-orange-500 dark:text-orange-400" />
        </span>
        <span className="ml-3.5 grow">
          <p className="text-sm text-foreground font-medium m-0">No tokens available</p>
          <p className="text-xs text-secondary-foreground m-0">
            No token pairs between the selected chains
          </p>
        </span>
      </div>
    </SkPaper>
  )
}
