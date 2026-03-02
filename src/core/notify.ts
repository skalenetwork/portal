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
 * @file notify.ts
 * @copyright SKALE Labs 2026-Present
 */

import { toast } from 'sonner'

const DEFAULT_DURATION = 5000

function temporarySuccess(message: string) {
    toast.success(message, { duration: DEFAULT_DURATION })
}

function temporaryInfo(message: string) {
    toast.info(message, { duration: DEFAULT_DURATION })
}

function permanentError(message: string) {
    toast.error(message, { duration: Infinity })
}

function loading(message: string): string | number {
    return toast.loading(message)
}

function dismiss(toastId: string | number) {
    toast.dismiss(toastId)
}

const notify = {
    temporarySuccess,
    temporaryInfo,
    permanentError,
    loading,
    dismiss
}

export default notify
