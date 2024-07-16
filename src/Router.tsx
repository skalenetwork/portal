import './App.scss'

import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useLocation, Routes, Route, useSearchParams, Navigate, useParams } from 'react-router-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { CircularProgress } from '@mui/material'

import {
  useMetaportStore,
  PROXY_ENDPOINTS,
  type MetaportState,
  useWagmiAccount,
  useWagmiWalletClient,
  useWagmiSwitchNetwork,
  walletClientToSigner,
  enforceNetwork,
  type interfaces,
  cls,
  cmn
} from '@skalenetwork/metaport'

import Bridge from './pages/Bridge'
import Faq from './pages/Faq'
import Terms from './pages/Terms'
import Chains from './pages/Chains'
import Chain from './pages/Chain'
import Stats from './pages/Stats'
import Apps from './pages/Apps'
import App from './pages/App'
import History from './pages/History'
import Portfolio from './pages/Portfolio'
import Admin from './pages/Admin'
import Start from './pages/Start'
import Staking from './pages/Staking'
import StakeValidator from './pages/StakeValidator'
import StakeAmount from './pages/StakeAmount'
import Validators from './pages/Validators'
import Onramp from './pages/Onramp'
import TermsModal from './components/TermsModal'
import Changelog from './pages/Changelog'

import MetricsWarning from './components/MetricsWarning'
import ScrollToTop from './components/ScrollToTop'

import { getHistoryFromStorage, setHistoryToStorage } from './core/transferHistory'
import { BRIDGE_PAGES, MAINNET_CHAIN_NAME, STAKING_PAGES, STATS_API } from './core/constants'
import { type IValidator, type ISkaleContractsMap, type StakingInfoMap } from './core/interfaces'
import { getValidators } from './core/delegation/validators'
import { initContracts } from './core/contracts'
import { getStakingInfoMap } from './core/delegation/staking'
import { formatSChains } from './core/chain'
import { IMetrics, ISChain, IStats, IAppId } from './core/types'
import { getTopAppsByTransactions } from './core/explorer'
import { loadMeta } from './core/metadata'

const ChainRedirect = () => {
  const { name } = useParams()
  return <Navigate to={`/ecosystem/${name}`} replace />
}

export default function Router() {
  const location = useLocation()
  const currentUrl = `${window.location.origin}${location.pathname}${location.search}`

  const theme = useTheme()
  const isXs = useMediaQuery(theme.breakpoints.down('sm'))

  const [chainsMeta, setChainsMeta] = useState<interfaces.ChainsMetadataMap | null>(null)
  const [schains, setSchains] = useState<ISChain[]>([])
  const [metrics, setMetrics] = useState<IMetrics | null>(null)
  const [topApps, setTopApps] = useState<IAppId[] | null>(null)
  const [stats, setStats] = useState<IStats | null>(null)
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false)
  const [stakingTermsAccepted, setStakingTermsAccepted] = useState<boolean>(false)

  const [loadCalled, setLoadCalled] = useState<boolean>(false)
  const [sc, setSc] = useState<ISkaleContractsMap | null>(null)
  const [validators, setValidators] = useState<IValidator[]>([])
  const [si, setSi] = useState<StakingInfoMap>({ 0: null, 1: null, 2: null })

  const [customAddress, setCustomAddress] = useState<interfaces.AddressType | undefined>(undefined)

  const mpc = useMetaportStore((state: MetaportState) => state.mpc)
  const transfersHistory = useMetaportStore((state) => state.transfersHistory)
  const setTransfersHistory = useMetaportStore((state) => state.setTransfersHistory)

  const { address } = useWagmiAccount()
  const { data: walletClient } = useWagmiWalletClient()
  const { switchNetworkAsync } = useWagmiSwitchNetwork()

  const [searchParams, _] = useSearchParams()
  const endpoint = PROXY_ENDPOINTS[mpc.config.skaleNetwork]
  const statsApi = STATS_API[mpc.config.skaleNetwork]

  useEffect(() => {
    setTransfersHistory(getHistoryFromStorage(mpc.config.skaleNetwork))
    initSkaleContracts()
    loadMetadata()
  }, [])

  useEffect(() => {
    setCustomAddress((searchParams.get('_customAddress') as interfaces.AddressType) ?? undefined)
  }, [location])

  useEffect(() => {
    if (transfersHistory.length !== 0) {
      setHistoryToStorage(transfersHistory, mpc.config.skaleNetwork)
    }
  }, [transfersHistory])

  async function getMainnetSigner() {
    const { chainId } = await mpc.mainnet().provider.getNetwork()
    await enforceNetwork(
      chainId,
      walletClient,
      switchNetworkAsync!,
      mpc.config.skaleNetwork,
      MAINNET_CHAIN_NAME
    )
    return walletClientToSigner(walletClient!)
  }

  async function loadData() {
    loadChains()
    loadMetrics()
    loadStats()
  }

  async function loadMetadata() {
    setChainsMeta(await loadMeta(mpc.config.skaleNetwork))
  }

  async function loadChains() {
    const response = await fetch(`https://${endpoint}/files/chains.json`)
    const chainsJson = await response.json()
    setSchains(formatSChains(chainsJson))
  }

  async function loadMetrics() {
    try {
      const response = await fetch(`https://${endpoint}/files/metrics.json`)
      const metricsJson = await response.json()
      setMetrics(metricsJson)
      setTopApps(getTopAppsByTransactions(metricsJson.metrics, 10))
    } catch (e) {
      console.log('Failed to load metrics')
      console.error(e)
    }
  }

  async function loadStats() {
    if (statsApi === null) return
    const response = await fetch(statsApi)
    const statsResp = await response.json()
    setStats(statsResp.payload)
  }

  async function initSkaleContracts() {
    setLoadCalled(true)
    if (loadCalled) return
    setSc(await initContracts(mpc))
  }

  async function loadValidators() {
    if (!sc) return
    const validatorsData = await getValidators(sc.validatorService)
    setValidators(validatorsData)
  }

  async function loadStakingInfo() {
    if (!sc) return
    setSi(await getStakingInfoMap(sc, customAddress ?? address))
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
      <MetricsWarning metrics={metrics} />
      <ScrollToTop />
      <TransitionGroup>
        <CSSTransition key={location.pathname} classNames="fade" timeout={300} component={null}>
          <Routes>
            <Route path="/chains" element={<Navigate to="/ecosystem" />} />
            <Route path="/chains/:name" element={<ChainRedirect />} />
            <Route
              index
              element={
                <Start
                  isXs={isXs}
                  skaleNetwork={mpc.config.skaleNetwork}
                  topApps={topApps}
                  loadData={loadData}
                  chainsMeta={chainsMeta}
                />
              }
            />
            <Route path="bridge" element={<Bridge isXs={isXs} />} />
            <Route path="bridge">
              <Route path="history" element={<History />} />
            </Route>
            <Route path="portfolio" element={<Portfolio mpc={mpc} />} />
            <Route
              path="ecosystem"
              element={
                <Chains
                  chainsMeta={chainsMeta}
                  loadData={loadData}
                  schains={schains}
                  metrics={metrics}
                  mpc={mpc}
                  isXs={isXs}
                />
              }
            />
            <Route path="ecosystem">
              <Route
                path=":name"
                element={
                  <Chain
                    loadData={loadData}
                    schains={schains}
                    stats={stats}
                    metrics={metrics}
                    mpc={mpc}
                    chainsMeta={chainsMeta}
                    isXs={isXs}
                  />
                }
              />
              <Route
                path=":chain/:app"
                element={
                  <App
                    chainsMeta={chainsMeta}
                    mpc={mpc}
                    isXs={isXs}
                    metrics={metrics}
                    loadData={loadData}
                  />
                }
              />
            </Route>
            <Route path="apps" element={<Apps mpc={mpc} chainsMeta={chainsMeta} />} />
            <Route path="onramp" element={<Onramp mpc={mpc} />} />
            <Route path="stats" element={<Stats />} />
            <Route path="other">
              <Route path="faq" element={<Faq />} />
              <Route path="terms-of-service" element={<Terms />} />
              <Route path="changelog" element={<Changelog />} />
            </Route>
            <Route path="admin">
              <Route path=":name" element={<Admin mpc={mpc} />} />
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
                  sc={sc}
                  si={si}
                  address={customAddress ?? address}
                  customAddress={customAddress}
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
                  sc={sc}
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
                    sc={sc}
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
                    sc={sc}
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
