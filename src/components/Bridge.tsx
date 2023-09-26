/**
 * @license
 * SKALE bridge-ui
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
 * @file Bridge.tsx
 * @copyright SKALE Labs 2023-Present
*/

import { useEffect, useState } from 'react';
import { useSearchParams } from "react-router-dom";

import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import GradeRoundedIcon from '@mui/icons-material/GradeRounded';

import Message from './Message';
import BridgeBody from './BridgeBody';

import { CHAINS_META, cls, cmn, dataclasses, useMetaportStore } from '@skalenetwork/metaport';


interface TokenParams {
  keyname: string | null
  type: dataclasses.TokenType | null
}

function getEmptyTokenParams(): TokenParams {
  return { keyname: null, type: null }
}


export default function Bridge() {

  let [searchParams, setSearchParams] = useSearchParams()
  const [tokenParams, setTokenParams] = useState<TokenParams>(getEmptyTokenParams())

  const mpc = useMetaportStore((state) => state.mpc)

  const chainName1 = useMetaportStore((state) => state.chainName1)
  const chainName2 = useMetaportStore((state) => state.chainName2)
  const setChainName1 = useMetaportStore((state) => state.setChainName1)
  const setChainName2 = useMetaportStore((state) => state.setChainName2)

  const appName1 = useMetaportStore((state) => state.appName1)
  const appName2 = useMetaportStore((state) => state.appName2)
  const setAppName1 = useMetaportStore((state) => state.setAppName1)
  const setAppName2 = useMetaportStore((state) => state.setAppName2)

  const token = useMetaportStore((state) => state.token)
  const tokens = useMetaportStore((state) => state.tokens)
  const setToken = useMetaportStore((state) => state.setToken)

  useEffect(() => {
    const params: any = {
      from: chainName1,
      to: chainName2,
      token: token?.keyname,
      type: token?.type
    }
    if (appName1) params['from-app'] = appName1
    if (appName2) params['to-app'] = appName2
    setSearchParams(params)
  }, [chainName1, chainName2, appName1, appName2, token])

  useEffect(() => {
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const fromApp = searchParams.get('from-app')
    const toApp = searchParams.get('to-app')
    const keyname = searchParams.get('token')
    const type = searchParams.get('type')
    const chainMeta = CHAINS_META[mpc.config.skaleNetwork];
    if (from) {
      if (mpc.config.chains.includes(from)) setChainName1(from);
      const apps = fromApp && chainMeta && chainMeta[from] && chainMeta[from].apps;
      if (apps && apps[fromApp]) setAppName1(fromApp);
    }
    if (to) {
      if (mpc.config.chains.includes(to)) setChainName2(to);
      const apps = toApp && chainMeta && chainMeta[to] && chainMeta[to].apps;
      if (apps && apps[toApp]) setAppName2(toApp);
    }
    if (keyname) setTokenParams({ keyname: keyname, type: type as dataclasses.TokenType })
  }, [])

  useEffect(() => {
    if (tokens && tokenParams.type && tokenParams.keyname && tokens[tokenParams.type] &&
      tokens[tokenParams.type][tokenParams.keyname]) {
      setToken(tokens[tokenParams.type][tokenParams.keyname])
      setTokenParams(getEmptyTokenParams())
    }
  }, [tokenParams, tokens])

  return (
    <Container maxWidth="sm">
      <Stack spacing={0}>
        <div className={cls(cmn.flex, cmn.mbott20)}>
          <h2 className={cls(cmn.nom)}>Transfer</h2>
        </div>
        <div>
          <Message
            className={cmn.mbott20}
            text='Zero Gas Fees between SKALE Chains'
            icon={<GradeRoundedIcon color="primary" />}
          />
          <BridgeBody />
        </div>
      </Stack>
    </Container>)
}