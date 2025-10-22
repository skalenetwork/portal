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
 * @file Onramp.tsx
 * @copyright SKALE Labs 2024-Present
 */

import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'

import { constants } from '@/core'
import {
  cmn,
  cls,
  SkPaper,
  MetaportCore,
  useWagmiAccount,
  contracts,
  Tile
} from '@skalenetwork/metaport'
import { TransakConfig, Transak } from '@transak/transak-sdk'

import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded'
import HardwareRoundedIcon from '@mui/icons-material/HardwareRounded'

import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'

import { META_TAGS } from '../core/meta'

import TokenBalanceTile from '../components/TokenBalanceTile'
import ConnectWallet from '../components/ConnectWallet'
import Message from '../components/Message'
import SkPageInfoIcon from '../components/SkPageInfoIcon'
import { TRANSAK_STAGING_ENV, TRANSAK_API_KEY, DISABLE_TRANSAK } from '../core/constants'

const MOUNT_ID = 'transakMount'
const NETWORK_NAME = 'skale'

export default function Onramp(props: { mpc: MetaportCore }) {
  const [transak, setTransak] = useState<Transak | undefined>()
  const { address } = useWagmiAccount()

  const chain = contracts.paymaster.getPaymasterChain(props.mpc.config.skaleNetwork)
  const isProd =
    props.mpc.config.skaleNetwork === constants.MAINNET_CHAIN_NAME && !TRANSAK_STAGING_ENV

  if (DISABLE_TRANSAK)
    return (
      <Container maxWidth="md">
        <Tile
          value="The SKALE On-ramp is currently unavailable for maintenance."
          text="Temporary unavailable"
          icon={<ErrorRoundedIcon />}
          color="warning"
          className="mt-5"
        />
      </Container>
    )

  if (!chain)
    return (
      <Container maxWidth="sm">
        <Tile
          value="Onramp is not available for this network"
          text="Error occurred"
          icon={<ErrorRoundedIcon />}
          color="warning"
          className="mt-5"
        />
      </Container>
    )

  if (!TRANSAK_API_KEY)
    return (
      <Container maxWidth="sm">
        <Tile
          value="Need to set Transak API key"
          text="Error occurred"
          icon={<ErrorRoundedIcon />}
          color="warning"
          className="mt-5"
        />
      </Container>
    )

  function initTransak() {
    if (transak) {
      transak.cleanup()
    }
    const transakConfig: TransakConfig = {
      apiKey: TRANSAK_API_KEY,
      environment: isProd ? Transak.ENVIRONMENTS.PRODUCTION : Transak.ENVIRONMENTS.STAGING,
      containerId: MOUNT_ID,
      defaultNetwork: NETWORK_NAME,
      network: NETWORK_NAME,
      themeColor: '1B9F52',
      exchangeScreenTitle: 'Transfer to SKALE',
      colorMode: 'DARK',
      backgroundColors: ['#141414', '#303030', '#1a1a1a'],
      borderColors: ['#202020'],
      walletAddress: address
    }

    const moundDiv = document.getElementById(MOUNT_ID)
    if (moundDiv && moundDiv.children.length === 0) {
      let transakInstance = new Transak(transakConfig)
      transakInstance.init()
      setTransak(transakInstance)
    }
  }

  useEffect(() => {
    initTransak()
  }, [address])

  return (
    <Container maxWidth="sm">
      <Helmet>
        <title>{META_TAGS.bridge.title}</title>
        <meta name="description" content={META_TAGS.onramp.description} />
        <meta property="og:title" content={META_TAGS.onramp.title} />
        <meta property="og:description" content={META_TAGS.onramp.description} />
      </Helmet>
      <Stack spacing={0}>
        <div className="flex items-center">
          <div className="flex-grow">
            <h2 className={cls(cmn.nom)}>On-ramp</h2>
            <p className={cls(cmn.nom, cmn.p, text-sm, cmn.pSec)}>
              Transfer your assets to SKALE Europa Hub
            </p>
          </div>
          <SkPageInfoIcon meta_tag={META_TAGS.onramp} />
        </div>
        {!isProd ? (
          <Message
            className="mt-5"
            text="You are using staging environment"
            icon={<HardwareRoundedIcon />}
            type="warning"
          />
        ) : (
          <div> </div>
        )}
        {address ? (
          <SkPaper gray className="mt-5">
            <div id="transakMount" className={cls('transakFrame', 'mt-1.25')}></div>
            <TokenBalanceTile mpc={props.mpc} chain={chain} />
          </SkPaper>
        ) : (
          <ConnectWallet className="mt-5" />
        )}
      </Stack>
    </Container>
  )
}
