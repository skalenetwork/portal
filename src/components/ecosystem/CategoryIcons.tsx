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
  CollectionsOutlined,
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
  SportsKabaddiOutlined,
  CasinoOutlined,
  StyleOutlined,
  BeachAccessOutlined,
  TvOutlined,
  SportsHandballOutlined,
  VrpanoOutlined,
  PhoneAndroidOutlined,
  ComputerOutlined,
  GamesOutlined,
  ExtensionOutlined,
  DirectionsCarOutlined,
  AutoStoriesOutlined,
  BedroomChildOutlined,
  PsychologyOutlined,
  SportsBaseballOutlined,
  PrecisionManufacturingOutlined,
  AutoAwesomeRounded,
  HikingRounded,
  PaymentsRounded,
  FlagRounded,
  FlareRounded
} from '@mui/icons-material'

export const CategoryIcons: React.FC<{ category: string }> = ({ category }) => {
  switch (category) {
    case 'ai':
      return <AutoAwesomeRounded />
    case 'dao':
      return <AccountBalanceOutlined />
    case 'data-information':
      return <StorageOutlined />
    case 'defi':
      return <ShowChartOutlined />
    case 'digital-collectibles':
      return <CollectionsOutlined />
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

    // Gaming subcategories
    case 'action-adventure':
      return <SportsKabaddiOutlined />
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
      return <PhoneAndroidOutlined />
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
      return <BedroomChildOutlined />
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
      return <PaymentsRounded />
    case 'yield':
      return <PrecisionManufacturingOutlined />

    // Default case
    default:
      return <MoreHorizOutlined />
  }
}
