/**
 * @license
 * SKALE portal
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * @file ChainsMetadata.ts
 * @copyright SKALE Labs 2024-Present
 */

import { SkaleNetwork } from '.'

export interface ChainMetadata {
  alias?: string
  shortAlias?: string
  minSfuelWei?: string
  faucetUrl?: string
  categories: CategoriesMap
  background?: string
  gradientBackground?: string
  description?: string
  url?: string
  apps?: AppMetadataMap
  actions?: ChainAction[];
}

export interface AppMetadata {
  alias: string
  gradientBackground?: string
  description?: string
  contracts?: string[]
  social?: AppSocials
  added?: number
  categories: CategoriesMap
  pretge?: TimeRange
}

interface TimeRange {
  from: number
  to: number
}

export interface AppWithChainAndName extends AppMetadata {
  chain: string
  appName: string
}
export interface AppSocials {
  website?: string
  x?: string
  telegram?: string
  github?: string
  discord?: string
  swell?: string
  dappradar?: string
  'epic-games-store'?: string
}

export interface CategoriesMap {
  [category: string]: string[] | null
}

export interface AppMetadataMap {
  [appName: string]: AppMetadata
}

export interface ChainsMetadataMap {
  [chainName: string]: ChainMetadata
}

export type NetworksMetadataMap = {
  [key in SkaleNetwork]: ChainsMetadataMap
}

export interface ChainAction {
  text: string
  app: string
  description?: string
}