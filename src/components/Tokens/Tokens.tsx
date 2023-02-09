
import Chip from '@mui/material/Chip';
import { iconPath } from '../ActionCard/helper';

import CHAINS from '../../chainsData.json';


export default function Tokens(props: any) {
    const chainsData = CHAINS as any;
    const from: string = props.from;
    const to: string = props.to;
    return (<div className='mp__flex mp__margTop10'>
        {Object.keys(chainsData[from][to].tokens).map((token: any, index: number) => (
            <div key={token} className={'mp__margRi5 ' + (props.token === token ? 'selectedToken' : '')}>
                <Chip
                    label={token}
                    onClick={() => { props.setToken(token) }}
                    variant="filled"
                    clickable
                    className='mp__margRi5 mp__chipToken'
                    size='medium'
                    icon={<img className='mp__iconTokenBtn' src={iconPath(token)} />}
                    disabled={props.loading}
                />
            </div>
        ))}
        <div className='mp__flex mp__flexGrow'></div>
    </div>)
}