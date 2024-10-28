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
 * @file AuthContext.tsx
 * @copyright SKALE Labs 2024-Present
 */

import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react'
import { Logger, type ILogObj } from 'tslog'
import { SiweMessage } from 'siwe'
import { useWagmiAccount } from '@skalenetwork/metaport'
import { API_URL } from './core/constants'

const log = new Logger<ILogObj>({ name: 'AuthContext' })

interface AuthContextType {
  isSignedIn: boolean
  email: string | null
  isEmailLoading: boolean
  isEmailUpdating: boolean
  emailError: string | null
  isProfileModalOpen: boolean
  handleSignIn: () => Promise<void>
  handleSignOut: () => Promise<void>
  handleAddressChange: () => Promise<void>
  getSignInStatus: () => Promise<boolean>
  getEmail: () => Promise<void>
  updateEmail: (newEmail: string) => Promise<void>
  openProfileModal: () => void
  closeProfileModal: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [email, setEmail] = useState<string | null>(null)
  const [isEmailLoading, setIsEmailLoading] = useState(false)
  const [isEmailUpdating, setIsEmailUpdating] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const { address } = useWagmiAccount()

  const handleAddressChange = useCallback(async () => {
    log.info(`Address changed: ${address}`)
    if (!address) {
      log.warn('No address found, signing out')
      setIsSignedIn(false)
      setEmail(null)
      return
    }
    try {
      const status = await getSignInStatus()
      if (status) {
        log.info('User is already signed in')
        setIsSignedIn(true)
        await getEmail()
      } else {
        log.info('User not signed in, clearing session')
        await handleSignOut()
      }
    } catch (error) {
      log.error('Error checking sign-in status:', error)
      setIsSignedIn(false)
    }
  }, [address])

  const getSignInStatus = useCallback(async (): Promise<boolean> => {
    try {
      if (!address) return false
      log.info(`Checking sign-in status for address: ${address}`)
      const response = await fetch(`${API_URL}/auth/status`, {
        credentials: 'include'
      })
      const data = await response.json()
      const isSignedIn =
        data.isSignedIn && data.address && data.address.toLowerCase() === address.toLowerCase()
      log.info(`Sign-in status: ${isSignedIn}`)
      return isSignedIn
    } catch (error) {
      log.error('Error checking sign-in status:', error)
      return false
    }
  }, [address])

  const handleSignIn = useCallback(async () => {
    if (!address) {
      log.warn('Cannot sign in: No address provided')
      return
    }
    log.info(`Initiating sign in for address: ${address}`)
    try {
      const nonce = await fetchNonce()
      log.debug(`Fetched nonce: ${nonce}`)
      const message = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement:
          'Sign in to the SKALE Portal to add dApps to your Favorites. This is optional, and you can still use the Portal without signing in.',
        uri: window.location.origin,
        version: '1',
        chainId: 1,
        nonce: nonce
      })
      log.debug('SIWE message created')
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message.prepareMessage(), address]
      })
      log.debug('Message signed')
      const response = await fetch(`${API_URL}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, signature }),
        credentials: 'include'
      })
      if (response.ok) {
        log.info('Sign in successful')
        setIsSignedIn(true)
        await getEmail()
      } else {
        log.error('Sign in failed', response.status, response.statusText)
      }
    } catch (error) {
      log.error('Error signing in:', error)
    }
  }, [address])

  const handleSignOut = useCallback(async () => {
    log.info('Initiating sign out')
    try {
      const response = await fetch(`${API_URL}/auth/signout`, {
        method: 'POST',
        credentials: 'include'
      })
      if (response.ok) {
        log.info('Sign out successful')
      } else {
        log.error('Sign out failed', response.status, response.statusText)
      }
    } catch (error) {
      log.error('Error signing out:', error)
    } finally {
      setIsSignedIn(false)
      setEmail(null)
    }
  }, [])

  const fetchNonce = useCallback(async () => {
    log.debug('Fetching nonce')
    const response = await fetch(`${API_URL}/auth/nonce`)
    const data = await response.json()
    log.debug(`Nonce received: ${data.nonce}`)
    return data.nonce
  }, [])

  const getEmail = useCallback(async () => {
    setIsEmailLoading(true)
    setEmailError(null)
    try {
      const response = await fetch(`${API_URL}/auth/email`, {
        credentials: 'include'
      })
      if (response.ok) {
        if (response.status === 204) {
          setEmail(null)
        } else {
          const data = await response.json()
          setEmail(data.email)
        }
      } else {
        throw new Error('Failed to fetch email')
      }
    } catch (error) {
      console.error('Error fetching email:', error)
      setEmailError('Failed to fetch email')
    } finally {
      setIsEmailLoading(false)
    }
  }, [])

  const updateEmail = useCallback(async (newEmail: string) => {
    setIsEmailUpdating(true)
    setEmailError(null)
    try {
      const response = await fetch(`${API_URL}/auth/update_email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail }),
        credentials: 'include'
      })
      if (response.ok) {
        setEmail(newEmail)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update email')
      }
    } catch (error: any) {
      log.error('Error updating email:', error)
      setEmailError(error.message || 'Failed to update email')
    } finally {
      setIsEmailUpdating(false)
    }
  }, [])

  const openProfileModal = useCallback(() => {
    setIsProfileModalOpen(true)
  }, [])

  const closeProfileModal = useCallback(() => {
    setIsProfileModalOpen(false)
  }, [])

  useEffect(() => {
    log.info('Address changed, updating auth status')
    handleAddressChange()
  }, [address, handleAddressChange])

  const contextValue = useMemo(
    () => ({
      isSignedIn,
      email,
      isEmailLoading,
      isEmailUpdating,
      emailError,
      isProfileModalOpen,
      handleSignIn,
      handleSignOut,
      handleAddressChange,
      getSignInStatus,
      getEmail,
      updateEmail,
      openProfileModal,
      closeProfileModal
    }),
    [
      isSignedIn,
      email,
      isEmailLoading,
      isEmailUpdating,
      emailError,
      isProfileModalOpen,
      handleSignIn,
      handleSignOut,
      handleAddressChange,
      getSignInStatus,
      getEmail,
      updateEmail,
      openProfileModal,
      closeProfileModal
    ]
  )

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    log.error('useAuth must be used within an AuthProvider')
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
