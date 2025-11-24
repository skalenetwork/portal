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
 * @file HomeComponents.tsx
 * @copyright SKALE Labs 2024-Present
 */

import {
  ArrowRightLeft,
  ArrowUpRight,
  BadgeCheck,
  Gamepad2,
  Globe2,
  LineChart,
  PieChart,
  Rocket,
  WalletCards,
  Link2
} from 'lucide-react'

import { types } from '@/core'

interface SectionIcons {
  [key: string]: JSX.Element
}

export const SECTION_ICONS: SectionIcons = {
  explore: <Rocket size={18} />,
  new: <BadgeCheck size={18} />,
  trending: <LineChart size={18} />,
  categories: <ArrowUpRight size={18} />,
  featured: <WalletCards size={18} />
}

interface ExploreCard {
  name: string
  description: string
  icon: JSX.Element
  feature: types.NetworkFeature
  url?: string
}

export const EXPLORE_CARDS: ExploreCard[] = [
  {
    name: 'Stake your SKL',
    description:
      'Select a validator to delegate your SKL to for a 2-month period to help secure the network.',
    url: '/staking',
    icon: <PieChart size={18} />,
    feature: 'staking'
  },
  {
    name: "Explore SKALE's DeFi",
    description: 'The SKALE DeFi ecosystem is rapidly expanding on Europa. Check it out!',
    url: '/ecosystem?categories=defi',
    icon: <Globe2 size={18} />,
    feature: 'ecosystem'
  },
  {
    name: 'Swap on SKALE',
    description: 'Swap your favorite tokens on SKALE with zero gas fees using SushiSwap.',
    url: 'https://www.sushi.com/skale-europa/swap',
    icon: <ArrowRightLeft size={18} />,
    feature: 'swap'
  },
  {
    name: 'Discover SKALE Chains',
    description: 'Check out endpoints, tokens and more for SKALE Chains.',
    url: '/chains',
    icon: <Link2 size={18} />,
    feature: 'chains'
  },
  {
    name: 'Get Chain Access',
    description: 'Buy Chain Credits to use SKALE Chains - deploy smart contracts and more.',
    url: '/credits',
    icon: <WalletCards size={18} />,
    feature: 'credits'
  }
  // {
  //   name: 'Learn about Chain Credits',
  //   description: 'Find out how Chain Credits work and how to use them on SKALE.',
  //   url: 'https://docs.skale.space/welcome/get-started',
  //   icon: <HelpRoundedIcon />,
  //   feature: 'credits'
  // }
]
