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
  'hub-chains': { name: 'Hub Chains', subcategories: {} },
  ai: { name: 'AI', subcategories: {} },
  'bridges-onramps': { name: 'Bridges + On-ramps', subcategories: {} },
  cex: { name: 'CEX', subcategories: ['Add Later'] },
  consumer: { name: 'Consumer', subcategories: ['Add Later'] },
  defi: {
    name: 'DeFi',
    subcategories: {
      aggregators: { name: 'Aggregators' },
      betting: { name: 'Betting' },
      custody: { name: 'Custody' },
      dex: { name: 'DEX' },
      launchpads: { name: 'Launchpads' },
      lending: { name: 'Lending' },
      lottery: { name: 'Lottery' },
      options: { name: 'Options' },
      payments: { name: 'Payments' },
      'perps-derivatives': { name: 'Perps + Derivatives' },
      'prediction-markets': { name: 'Prediction Markets' },
      stablecoins: { name: 'Stablecoins' },
      synthetics: { name: 'Synthetics' },
      yield: { name: 'Yield' }
    }
  },
  gaming: {
    name: 'Gaming',
    subcategories: {
      'action-adventure': { name: 'Action/Adventure' },
      'battle-royale': { name: 'Battle Royale' },
      casual: { name: 'Casual' },
      'cards_deck-building': { name: 'Cards + Deck Building' },
      console: { name: 'Console' },
      fighting: { name: 'Fighting' },
      shooter: { name: 'Shooter' },
      metaverse: { name: 'Metaverse' },
      mmorpg: { name: 'MMORPG' },
      mobile: { name: 'Mobile' },
      pc: { name: 'PC' },
      browser: { name: 'Browser' },
      platformer: { name: 'Platformer' },
      puzzle: { name: 'Puzzle' },
      racing: { name: 'Racing' },
      rpg: { name: 'RPG' },
      sandbox: { name: 'Sandbox' },
      simulation: { name: 'Simulation' },
      sports: { name: 'Sports' },
      strategy: { name: 'Strategy' }
    }
  },
  infrastructure: { name: 'Infrastructure', subcategories: {} },
  mobile: { name: 'Mobile', subcategories: {} },
  oracles: { name: 'Oracles', subcategories: {} },
  wallets: { name: 'Wallets', subcategories: {} },
  analytics: { name: 'Analytics', subcategories: {} },
  daos: { name: 'DAOs', subcategories: {} },
  socialfi: { name: 'SocialFi', subcategories: {} },
  nfts: { name: 'NFTs', subcategories: {} }
}
