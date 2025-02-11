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

import SwapHorizontalCircleOutlinedIcon from '@mui/icons-material/SwapHorizontalCircleOutlined'
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import RocketLaunchRoundedIcon from '@mui/icons-material/RocketLaunchRounded'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'
import LinkRoundedIcon from '@mui/icons-material/LinkRounded'
import PieChartOutlineRoundedIcon from '@mui/icons-material/PieChartOutlineRounded'
import OutboundRoundedIcon from '@mui/icons-material/OutboundRounded'
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded'

interface SectionIcons {
  [key: string]: JSX.Element
}

export const SECTION_ICONS: SectionIcons = {
  explore: <RocketLaunchRoundedIcon color="primary" />,
  favorites: <FavoriteRoundedIcon color="primary" />,
  new: <StarRoundedIcon color="primary" />,
  trending: <TrendingUpRoundedIcon color="primary" />,
  mostLiked: <PeopleRoundedIcon color="primary" />,
  categories: <OutboundRoundedIcon color="primary" />
}

interface ExploreCard {
  name: string
  description: string
  icon: JSX.Element
  url?: string
}

export const EXPLORE_CARDS: ExploreCard[] = [
  {
    name: 'Bridge to SKALE',
    description: 'Bridge SKL and other popular tokens to SKALE.',
    url: '/bridge',
    icon: <SwapHorizontalCircleOutlinedIcon />
  },
  {
    name: 'Stake your SKL',
    description: 'Select a validator to delegate your SKL to for a 2-month period to help secure the network.',
    url: '/staking',
    icon: <PieChartOutlineRoundedIcon />
  },
  {
    name: 'Play on Nebula',
    description: 'SKALE is home to dozens of amazing games. Explore the gaming ecosystem!',
    url: '/ecosystem?category=gaming',
    icon: <LinkRoundedIcon />
  },
  {
    name: 'Explore SKALE´s DeFi',
    description: 'The SKALE DeFi ecosystem is rapidly expanding on Europa. Check it out!',
    url: '/ecosystem?category=defi',
    icon: <PublicOutlinedIcon />
  }
]
