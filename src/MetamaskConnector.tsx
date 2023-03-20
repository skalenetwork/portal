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
 * @file MetamaskConnector.tsx
 * @copyright SKALE Labs 2023-Present
*/

import React, { useEffect } from 'react';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import WalletIcon from '@mui/icons-material/Wallet';
import IconButton from '@mui/material/IconButton';

import InstallDesktopIcon from '@mui/icons-material/InstallDesktop';

import BridgePaper from './components/BridgePaper';

import enkryptLogo from './enkrypt.png';
import metamaskLogo from './metamask.png';
import { Collapse } from '@mui/material';


export default function MetamaskConnector(props: any) {

    const [ethereumInjected, setEthereumInjected] = React.useState<boolean>(false);

    useEffect(() => {
        setEthereumInjected(!!window.ethereum);
    }, [window.ethereum]);

    function getConnectBtnText() {
        if (!ethereumInjected) {
            return 'Install compatible wallet';
        }
        if (props.connectionError) {
            if (props.connectionError.code === -32002) return 'Connection already requested, please check your wallet';
            return props.connectionError.message;
        }
        return 'Click here to connect wallet';
    }

    return (
        <Container maxWidth="sm" className=''>
            <div className='mp__flex mp__flexCentered mp__fullHeight'>
                <div className='fullWidth'>
                    <BridgePaper rounded>
                        <div>
                            <div className='mp__flex mp__flexCenteredVert mp__margBott10'>
                                <div className='mp__flex mp__margRi5 mp__maregLeft10'>
                                    <WalletIcon />
                                </div>
                                <div className='mp__flex'>
                                    <h4 className="mp__flex mp__noMarg">Supported wallets</h4>
                                </div>
                            </div>
                            <BridgePaper rounded gray>
                                <div className='mp__flex'>
                                    <div className='mp__margBott15'>
                                        <div className='br__transactionDataIcon mp__flex mp__flexCentered br__action_wallet'>
                                            <img src={metamaskLogo} />
                                        </div>
                                    </div>
                                    <div className='mp__margLeft20 mp__flexGrow mp__flex'>
                                        <div>
                                            <p className='mp__p mp__p2 capitalize whiteText'>MetaMask</p>
                                            <p className='mp__p mp__p3'>The crypto wallet for Defi, Web3 Dapps and NFTs</p>
                                        </div>
                                    </div>
                                    <div>
                                        {!ethereumInjected ? (<IconButton
                                            id="basic-button"
                                            href='https://metamask.io/'
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className='mp__margLeft10 moreBtn br__openExplorerBtn'
                                            color='primary'
                                        >
                                            <InstallDesktopIcon />
                                        </IconButton>) : null}
                                    </div>
                                </div>
                                <div className='mp__flex'>
                                    <div className=''>
                                        <div className='br__transactionDataIcon mp__flex mp__flexCentered br__action_wallet'>
                                            <img src={enkryptLogo} />
                                        </div>
                                    </div>
                                    <div className='mp__margLeft20 mp__flexGrow mp__flex'>
                                        <div>
                                            <p className='mp__p mp__p2 capitalize whiteText'>Enkrypt</p>
                                            <p className='mp__p mp__p3'>Support for Enkrypt is in beta</p>
                                        </div>
                                    </div>
                                    <div>
                                        {!ethereumInjected ? (<IconButton
                                            id="basic-button"
                                            href='https://www.enkrypt.com/'
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className='mp__margLeft10 moreBtn br__openExplorerBtn'
                                            color='primary'
                                        >
                                            <InstallDesktopIcon />
                                        </IconButton>) : null}
                                    </div>
                                </div>
                            </BridgePaper>
                        </div>
                        <Button
                            onClick={props.connectMetamask}
                            className='mp__btnConnect mp__margTop20'
                            variant="contained"
                            disabled={!ethereumInjected || props.connectionError}
                        >
                            <h3 className='mp__btnChainBig'>{getConnectBtnText()}</h3>
                        </Button>
                        <Collapse in={props.connectionError}>
                            <Button
                                onClick={props.connectMetamask}
                                className='mp__margTop20 bridge__btn fullWidth'
                                variant="text"
                            >
                                Try again
                            </Button>
                        </Collapse>

                    </BridgePaper>
                </div>
            </div >
        </Container>
    )
}
