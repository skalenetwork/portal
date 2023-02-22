import Tooltip from '@mui/material/Tooltip';

import { iconPath } from '../ActionCard/helper';
import CHAINS from '../../chainsData.json';


export default function TokenButton(props: any) {
    const chainsData = CHAINS as any;
    const from: string = props.from;
    const to: string = props.to;
    return (<div>
        {Object.keys(chainsData[from].chains[to].tokens).map((token: any, index: number) => (
            <Tooltip title={token} key={token}>
                <img className='mp__iconToken' src={iconPath(token)} />
            </Tooltip>
        ))}
    </div>)
}