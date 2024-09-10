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
 * @file categories.tsx
 * @copyright SKALE Labs 2024-Present
 */

export interface Subcategory {
  name: string
}

export interface Category {
  name: string
  subcategories: { [key: string]: Subcategory } | string[]
}

export interface Categories {
  [key: string]: Category
}

export const categories: Categories = {
  ai: { name: 'AI', subcategories: {} },
  bridges: { name: 'Bridges', subcategories: {} },
  dao: { name: 'DAO', subcategories: {} },
  'data-information': { name: 'Data/Information', subcategories: {} },
  defi: {
    name: 'DeFi',
    subcategories: {
      custody: { name: 'Custody' },
      dex: { name: 'DEX' },
      yield: { name: 'Yield' }
    }
  },
  'digital-collectibles': { name: 'Digital Collectibles', subcategories: {} },
  entertainment: { name: 'Entertainment', subcategories: {} },
  explorer: { name: 'Explorer', subcategories: {} },
  gaming: {
    name: 'Gaming',
    subcategories: {
      'action-adventure': { name: 'Action/Adventure' },
      'battle-royale': { name: 'Battle Royale' },
      'cards_deck-building': { name: 'Cards + Deck Building' },
      casual: { name: 'Casual' },
      console: { name: 'Console' },
      fighting: { name: 'Fighting' },
      metaverse: { name: 'Metaverse' },
      mobile: { name: 'Mobile' },
      mmorpg: { name: 'MMORPG' },
      pc: { name: 'PC' },
      platformer: { name: 'Platformer' },
      puzzle: { name: 'Puzzle' },
      racing: { name: 'Racing' },
      rpg: { name: 'RPG' },
      sandbox: { name: 'Sandbox' },
      shooter: { name: 'Shooter' },
      simulation: { name: 'Simulation' },
      sports: { name: 'Sports' },
      strategy: { name: 'Strategy' },
      web3: { name: 'Web3' },
      egs: { name: 'Epic Games Store' }
    }
  },
  hub: { name: 'Hub', subcategories: {} },
  infrastructure: { name: 'Infrastructure', subcategories: {} },
  nfts: { name: 'NFTs', subcategories: {} },
  oracle: { name: 'Oracle', subcategories: {} },
  other: { name: 'Other', subcategories: {} },
  partner: { name: 'Partner', subcategories: {} },
  security: { name: 'Security', subcategories: {} },
  'social-network': { name: 'Social Network', subcategories: {} },
  tools: { name: 'Tools', subcategories: {} },
  wallet: { name: 'Wallet', subcategories: {} },
  metaverse: { name: 'Metaverse', subcategories: {} },
  web3: { name: 'Web3', subcategories: {} },
  pretge: { name: 'Pre-TGE', subcategories: {} }
}

export const sortCategories = (categories: Categories): Categories => {
  const sortedEntries = Object.entries(categories).sort(([, a], [, b]) =>
    a.name.localeCompare(b.name)
  )
  return Object.fromEntries(
    sortedEntries.map(([key, category]) => [
      key,
      {
        ...category,
        subcategories: Object.fromEntries(
          Object.entries(category.subcategories).sort(([, a], [, b]) =>
            a.name.localeCompare(b.name)
          )
        )
      }
    ])
  )
}
