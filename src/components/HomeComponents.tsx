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
  Link2,
  Star,
  Sparkle
} from 'lucide-react'

import CoinIcon from '../icons/coin.svg'
import ChartIcon from '../icons/chart.svg'
import SwapIcon from '../icons/swap.svg'
import ChainsIcon from '../icons/chains.svg'
import MoneyIcon from '../icons/money.svg'
import QuestionIcon from '../icons/question.svg'

import { types } from '@/core'

interface SectionIcons {
  [key: string]: JSX.Element
}

export const SECTION_ICONS: SectionIcons = {
  explore: <Rocket size={17} />,
  new: <BadgeCheck size={17} />,
  trending: <LineChart size={17} />,
  categories: <ArrowUpRight size={17} />,
  featured: <Sparkle size={17} />
}

interface ExploreCard {
  name: string
  description: string
  icon: JSX.Element
  feature: types.NetworkFeature
  bgKey: string
  url?: string
}

export const EXPLORE_CARDS: ExploreCard[] = [
  {
    name: 'Stake your SKL',
    description:
      'Select a validator to delegate your SKL to for a 2-month period to help secure the network.',
    url: '/staking',
    icon: CoinIcon,
    feature: 'staking',
    bgKey: 'stake_1234'
  },
  {
    name: "Explore SKALE's DeFi",
    description: 'The SKALE DeFi ecosystem is rapidly expanding on Europa. Check it out!',
    url: '/ecosystem?categories=defi',
    icon: ChartIcon,
    feature: 'ecosystem',
    bgKey: 'defi_123456'
  },
  {
    name: 'Swap on SKALE',
    description: 'Swap your favorite tokens on SKALE with zero gas fees using SushiSwap.',
    url: 'https://www.sushi.com/skale-europa/swap',
    icon: SwapIcon,
    feature: 'swap',
    bgKey: 'swap_1'
  },
  {
    name: 'Discover SKALE Chains',
    description: 'Check out endpoints, tokens and more for SKALE Chains.',
    url: '/chains',
    icon: ChainsIcon,
    feature: 'chains',
    bgKey: 'chains_12345'
  },
  {
    name: 'Get Chain Access',
    description: 'Buy Chain Credits to use SKALE Chains - deploy smart contracts and more.',
    url: '/credits',
    icon: MoneyIcon,
    feature: 'credits',
    bgKey: 'credits_12345678'
  },
  {
    name: 'Learn about Chain Credits',
    description: 'Find out how Chain Credits work and how to use them on SKALE.',
    url: 'https://docs.skale.space/welcome/get-started',
    icon: QuestionIcon,
    feature: 'credits',
    bgKey: 'credits_1234'
  }
]
