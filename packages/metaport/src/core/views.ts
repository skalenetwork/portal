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
 * @file views.ts
 * @copyright SKALE Labs 2023-Present
 */

import { View } from './dataclasses/View'

export function isTransferRequestView(view: View) {
  return view === View.TRANSFER_REQUEST_SUMMARY || view === View.TRANSFER_REQUEST_STEPS
}

export function isTransferRequestSummary(view: View) {
  return view === View.TRANSFER_REQUEST_SUMMARY
}

export function isStepsMetadata(view: View) {
  return view === View.TRANSFER_REQUEST_STEPS
}
