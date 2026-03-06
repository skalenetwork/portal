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
 * @file useBridgeNotifications.ts
 * @copyright SKALE Labs 2026-Present
 */

import { useEffect, useRef } from 'react'
import { useMetaportStore } from '@skalenetwork/metaport'
import { type dc } from '@/core'
import notify from '../core/notify'

export default function useBridgeNotifications() {
    const transfersHistory = useMetaportStore((state) => state.transfersHistory)
    const errorMessage = useMetaportStore((state) => state.errorMessage) as dc.ErrorMessage | null
    const prevTransfersCount = useRef(transfersHistory.length)
    const prevErrorRef = useRef(errorMessage)

    useEffect(() => {
        if (transfersHistory.length > prevTransfersCount.current) {
            const latest = transfersHistory[transfersHistory.length - 1]
            const symbol = latest.tokenKeyname?.toUpperCase() ?? 'tokens'
            notify.temporarySuccess(`${latest.amount} ${symbol} transferred`)
        }
        prevTransfersCount.current = transfersHistory.length
    }, [transfersHistory])

    useEffect(() => {
        if (errorMessage && errorMessage !== prevErrorRef.current) {
            const msg = errorMessage.headline || errorMessage.text || 'Bridge transfer failed'
            notify.permanentError(msg)
        }
        prevErrorRef.current = errorMessage
    }, [errorMessage])
}
