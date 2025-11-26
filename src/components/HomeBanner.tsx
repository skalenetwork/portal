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
import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

export default function HomeBanner() {
  return (
    <div className="home-banner mt-2.5 mb-4! flex flex-col items-center">
      <div className="home-banner-inner flex h-full flex-col items-center justify-start gap-2 px-4 pt-10 text-center sm:gap-3 sm:px-5 sm:pt-12 md:pt-16">
        <h1 className="home-banner-title text-foreground m-0">Bridge to SKALE</h1>
        <p className="text-sm text-secondary-foreground font-medium m-0">
          Blazingly fast transfers, free between SKALE Chains
        </p>
        <Link to="/bridge">
          <Button
            size="medium"
            variant="contained"
            color="primary"
            className="btn mt-3! w-full px-10! bg-accent-foreground! text-accent! text-sm! ease-in-out transition-transform duration-150 active:scale-[0.97]"
            startIcon={<Sparkles size={18} />}
          >
            Bridge Now
          </Button>
        </Link>
      </div>
    </div>
  )
}
