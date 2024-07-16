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

import VideogameAssetRoundedIcon from '@mui/icons-material/VideogameAssetRounded'
import HubRoundedIcon from '@mui/icons-material/HubRounded'
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'
import ExploreRoundedIcon from '@mui/icons-material/ExploreRounded'
import PaidRoundedIcon from '@mui/icons-material/PaidRounded'
import ColorLensRoundedIcon from '@mui/icons-material/ColorLensRounded'
import ExtensionRoundedIcon from '@mui/icons-material/ExtensionRounded'
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded'
import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded'
import WidgetsRoundedIcon from '@mui/icons-material/WidgetsRounded'
import SwapCallsRoundedIcon from '@mui/icons-material/SwapCallsRounded'
import SurroundSoundRoundedIcon from '@mui/icons-material/SurroundSoundRounded'
import AllInboxRoundedIcon from '@mui/icons-material/AllInboxRounded'
import StoreRoundedIcon from '@mui/icons-material/StoreRounded'
import GroupRoundedIcon from '@mui/icons-material/GroupRounded'
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded'
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded'
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded'
import SportsBasketballRoundedIcon from '@mui/icons-material/SportsBasketballRounded'
import AgricultureRoundedIcon from '@mui/icons-material/AgricultureRounded'
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import PhotoCameraRoundedIcon from '@mui/icons-material/PhotoCameraRounded'

import { cmn, cls } from '@skalenetwork/metaport'

export const CATEGORY_ICON: any = {
  hubs: <HubRoundedIcon />,
  games: <VideogameAssetRoundedIcon />,
  Games: <VideogameAssetRoundedIcon />,
  apps: <ExploreRoundedIcon />,
  other: <GridViewRoundedIcon />,
  Hub: <HubRoundedIcon />,
  Game: <VideogameAssetRoundedIcon />,
  DeFi: <PaidRoundedIcon />,
  NFT: <ColorLensRoundedIcon />,
  dApp: <ExtensionRoundedIcon />,
  Community: <PeopleRoundedIcon />,
  Data: <AccountTreeRoundedIcon />,
  appChains: <WidgetsRoundedIcon />,
  AppChain: <WidgetsRoundedIcon />,
  Exchanges: <SwapCallsRoundedIcon />,
  Staking: <SurroundSoundRoundedIcon />,
  Yield: <AllInboxRoundedIcon />,
  Pools: <AllInboxRoundedIcon />,
  Marketplaces: <StoreRoundedIcon />,
  Social: <GroupRoundedIcon />,
  Metaverse: <LanguageRoundedIcon />,
  Governance: <AccountBalanceRoundedIcon />,
  Knowledge: <MenuBookRoundedIcon />,
  Sports: <SportsBasketballRoundedIcon />,
  Farming: <AgricultureRoundedIcon />,
  AI: <AutoAwesomeRoundedIcon />,
  Photos: <PhotoCameraRoundedIcon />
}

export function getPrimaryCategory(category: string | string[] | undefined) {
  if (!category) return 'other'
  if (isString(category)) return category
  if (isStringArray(category) && category.length !== 0) return category[0]
}

export function isString(value: any): value is string {
  return typeof value === 'string'
}

function isStringArray(value: any): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
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
    <div
      className={cls(props.className, 'titleBadge', cmn.flex, cmn.flexcv, [
        cmn.mbott10,
        props.isXs
      ])}
      style={{ padding: '10px 15px' }}
    >
      {getCategoryIcon(props.category)}
      <p className={cls(cmn.p, cmn.p4, cmn.mleft5)}>{props.category}</p>
    </div>
  )
}
