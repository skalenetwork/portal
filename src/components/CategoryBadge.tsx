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
 * @file CategoryBadge.tsx
 * @copyright SKALE Labs 2023-Present
 */

import {
  Gamepad2,
  Share2,
  Compass,
  Landmark,
  Palette,
  Puzzle,
  Users,
  Network,
  LayoutGrid,
  Shuffle,
  Waves,
  Inbox,
  Store,
  Users2,
  Globe,
  BookOpen,
  Wheat,
  Sparkles,
  Camera,
  Grid2x2,
  Volleyball
} from 'lucide-react'


export const CATEGORY_ICON: any = {
  hubs: <Share2 />,
  games: <Gamepad2 />,
  Games: <Gamepad2 />,
  apps: <Compass />,
  other: <Grid2x2 />,
  Hub: <Share2 />,
  Game: <Gamepad2 />,
  DeFi: <Landmark />,
  NFT: <Palette />,
  dApp: <Puzzle />,
  Community: <Users />,
  Data: <Network />,
  appChains: <LayoutGrid />,
  AppChain: <LayoutGrid />,
  Exchanges: <Shuffle />,
  Staking: <Waves />,
  Yield: <Inbox />,
  Pools: <Inbox />,
  Marketplaces: <Store />,
  Social: <Users2 />,
  Metaverse: <Globe />,
  Governance: <Landmark />,
  Knowledge: <BookOpen />,
  Sports: <Volleyball />,
  Farming: <Wheat />,
  AI: <Sparkles />,
  Photos: <Camera />
}

export function isString(value: any): value is string {
  return typeof value === 'string'
}

export default function CategoryBadge(props: {
  category: string
  isXs: boolean
  className?: string
}) {
  function getCategoryIcon(category: string) {
    return CATEGORY_ICON[category] ?? CATEGORY_ICON.other
  }

  return (
    <div className={props.className}>
      <Chip label={props.category} icon={getCategoryIcon(props.category)} />
    </div>
  )
}
