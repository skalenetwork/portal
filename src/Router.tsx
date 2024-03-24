import './App.scss'

import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useLocation, Routes, Route, useSearchParams } from 'react-router-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

import {
  useMetaportStore,
  PROXY_ENDPOINTS,
  type MetaportState,
  useWagmiAccount,
  useWagmiWalletClient,
  useWagmiSwitchNetwork,
  walletClientToSigner,
  enforceNetwork,
  interfaces
} from '@skalenetwork/metaport'

import Bridge from './pages/Bridge'
import Faq from './pages/Faq'
import Terms from './pages/Terms'
import Network from './pages/Chains'
import Schain from './pages/Schain'
import Stats from './pages/Stats'
import Apps from './pages/Apps'
import App from './components/App'
import History from './pages/History'
import Portfolio from './pages/Portfolio'
import Admin from './pages/Admin'
import Start from './pages/Start'
import Staking from './pages/Staking'
import StakeValidator from './pages/StakeValidator'
import StakeAmount from './pages/StakeAmount'
import Validators from './pages/Validators'
import TermsModal from './components/TermsModal'

import { getHistoryFromStorage, setHistoryToStorage } from './core/transferHistory'
import { BRIDGE_PAGES, MAINNET_CHAIN_NAME } from './core/constants'
import { IValidator, ISkaleContractsMap, StakingInfoMap } from './core/interfaces'
import { getValidators } from './core/delegation/validators'
import Changelog from './pages/Changelog'
import { initContracts } from './core/contracts'
import { getStakingInfoMap } from './core/delegation/staking'

// import chainsJson from './chainsJson.json';

export default function Router() {
  const location = useLocation()
  const currentUrl = `${window.location.origin}${location.pathname}${location.search}`

  const [schains, setSchains] = useState<any[]>([])
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false)

  const [loadCalled, setLoadCalled] = useState<boolean>(false)
  const [sc, setSc] = useState<ISkaleContractsMap | null>(null)
  const [validators, setValidators] = useState<IValidator[]>([])
  const [si, setSi] = useState<StakingInfoMap>({ 0: null, 1: null, 2: null })

  const mpc = useMetaportStore((state: MetaportState) => state.mpc)
  const transfersHistory = useMetaportStore((state) => state.transfersHistory)
  const setTransfersHistory = useMetaportStore((state) => state.setTransfersHistory)

  const { address } = useWagmiAccount()
  const { data: walletClient } = useWagmiWalletClient()
  const { switchNetworkAsync } = useWagmiSwitchNetwork()

  const [searchParams, _] = useSearchParams()
  const addr = (searchParams.get('_customAddress') as interfaces.AddressType | undefined) ?? address

  const endpoint = PROXY_ENDPOINTS[mpc.config.skaleNetwork]

  useEffect(() => {
    setTransfersHistory(getHistoryFromStorage(mpc.config.skaleNetwork))
    initSkaleContracts()
  }, [])

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

  async function loadSchains() {
    const response = await fetch(`https://${endpoint}/files/chains.json`)
    const chainsJson = await response.json()
    const schains = []
    for (const chain of chainsJson) {
      schains.push(chain.schain)
    }
    setSchains(schains)
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
    setSi(await getStakingInfoMap(sc, addr))
  }

  function isBridgePage(): boolean {
    return BRIDGE_PAGES.some(
      (pathname) => location.pathname === pathname || location.pathname.includes(pathname)
    )
  }

  if (!termsAccepted && isBridgePage()) {
    return (
      <TermsModal mpc={mpc} termsAccepted={termsAccepted} setTermsAccepted={setTermsAccepted} />
    )
  }

  return (
    <div>
      <Helmet>
        <meta property="og:url" content={currentUrl} />
      </Helmet>
      <TransitionGroup>
        <CSSTransition key={location.pathname} classNames="fade" timeout={300} component={null}>
          <Routes>
            <Route index element={<Start />} />
            <Route path="bridge" element={<Bridge />} />
            <Route path="bridge">
              <Route path="history" element={<History />} />
            </Route>
            <Route path="portfolio" element={<Portfolio mpc={mpc} />} />
            <Route
              path="chains"
              element={<Network loadSchains={loadSchains} schains={schains} mpc={mpc} />}
            />
            <Route path="chains">
              <Route
                path=":name"
                element={<Schain loadSchains={loadSchains} schains={schains} mpc={mpc} />}
              />
            </Route>
            <Route path="apps" element={<Apps mpc={mpc} />} />
            <Route path="apps">
              <Route path=":name" element={<App />} />
            </Route>
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
                  mpc={mpc}
                  validators={validators}
                  loadValidators={loadValidators}
                  loadStakingInfo={loadStakingInfo}
                  sc={sc}
                  si={si}
                  address={addr}
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
                path="new/:delegationType/:id"
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
