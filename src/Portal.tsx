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
 * @file Portal.tsx
 * @copyright SKALE Labs 2023-Present
 */

import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'

import { type types, endpoints } from '@/core'
import {
  useMetaportStore,
  useWagmiAccount,
  Debug,
  contracts
} from '@skalenetwork/metaport'

import Header from './Header'
import SkDrawer from './SkDrawer'
import Router from './Router'
import SkBottomNavigation from './SkBottomNavigation'
import ProfileModal from './components/profile/ProfileModal'

import { formatSChains } from './core/chain'
import { STATS_API } from './core/constants'
import { getValidatorDelegations } from './core/delegation/staking'
import { getValidator } from './core/delegation'

export default function Portal() {
  const mpc = useMetaportStore((state) => state.mpc)

  const [schains, setSchains] = useState<types.ISChain[]>([])
  const [metrics, setMetrics] = useState<types.IMetrics | null>(null)
  const [stats, setStats] = useState<types.IStats | null>(null)
  const [validator, setValidator] = useState<types.st.IValidator | null | undefined>(null)
  const [validatorDelegations, setValidatorDelegations] = useState<types.st.IDelegation[] | null>(
    null
  )
  const [customAddress, setCustomAddress] = useState<types.AddressType | undefined>(undefined)
  const [sc, setSc] = useState<types.st.ISkaleContractsMap | null>(null)
  const [loadCalled, setLoadCalled] = useState<boolean>(false)

  const endpoint = endpoints.getProxyEndpoint(mpc.config.skaleNetwork)
  const statsApi = STATS_API[mpc.config.skaleNetwork]

  const { address } = useWagmiAccount()
  if (!mpc) return <div></div>

  useEffect(() => {
    initSkaleContracts()
    loadData()
  }, [])

  useEffect(() => {
    loadValidator()
  }, [address, customAddress, sc])

  async function initSkaleContracts() {
    setLoadCalled(true)
    if (loadCalled) return
    setSc(await contracts.initContracts(mpc))
  }

  async function loadChains() {
    try {
      const response = await fetch(`https://${endpoint}/files/chains.json`)
      const chainsJson = await response.json()
      setSchains(formatSChains(chainsJson))
    } catch (e) {
      console.error(e)
    }
  }

  async function loadMetrics() {
    try {
      const response = await fetch(`https://${endpoint}/files/metrics.json`)
      const metricsJson = await response.json()
      setMetrics(metricsJson)
    } catch (e) {
      console.error(e)
    }
  }

  async function loadStats() {
    if (statsApi === null) return
    try {
      const response = await fetch(statsApi)
      const statsResp = await response.json()
      setStats(statsResp.payload)
    } catch (e) {
      console.error(e)
    }
  }

  async function loadValidator() {
    const addr = customAddress ?? address
    if (!sc || !addr) {
      setValidator(null)
      setValidatorDelegations(null)
      return
    }
    const validatorData = await getValidator(sc.validatorService, addr)
    setValidator(validatorData)
    if (validatorData && validatorData.id) {
      setValidatorDelegations(await getValidatorDelegations(sc, validatorData.id))
    } else {
      setValidator(undefined)
      setValidatorDelegations(null)
    }
  }

  async function loadData() {
    loadChains()
    loadMetrics()
    loadStats()
    loadValidator()
  }

  return (
    <Box sx={{ display: 'flex' }} className="AppWrap">
      <CssBaseline />
      <Header address={address} mpc={mpc} />
      <SkDrawer validatorDelegations={validatorDelegations} />
      <div className="w-full" id="appContentScroll">
        <Router
          loadData={loadData}
          schains={schains}
          metrics={metrics}
          stats={stats}
          validator={validator}
          validatorDelegations={validatorDelegations}
          customAddress={customAddress}
          setCustomAddress={setCustomAddress}
          sc={sc}
          loadValidator={loadValidator}
        />
        <ProfileModal />
        <div className="mt-5 w-full">
          <Debug />
        </div>
      </div>
      <SkBottomNavigation />
    </Box>
  )
}
