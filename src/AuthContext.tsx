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

import React, { createContext, useState, useContext, useEffect } from 'react'
import { Logger, type ILogObj } from 'tslog'
import { SiweMessage } from 'siwe'
import { useWagmiAccount } from '@skalenetwork/metaport'
import { API_URL } from './core/constants'

const log = new Logger<ILogObj>({ name: 'AuthContext' })

interface AuthContextType {
  isSignedIn: boolean
  handleSignIn: () => Promise<void>
  handleSignOut: () => Promise<void>
  handleAddressChange: () => Promise<void>
  getSignInStatus: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const { address } = useWagmiAccount()

  const handleAddressChange = async function () {
    log.info(`Address changed: ${address}`)
    if (!address) {
      log.warn('No address found, signing out')
      setIsSignedIn(false)
      return
    }
    try {
      const status = await getSignInStatus()
      if (status) {
        log.info('User is already signed in')
        setIsSignedIn(true)
      } else {
        log.info('User not signed in, clearing session')
        await handleSignOut()
      }
    } catch (error) {
      log.error('Error checking sign-in status:', error)
      setIsSignedIn(false)
    }
  }

  const getSignInStatus = async (): Promise<boolean> => {
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
  }

  const handleSignIn = async () => {
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
      } else {
        log.error('Sign in failed', response.status, response.statusText)
      }
    } catch (error) {
      log.error('Error signing in:', error)
    }
  }

  const handleSignOut = async () => {
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
    }
  }

  const fetchNonce = async () => {
    log.debug('Fetching nonce')
    const response = await fetch(`${API_URL}/auth/nonce`)
    const data = await response.json()
    log.debug(`Nonce received: ${data.nonce}`)
    return data.nonce
  }

  useEffect(() => {
    log.info('Address changed, updating auth status')
    handleAddressChange()
  }, [address])

  return (
    <AuthContext.Provider
      value={{ isSignedIn, handleSignIn, handleSignOut, handleAddressChange, getSignInStatus }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    log.error('useAuth must be used within an AuthProvider')
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}