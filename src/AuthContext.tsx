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

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react'
import { useWagmiAccount } from '@skalenetwork/metaport'
import { SiweMessage } from 'siwe'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/api'

interface AuthContextType {
  isSignedIn: boolean
  handleSignIn: () => Promise<void>
  handleSignOut: () => Promise<void>
  checkSignInStatus: () => Promise<void>
  getSignInStatus: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const { address } = useWagmiAccount()

  const checkSignInStatus = useCallback(async () => {
    if (!address) {
      setIsSignedIn(false)
      return
    }
    try {
      const status = await getSignInStatus()
      if (status) {
        setIsSignedIn(true)
      } else {
        await handleSignOut()
      }
    } catch (error) {
      console.error('Error checking sign-in status:', error)
      setIsSignedIn(false)
    }
  }, [address])

  const getSignInStatus = async (): Promise<boolean> => {
    try {
      if (!address) return false
      const response = await fetch(`${API_URL}/auth/status`, {
        credentials: 'include'
      })
      const data = await response.json()
      return data.isSignedIn && data.address && data.address.toLowerCase() === address.toLowerCase()
    } catch (error) {
      console.error('Error checking sign-in status:', error)
      return false
    }
  }

  const handleSignIn = async () => {
    if (!address) return
    try {
      const message = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: 'Sign in with Ethereum to the SKALE Portal.',
        uri: window.location.origin,
        version: '1',
        chainId: 1,
        nonce: await fetchNonce()
      })
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message.prepareMessage(), address]
      })
      const response = await fetch(`${API_URL}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, signature }),
        credentials: 'include'
      })
      if (response.ok) {
        setIsSignedIn(true)
      }
    } catch (error) {
      console.error('Error signing in:', error)
    }
  }

  const handleSignOut = async () => {
    try {
      await fetch(`${API_URL}/auth/signout`, {
        method: 'POST',
        credentials: 'include'
      })
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setIsSignedIn(false)
    }
  }

  const fetchNonce = async () => {
    const response = await fetch(`${API_URL}/auth/nonce`)
    const data = await response.json()
    return data.nonce
  }

  useEffect(() => {
    checkSignInStatus()
  }, [address, checkSignInStatus])

  return (
    <AuthContext.Provider
      value={{ isSignedIn, handleSignIn, handleSignOut, checkSignInStatus, getSignInStatus }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
