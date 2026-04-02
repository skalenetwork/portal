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

function temporarySuccess(message: string, toastId?: string | number) {
    toast.success(message, { duration: DEFAULT_DURATION, id: toastId, className: "text-emerald-500! dark:text-emerald-400! bg-emerald-100! dark:bg-emerald-700!" })
}

function temporaryInfo(message: string, toastId?: string | number) {
    toast.info(message, { duration: DEFAULT_DURATION, id: toastId, className: "text-sky-500! dark:text-blue-400! bg-sky-100! dark:bg-blue-700!" })
}

function permanentError(message: string, toastId?: string | number) {
    toast.error(message, { duration: Infinity, id: toastId, className: "text-red-500! dark:text-red-400! bg-red-100! dark:bg-red-700!" })
}

function temporaryError(message: string, toastId?: string | number) {
    toast.error(message, { duration: DEFAULT_DURATION, id: toastId, className: "text-red-500! dark:text-red-400! bg-red-100! dark:bg-red-700!" })
}

function loading(message: string, options?: any): string | number {
    return toast.loading(message, options)
}

const notify = {
    temporarySuccess,
    temporaryInfo,
    permanentError,
    temporaryError,
    loading
}

export default notify