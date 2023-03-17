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
 * @file TransferData.ts
 * @copyright SKALE Labs 2023-Present
*/

import { interfaces } from '@skalenetwork/metaport';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import BridgePaper from '../BridgePaper';
import TransactionData from '../TransactionData';

import { getChainName, iconPath, getChainIcon } from '../ActionCard/helper';
import { CHAINS_META } from '../../core/constants';


export default function TransferData(props: any) {

    const trReq: interfaces.TransferParams = props.transferData.trReq;

    if (!trReq.chains) return (<div></div>);

    const fromChainName = getChainName(CHAINS_META, trReq.chains[0], trReq.fromApp);
    const toChainName = getChainName(CHAINS_META, trReq.chains[1], trReq.toApp);

    const fromChainIcon = getChainIcon(trReq.chains[0] as string, true, trReq.fromApp);
    const toChainIcon = getChainIcon(trReq.chains[1] as string, true, trReq.toApp);


    return (<div className='br__transferData'>
        <BridgePaper rounded>
            <div className='mp__flex mp__flexCenteredVert mp__margBott10'>
                <div className='mp__flex mp__margRi5 mp__maregLeft10'>
                    {fromChainIcon}
                </div>
                <div className='mp__flex'>
                    <h4 className="mp__flex mp__noMarg">{fromChainName}</h4>
                </div>
                <div className='mp__flex mp__margLeft10'>
                    <ArrowForwardIcon />
                </div>
                <div className='mp__flex mp__margRi5 mp__margLeft10'>
                    {toChainIcon}
                </div>
                <div className='mp__flex mp__flexGrow'>
                    <h4 className="mp__flex mp__noMarg">{toChainName}</h4>
                </div>
                {
                    props.transferData.address ? (<div className='mp__flex mp__flexCenteredVert mp__margRi10'>
                        <Jazzicon diameter={20} seed={jsNumberForAddress(props.transferData.address)} />
                        <div className='mp__flex mp__margRi10 mp__margLeft5'>
                            <h5 className="mp__flex mp__noMarg">
                                {props.transferData.address.substring(0, 5) + '...' + props.transferData.address.substring(props.transferData.address.length - 3)}
                            </h5>
                        </div>
                        <h5 className="mp__flex mp__noMarg">
                            •
                        </h5>
                    </div>) : null
                }
                <div className='mp__flex'>
                    <img className='mp__iconToken mp__margRi10' src={iconPath(props.transferData.token)} />
                </div>
                <div className='mp__flex'>
                    <h5 className="mp__flex mp__noMarg uppercase bold">{props.transferData.trReq.amount} {props.transferData.token}</h5>
                </div>
            </div>
            <BridgePaper rounded gray>
                <div className='mp__margBottMin15'>
                    {props.transferData.transactionsHistory.map((transactionData: any) => (
                        <TransactionData key={transactionData.tx.transactionHash} transactionData={transactionData} />
                    ))}
                </div>
            </BridgePaper>
        </BridgePaper>
    </div>)
}
