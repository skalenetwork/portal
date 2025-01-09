/**
 * @license
 * SKALE Metaport
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
 * @file Metaport.ts
 * @copyright SKALE Labs 2022-Present
 */

// @ts-ignore
import React from 'react'
// import { createRoot } from 'react-dom/client';
import * as interfaces from './core/interfaces'

export class InjectedMetaport {
  constructor(config: interfaces.MetaportConfig) {
    if (config.openButton === undefined) config.openButton = true
    if (config.autoLookup === undefined) config.autoLookup = true
    if (config.skaleNetwork === undefined) config.skaleNetwork = 'mainnet'
    if (config.debug === undefined) config.debug = false
    const el = document.getElementById('metaport')
    if (el) {
      // createRoot(el).render(<Widget config={config} />);
    } else {
      console.log('div with id="metaport" does not exist')
    }
  }
}
