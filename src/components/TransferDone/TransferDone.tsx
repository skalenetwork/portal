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
 * @file TransferDone.tsx
 * @copyright SKALE Labs 2023-Present
*/

import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import RestartAltIcon from '@mui/icons-material/RestartAlt';
import LanguageIcon from '@mui/icons-material/Language';
import TollIcon from '@mui/icons-material/Toll';

import BridgePaper from '../BridgePaper';
import { iconPath, getChainWebsiteUrl } from '../ActionCard/helper';

import {
  CHAINS_META,
  MAINNET_CHAIN_NAME,
  SUCCESS_EMOJIS,
  METAPORT_CONFIG,
  ICONS_BASE_URL
} from '../../core/constants';

import { setMetamaskNetwork } from '../../core/network';
import { getRandom } from '../../core/helper';


export default function TransferDone(props: any) {

  const [emoji, setEmoji] = React.useState<string>();
  const [loading, setLoading] = React.useState<boolean>(false);

  useEffect(() => {
    setEmoji(getRandom(SUCCESS_EMOJIS));
  }, []);

  async function isIconAvailable(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.error('Error retrieving users:', error);
      return false;
    }
  }

  function getIconUrl() {
    return `${ICONS_BASE_URL}${props.token}.png`;
  }

  async function addToken() {
    setLoading(true);
    const tokenAddress = props.chainsData[props.toChain].chains[props.fromChain].tokens[props.token].address;
    const iconUrl = getIconUrl();
    try {
      await setMetamaskNetwork(
        METAPORT_CONFIG.skaleNetwork,
        props.toChain,
        METAPORT_CONFIG.mainnetEndpoint
      );
      const wasAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: tokenAddress,
            symbol: props.token.toUpperCase(),
            decimals: props.tokenDecimals,
            image: await isIconAvailable(iconUrl) ? iconUrl : undefined
          }
        }
      });
      if (wasAdded) {
        console.log('Token added');
      } else {
        console.log('Something went wrong');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const chainWebsiteUrl = getChainWebsiteUrl(CHAINS_META, props.to, props.toApp);

  return (
    <div className="mp__margTop20">
      <Grid container spacing={2} >
        <Grid item md={8} sm={12} xs={12}>
          <BridgePaper rounded gray fullHeight>
            <div className="mp__flex mp__flexCenteredVert">
              <h3 className="mp__flex  mp__noMarg">{emoji} You've successfully transferred</h3>
              <img
                className='mp__iconTokenTransferDone mp__flex mp__flexCenteredVert mp__margLeft10 mp__margRi5'
                src={iconPath(props.token)}
              />
              <h3 className="mp__flex  mp__noMarg">
                {props.amount} {props.token ? props.token.toUpperCase() : ''}
              </h3>
            </div>
            <p className='mp__margTop5 mp__p mp__p4'>
              Proceed to the dApp or go back to the transfer page.
            </p>
          </BridgePaper>
        </Grid>
        <Grid className='fl-centered' item md={4} sm={12} xs={12}>
          {props.balancesBlock}
        </Grid>
      </Grid>
      {chainWebsiteUrl ? <Button
        href={chainWebsiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        variant="contained"
        startIcon={<LanguageIcon />}
        className='mp__margTop20 mp__margRi10 bridge__btn'
        size='large'
      >
        Go to {props.toChainName}
      </Button> : null}
      {(props.to === MAINNET_CHAIN_NAME && props.token === 'eth') ? null : <Button
        onClick={addToken}
        disabled={loading}
        variant="contained"
        startIcon={<TollIcon />}
        className='mp__margTop20 mp__margRi10 bridge__btn'
        size='large'
      >
        {loading ? 'Adding token, check your wallet' : 'Add token'}
      </Button>}
      <Button
        onClick={() => {
          props.setActiveStep(0);
          props.setTransactionsHistory([]);
        }}
        startIcon={<RestartAltIcon />}
        variant={chainWebsiteUrl ? 'text' : 'contained'}
        className='mp__margTop20 bridge__btn'
        size='large'
      >
        Go back
      </Button>
    </div>
  );
}