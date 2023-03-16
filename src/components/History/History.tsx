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
 * @file History.ts
 * @copyright SKALE Labs 2023-Present
*/

import debug from 'debug';
import { useState, useEffect } from "react";

import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import { getTransferHistory, clearTransferHistory } from '../../core/transferHistory';
import TransferData from '../TransferData';


debug.enable('*');
const log = debug('bridge:components:History');


export default function History(props: any) {

    const [transferHistory, setTransferHistory] = useState<Array<any>>(getTransferHistory());

    useEffect(() => {
        const handleStorageChange = (e: any) => {
            setTransferHistory(getTransferHistory());
        };
        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    return (<Container maxWidth="md">
        <Stack spacing={2}>
            <div className='mp__flex mp__flexCenteredVert'>
                <div className='mp__flex'>
                    <h2 className="mp__flex mp__noMarg">Transfers History</h2>
                </div>
            </div>
            <p className='mp__noMarg mp__p mp__p4'>
                View your transfers history
            </p>
            {transferHistory.slice().reverse().map((transferData: any, index: number) => (
                <TransferData key={index} transferData={transferData} />
            ))}

            {transferHistory.length === 0 ? (<div>
                <p className='mp__margTop40 mp__textCentered mp__p mp__p2'>
                    🏗️ No past transfers just yet
                </p>
            </div>) : (<div className='mp__textCentered'>
                <Button
                    onClick={() => {
                        clearTransferHistory();
                        setTransferHistory(getTransferHistory());
                    }}
                    startIcon={<ClearAllIcon />}
                    variant='text'
                    className='mp__margTop20 bridge__btn'
                    size='large'
                >
                    Clear transfers history
                </Button></div>)}
        </Stack>
    </Container>)
}