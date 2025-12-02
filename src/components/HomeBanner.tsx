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
import { Badge, Sparkles } from 'lucide-react'
import Avatar from 'boring-avatars'
import { HOME_CARD_COLORS } from '../core/constants'

import MoneyIcon from '../icons/arrows.svg'
import { networks, types } from '@/core'
import { EXPLORE_CARDS } from './HomeComponents'

function HomeBanner1() {
  return (
    <div className="home-banner mt-2.5 mb-4! flex flex-col items-center">
      <div className="home-banner-inner flex h-full flex-col items-center justify-start gap-2 px-4 pt-10 text-center sm:gap-2 sm:px-5 sm:pt-12 md:pt-16">
        <h1 className="font-bold text-foreground m-0!">Bridge to SKALE</h1>
        <p className="text-sm text-secondary-foreground font-medium m-0!">
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

export default function HomeBanner(props: { skaleNetwork: types.SkaleNetwork }) {
  const keyFeature = networks.KEY_FEATURES[props.skaleNetwork]
  const exploreCard = EXPLORE_CARDS.find((card) => card.feature === keyFeature)

  return (
    <div className="border-card border-14 rounded-4xl mb-4">
      <div className="relative w-full h-[280px] rounded-2xl overflow-hidden border-card">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full aspect-square ">
            <Avatar
              size={200}
              name={exploreCard?.bgKey}
              variant="marble"
              colors={HOME_CARD_COLORS}
              square={true}
              className="w-full h-full opacity-40 dark:opacity-90"
            />
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div className="text-center flex flex-col items-center p-6">
            <img
              src={exploreCard?.icon}
              className="group-hover:scale-105 transition-all duration-300 h-10 w-10 iconHomeCard"
            />
            <p className="font-bold text-3xl font-sans m-0! mt-1! text-black">
              {exploreCard?.name}
            </p>
            <p className="text-xs text-secondary-foreground dark:text-black/60 font-medium mt-1">
              {exploreCard?.description}
            </p>
            <Link to={exploreCard?.url!}>
              <Button
                size="medium"
                variant="contained"
                color="primary"
                className="btn mt-6! w-full px-10! bg-accent-foreground! dark:bg-accent! text-accent! dark:text-accent-foreground! text-sm! ease-in-out transition-transform duration-150 active:scale-[0.97]"
                startIcon={exploreCard?.buttonIcon}
              >
                {exploreCard?.buttonText}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
