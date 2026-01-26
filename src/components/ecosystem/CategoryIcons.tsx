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
 * @file CategoryIcons.tsx
 * @copyright SKALE Labs 2024-Present
 */

import React from 'react'
import {
  Building2,
  Database,
  TrendingUp,
  Palette,
  Globe,
  Gamepad2,
  Network,
  Waypoints,
  Image,
  Eye,
  MoreHorizontal,
  Handshake,
  Shield,
  Users,
  Wrench,
  Wallet,
  Dice6,
  Paintbrush,
  Waves,
  Tv,
  Sword,
  Headset,
  Monitor,
  Zap,
  Puzzle,
  Car,
  Book,
  Wallpaper,
  Brain,
  Trophy,
  Flag,
  Flame,
  LayoutTemplate,
  Phone,
  Diamond,
  Sailboat,
  ShoppingCart,
  Settings,
  PieChart,
  UserCheck,
  Sparkles,
  Mountain,
  BrainCircuit,
  Receipt,
  ScanBarcode
} from 'lucide-react'
import EpicGamesStoreLogo from '../../assets/egs.svg'

export const CategoryIcons: React.FC<{ category: string }> = ({ category }) => {
  switch (category) {
    case 'ai':
      return <Sparkles />
    case 'dao':
      return <Building2 />
    case 'data-information':
      return <Database />
    case 'defi':
      return <TrendingUp />
    case 'RWA':
      return <Receipt />
    case 'consumer':
      return <ScanBarcode />
    case 'digital-collectibles':
      return <Diamond />
    case 'entertainment':
      return <Palette />
    case 'explorer':
      return <Globe />
    case 'gaming':
      return <Gamepad2 />
    case 'hub':
      return <Network />
    case 'infrastructure':
      return <BrainCircuit />
    case 'nfts':
      return <Image />
    case 'oracle':
      return <Eye />
    case 'partner':
      return <Handshake />
    case 'security':
      return <Shield />
    case 'social':
      return <Users />
    case 'tools':
      return <Wrench />
    case 'wallet':
      return <Wallet />
    case 'web3':
      return <LayoutTemplate />
    case 'pretge':
      return <ShoppingCart />
    case 'utility':
      return <Settings />
    case 'analytics':
      return <PieChart />
    case 'validator':
      return <UserCheck />

    // Gaming subcategories
    case 'action-adventure':
      return <Sailboat />
    case 'battle-royale':
      return <Dice6 />
    case 'cards_deck-building':
      return <Paintbrush />
    case 'casual':
      return <Waves />
    case 'console':
      return <Tv />
    case 'fighting':
      return <Sword />
    case 'metaverse':
      return <Headset />
    case 'mobile':
      return <Phone />
    case 'mmorpg':
      return <Mountain />
    case 'pc':
      return <Monitor />
    case 'platformer':
      return <Zap />
    case 'puzzle':
      return <Puzzle />
    case 'racing':
      return <Car />
    case 'rpg':
      return <Book />
    case 'sandbox':
      return <Wallpaper />
    case 'shooter':
      return <Flame />
    case 'simulation':
      return <Brain />
    case 'sports':
      return <Trophy />
    case 'strategy':
      return <Flag />
    case 'epic-games-store':
      return <img src={EpicGamesStoreLogo} className="w-[17px] h-[17px]" alt="egs-logo" />

    // DeFi subcategories
    case 'custody':
      return <Shield />
    case 'dex':
      return <Waypoints />
    case 'yield':
      return <Settings />

    // Default case
    default:
      return <MoreHorizontal />
  }
}
