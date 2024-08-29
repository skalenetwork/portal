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
  AccountBalanceOutlined,
  StorageOutlined,
  ShowChartOutlined,
  TheaterComedyOutlined,
  ExploreOutlined,
  SportsEsportsOutlined,
  HubOutlined,
  MemoryOutlined,
  FilterFramesOutlined,
  VisibilityOutlined,
  MoreHorizOutlined,
  HandshakeOutlined,
  SecurityOutlined,
  PeopleOutlined,
  BuildOutlined,
  AccountBalanceWalletOutlined,
  CasinoOutlined,
  StyleOutlined,
  BeachAccessOutlined,
  TvOutlined,
  SportsHandballOutlined,
  VrpanoOutlined,
  ComputerOutlined,
  GamesOutlined,
  ExtensionOutlined,
  DirectionsCarOutlined,
  AutoStoriesOutlined,
  WallpaperOutlined,
  PsychologyOutlined,
  SportsBaseballOutlined,
  PrecisionManufacturingOutlined,
  AutoAwesomeOutlined,
  HikingRounded,
  FlagRounded,
  FlareRounded,
  CandlestickChartRounded,
  JoinRightRounded,
  PhoneIphoneOutlined,
  DiamondOutlined,
  SailingOutlined
} from '@mui/icons-material'

export const CategoryIcons: React.FC<{ category: string }> = ({ category }) => {
  switch (category) {
    case 'ai':
      return <AutoAwesomeOutlined />
    case 'dao':
      return <AccountBalanceOutlined />
    case 'data-information':
      return <StorageOutlined />
    case 'defi':
      return <ShowChartOutlined />
    case 'digital-collectibles':
      return <DiamondOutlined />
    case 'entertainment':
      return <TheaterComedyOutlined />
    case 'explorer':
      return <ExploreOutlined />
    case 'gaming':
      return <SportsEsportsOutlined />
    case 'hub':
      return <HubOutlined />
    case 'infrastructure':
      return <MemoryOutlined />
    case 'nfts':
      return <FilterFramesOutlined />
    case 'oracle':
      return <VisibilityOutlined />
    case 'partner':
      return <HandshakeOutlined />
    case 'security':
      return <SecurityOutlined />
    case 'social-network':
      return <PeopleOutlined />
    case 'tools':
      return <BuildOutlined />
    case 'wallet':
      return <AccountBalanceWalletOutlined />
    case 'web3':
      return <JoinRightRounded />

    // Gaming subcategories
    case 'action-adventure':
      return <SailingOutlined />
    case 'battle-royale':
      return <CasinoOutlined />
    case 'cards_deck-building':
      return <StyleOutlined />
    case 'casual':
      return <BeachAccessOutlined />
    case 'console':
      return <TvOutlined />
    case 'fighting':
      return <SportsHandballOutlined />
    case 'metaverse':
      return <VrpanoOutlined />
    case 'mobile':
      return <PhoneIphoneOutlined />
    case 'mmorpg':
      return <HikingRounded />
    case 'pc':
      return <ComputerOutlined />
    case 'platformer':
      return <GamesOutlined />
    case 'puzzle':
      return <ExtensionOutlined />
    case 'racing':
      return <DirectionsCarOutlined />
    case 'rpg':
      return <AutoStoriesOutlined />
    case 'sandbox':
      return <WallpaperOutlined />
    case 'shooter':
      return <FlareRounded />
    case 'simulation':
      return <PsychologyOutlined />
    case 'sports':
      return <SportsBaseballOutlined />
    case 'strategy':
      return <FlagRounded />

    // DeFi subcategories
    case 'custody':
      return <SecurityOutlined />
    case 'dex':
      return <CandlestickChartRounded />
    case 'yield':
      return <PrecisionManufacturingOutlined />

    // Default case
    default:
      return <MoreHorizOutlined />
  }
}
