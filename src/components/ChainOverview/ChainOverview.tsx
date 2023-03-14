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
 * @file ChainOverview.js
 * @copyright SKALE Labs 2022-Present
*/

import React, { useEffect } from 'react';
import { Link } from "react-router-dom";

import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid';

import { CHAINS_META, DEFAULT_ERC20_DECIMALS } from '../../core/constants';
import { getBalance, initChainWeb3, initERC20Token } from '../../core/tokens';
import { fromWei } from '../../core/convertation';

import { getChainName, iconPath, getChainIcon } from '../ActionCard/helper';


const objectMap = (obj: any, fn: any) =>
  Object.fromEntries(
    Object.entries(obj).map(
      ([k, v], i) => [k, fn(v, k, i)]
    )
  )


export default function ChainOverview(props: any) {

  const [web3, setWeb3] = React.useState<Web3>();
  const [tokens, setTokens] = React.useState<any>();
  const [tokenContracts, setTokenContracts] = React.useState<any>();
  const [tokenBalances, setTokenBalances] = React.useState<any>({});
  const [updateBalanceFlag, setUpdateBalanceFlag] = React.useState<boolean>(false);

  useEffect(() => {
    const tokensArr = Object.keys(props.chain.chains).map((toChain: any) => { return props.chain.chains[toChain].tokens });
    let tokensMap = {};
    for (let i = 0; i < tokensArr.length; i++) {
      tokensMap = { ...tokensMap, ...tokensArr[i] };
    }
    setTokens(tokensMap);
    setWeb3(initChainWeb3(props.chainName));
    let balanceUpdateTimer = setInterval(() => setUpdateBalanceFlag(!updateBalanceFlag), 10 * 1000);
    return () => {
      clearInterval(balanceUpdateTimer);
    };
  }, []);

  useEffect(() => {
    if (!web3) return;
    setTokenContracts(objectMap(
      tokens,
      (_: string, key: any) => initERC20Token(web3, tokens[key].address)
    ));
  }, [web3, tokens]);

  useEffect(() => {
    if (!tokenContracts || !web3) return;
    updateTokenBalances();
  }, [updateBalanceFlag]);


  interface BalancesMap { [token: string]: any; }

  async function updateTokenBalances() {
    const balances: BalancesMap = {};
    for (let token in tokenContracts) {
      const balance = await getTokenBalance(token, tokenContracts[token]);
      balances[token] = balance;
    }
    setTokenBalances(balances);
  }

  async function getTokenBalance(token: string, tokenContract: Contract) {
    const tokenInfo = tokens[token];
    const decimals = tokenInfo && tokenInfo.decimals ? tokenInfo.decimals : DEFAULT_ERC20_DECIMALS;
    const balanceWei = await getBalance(web3, tokenContract, props.address, props.chainName);
    return fromWei(balanceWei as string, decimals);
  }

  let url = `/bridge/transfer/${props.chainName}`;

  if (props.chain.app || props.chain.app) {
    url += '?';
  }
  if (props.chain.app) {
    url += `from-app=${props.chain.app}`;
  }


  if (!tokens) return null;
  return (
    <div>
      <div className='mp__flexCentered'>
        <div className='mp__flex' >
          <div className='mp__flex'>
            {getChainIcon(props.chainName as string, true, props.chain.app)}
          </div>
          <div className='mp__flex mp__margLeft5'>
            <p className="schain-name mp__noMarg mp__flex mp__flexCentered">
              {getChainName(CHAINS_META, props.chainName, props.chain.app)}
            </p>
          </div>
        </div>
        <div className='mp__margBott20 mp__margTop10 mp__margRi20 br__paper br__paperRounded ' style={{ background: '#2a2a2a' }}>
          <div className=''>
            <Grid container spacing={0}>
              {Object.keys(tokens).map((token: any, index: number) => (
                <Grid md={6}>
                  <div className='mp__flex mp__margBott10' key={index}>
                    <div className='mp__flex'>
                      <img className='mp__iconToken mp__margRi10' src={iconPath(token)} />
                      {tokenBalances[token] ? (<p className="mp__p mp__p2 whiteText mp__noMarg mp__flex mp__flexCentered uppercase">
                        {tokenBalances[token] ? tokenBalances[token].substring(0, 7) : null} {token}
                      </p>) : <Skeleton variant="text" width={100} />}
                    </div>
                  </div>
                </Grid>
              ))}
            </Grid>
            <Link to={url} className='undec'>
              <Button
                onClick={() => { }}
                variant="contained"
                className='mp__margTop20 bridge__btn bridge__transferBtn'
                size='large'
              >
                Transfer
              </Button>
            </Link >
          </div>
        </div>

      </div>
    </div>
  );
}
