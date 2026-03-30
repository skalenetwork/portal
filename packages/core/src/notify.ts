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

type ToastId = string | number

type NotifyOptions = {
  id?: ToastId
  duration?: number
}

function success(message: string, options?: NotifyOptions) {
  toast.success(message, {
    duration: options?.duration ?? DEFAULT_DURATION,
    id: options?.id
  })
}

function info(message: string, options?: NotifyOptions) {
  toast.info(message, {
    duration: options?.duration ?? DEFAULT_DURATION,
    id: options?.id
  })
}

function error(message: string, options?: NotifyOptions) {
  toast.error(message, {
    duration: options?.duration ?? DEFAULT_DURATION,
    id: options?.id
  })
}

function permanentError(message: string, toastId?: ToastId) {
  toast.error(message, {
    duration: Infinity,
    id: toastId
  })
}

function loading(message: string, options?: any): ToastId {
  return toast.loading(message, options)
}

function dismiss(toastId?: ToastId) {
  toast.dismiss(toastId)
}

const notify = {
  success,
  info,
  error,
  permanentError,
  loading,
  dismiss,

  temporarySuccess: (message: string, toastId?: ToastId) => success(message, { id: toastId }),
  temporaryInfo: (message: string, toastId?: ToastId) => info(message, { id: toastId }),
  temporaryError: (message: string, toastId?: ToastId) => error(message, { id: toastId }),

  temporary_success: (message: string, toastId?: ToastId) => success(message, { id: toastId }),
  temporary_info: (message: string, toastId?: ToastId) => info(message, { id: toastId }),
  permanent_error: permanentError
}

export default notify