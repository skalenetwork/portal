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
 * @file Router.tsx
 * @copyright SKALE Labs 2024-Present
 */

import './App.scss'

import { useState, useEffect } from 'react'

import { Helmet } from 'react-helmet'
import { useLocation, Routes, Route, Navigate, useSearchParams } from 'react-router-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { CircularProgress } from '@mui/material'

import {
  useMetaportStore,
  type MetaportState,
  useWagmiAccount,
  useWagmiWalletClient,
  useWagmiSwitchNetwork,
  walletClientToSigner,
  enforceNetwork,
  cls,
  cmn
} from '@skalenetwork/metaport'

import { type types, metadata, constants } from '@/core'

import Bridge from './pages/Bridge'
import Faq from './pages/Faq'
import Terms from './pages/Terms'
import Chains from './pages/Chains'
import Chain from './pages/Chain'
import Stats from './pages/Stats'
import Ecosystem from './pages/Ecosystem'
import App from './pages/App'
import History from './pages/History'
import Portfolio from './pages/Portfolio'
import Admin from './pages/Admin'
import Start from './pages/Home'
import Staking from './pages/Staking'
import StakeValidator from './pages/StakeValidator'
import StakeAmount from './pages/StakeAmount'
import Validators from './pages/Validators'
import Validator from './pages/Validator'
import Onramp from './pages/Onramp'
import TermsModal from './components/TermsModal'
import Changelog from './pages/Changelog'

import MetricsWarning from './components/MetricsWarning'
import ScrollToTop from './components/ScrollToTop'

import { getHistoryFromStorage, setHistoryToStorage } from './core/transferHistory'
import { BRIDGE_PAGES, STAKING_PAGES } from './core/constants'
import { getValidators } from './core/delegation/validators'
import { getStakingInfoMap } from './core/delegation/staking'

export default function Router(props: {
  loadData: () => Promise<void>
  customAddress?: types.AddressType
  setCustomAddress: (address: types.AddressType) => void
  schains: types.ISChain[]
  stats: types.IStats | null
  metrics: types.IMetrics | null
  validator: types.st.IValidator | null | undefined
  validatorDelegations: types.st.IDelegation[] | null
  sc: types.st.ISkaleContractsMap | null
  loadValidator: () => Promise<void>
}) {
  const location = useLocation()
  const currentUrl = `${window.location.origin}${location.pathname}${location.search}`

  

  const theme = useTheme()
  const isXs = useMediaQuery(theme.breakpoints.down('sm'))

  const [chainsMeta, setChainsMeta] = useState<types.ChainsMetadataMap | null>(null)
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false)
  const [stakingTermsAccepted, setStakingTermsAccepted] = useState<boolean>(false)

  const [validators, setValidators] = useState<types.st.IValidator[]>([])
  const [si, setSi] = useState<types.st.StakingInfoMap>({ 0: null, 1: null, 2: null })

  const mpc = useMetaportStore((state: MetaportState) => state.mpc)
  const transfersHistory = useMetaportStore((state) => state.transfersHistory)
  const setTransfersHistory = useMetaportStore((state) => state.setTransfersHistory)
  const [searchParams, _] = useSearchParams()

  const { address } = useWagmiAccount()
  const { data: walletClient } = useWagmiWalletClient()
  const { switchChainAsync } = useWagmiSwitchNetwork()

  useEffect(() => {
    setTransfersHistory(getHistoryFromStorage(mpc.config.skaleNetwork))
    loadMetadata()
  }, [])

  useEffect(() => {
    props.setCustomAddress((searchParams.get('_customAddress') as types.AddressType) ?? undefined)
  }, [location])

  useEffect(() => {
    if (transfersHistory.length !== 0) {
      setHistoryToStorage(transfersHistory, mpc.config.skaleNetwork)
    }
  }, [transfersHistory])

  async function getMainnetSigner() {
    const { chainId } = await mpc.provider(constants.MAINNET_CHAIN_NAME).getNetwork()
    await enforceNetwork(
      chainId,
      walletClient!,
      switchChainAsync!,
      mpc.config.skaleNetwork,
      constants.MAINNET_CHAIN_NAME
    )
    return walletClientToSigner(walletClient!)
  }

  async function loadMetadata() {
    setChainsMeta(await metadata.loadMeta(mpc.config.skaleNetwork))
  }

  async function loadValidators() {
    if (!props.sc) return
    const validatorsData = await getValidators(props.sc.validatorService)
    setValidators(validatorsData)
  }

  async function loadStakingInfo() {
    if (!props.sc) return
    setSi(await getStakingInfoMap(props.sc, props.customAddress ?? address))
  }

  function isToSPage(pages: any): boolean {
    return pages.some(
      (pathname: string) => location.pathname === pathname || location.pathname.includes(pathname)
    )
  }

  if (!termsAccepted && isToSPage(BRIDGE_PAGES)) {
    return (
      <TermsModal
        mpc={mpc}
        termsAccepted={termsAccepted}
        setTermsAccepted={setTermsAccepted}
        type="bridge"
      />
    )
  }

  if (!stakingTermsAccepted && isToSPage(STAKING_PAGES)) {
    return (
      <TermsModal
        mpc={mpc}
        termsAccepted={stakingTermsAccepted}
        setTermsAccepted={setStakingTermsAccepted}
        type="staking"
      />
    )
  }

  if (!chainsMeta)
    return (
      <div className="fullscreen-msg">
        <div className={cls(cmn.flex)}>
          <div className={cls(cmn.flex, cmn.flexcv, cmn.mri20)}>
            <CircularProgress className="fullscreen-spin" />
          </div>
          <div className={cls(cmn.flex, cmn.flexcv)}>
            <h3 className="fullscreen-msg-text">Loading SKALE Chains</h3>
          </div>
        </div>
      </div>
    )

  return (
    <div style={{ marginBottom: isXs ? '55px' : '' }}>
      <Helmet>
        <meta property="og:url" content={currentUrl} />
      </Helmet>
      <MetricsWarning metrics={props.metrics} />
      <ScrollToTop />
      <TransitionGroup>
        <CSSTransition key={location.pathname} classNames="fade" timeout={300} component={null}>
          <Routes>
            <Route
              index
              element={
                <Start
                  skaleNetwork={mpc.config.skaleNetwork}
                  chainsMeta={chainsMeta}
                  metrics={props.metrics}
                  loadData={props.loadData}
                />
              }
            />
            <Route path="bridge" element={<Bridge isXs={isXs} chainsMeta={chainsMeta} />} />
            <Route path="bridge">
              <Route path="history" element={<History />} />
            </Route>
            <Route path="portfolio" element={<Portfolio mpc={mpc} />} />
            <Route
              path="chains"
              element={
                <Chains
                  chainsMeta={chainsMeta}
                  loadData={props.loadData}
                  schains={props.schains}
                  metrics={props.metrics}
                  mpc={mpc}
                  isXs={isXs}
                />
              }
            />
            <Route path="chains">
              <Route
                path=":name"
                element={
                  <Chain
                    loadData={props.loadData}
                    schains={props.schains}
                    stats={props.stats}
                    metrics={props.metrics}
                    mpc={mpc}
                    chainsMeta={chainsMeta}
                    isXs={isXs}
                  />
                }
              />
            </Route>
            <Route
              path="/epicgames"
              element={<Navigate to="/ecosystem?categories=gaming_epic-games-store" replace />}
            />
            <Route
              path="ecosystem"
              element={
                <Ecosystem
                  isXs={isXs}
                  mpc={mpc}
                  chainsMeta={chainsMeta}
                  metrics={props.metrics}
                  loadData={props.loadData}
                />
              }
            />
            <Route path="ecosystem">
              <Route
                path=":chain/:app"
                element={
                  <App
                    chainsMeta={chainsMeta}
                    mpc={mpc}
                    isXs={isXs}
                    metrics={props.metrics}
                    loadData={props.loadData}
                  />
                }
              />
            </Route>
            <Route path="onramp" element={<Onramp mpc={mpc} />} />
            <Route path="stats" element={<Stats />} />
            <Route path="other">
              <Route path="faq" element={<Faq />} />
              <Route path="terms-of-service" element={<Terms />} />
              <Route path="changelog" element={<Changelog />} />
            </Route>
            <Route path="admin">
              <Route path=":name" element={<Admin chainsMeta={chainsMeta} mpc={mpc} />} />
            </Route>

            <Route
              path="staking"
              element={
                <Staking
                  isXs={isXs}
                  mpc={mpc}
                  validators={validators}
                  loadValidators={loadValidators}
                  loadStakingInfo={loadStakingInfo}
                  sc={props.sc}
                  si={si}
                  address={props.customAddress ?? address}
                  customAddress={props.customAddress}
                  getMainnetSigner={getMainnetSigner}
                />
              }
            />
            <Route
              path="validators"
              element={
                <Validators
                  mpc={mpc}
                  validators={validators}
                  loadValidators={loadValidators}
                  sc={props.sc}
                  validatorDelegations={props.validatorDelegations}
                />
              }
            />
            <Route
              path="validator"
              element={
                <Validator
                  mpc={mpc}
                  address={address}
                  customAddress={props.customAddress}
                  loadValidator={props.loadValidator}
                  sc={props.sc}
                  validator={props.validator}
                  isXs={isXs}
                  delegations={props.validatorDelegations}
                  getMainnetSigner={getMainnetSigner}
                />
              }
            />
            <Route path="staking">
              <Route
                path="new/:delType/:id"
                element={
                  <StakeAmount
                    mpc={mpc}
                    validators={validators}
                    loadValidators={loadValidators}
                    loadStakingInfo={loadStakingInfo}
                    sc={props.sc}
                    si={si}
                    address={address}
                    getMainnetSigner={getMainnetSigner}
                  />
                }
              />
              <Route
                path="new"
                element={
                  <StakeValidator
                    mpc={mpc}
                    validators={validators}
                    loadValidators={loadValidators}
                    loadStakingInfo={loadStakingInfo}
                    sc={props.sc}
                    si={si}
                  />
                }
              />
            </Route>
          </Routes>
        </CSSTransition>
      </TransitionGroup>
    </div>
  )
}
