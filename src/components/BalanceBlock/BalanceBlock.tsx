import { ReactElement } from "react";
import Skeleton from '@mui/material/Skeleton';
import { clsNames } from "../../core/helper";


export default function BalanceBlock(props: {
    icon: ReactElement,
    disabled?: boolean,
    balance: string | undefined,
    token: string | undefined,
    chainName: string,
    margTop?: boolean
}) {
    const displayedBalance = props.balance ? props.balance.substring(0, 8) : null;
    const displayedToken = props.token ? props.token.toUpperCase() : null;

    return (<div className={clsNames(
        'br__balanceCard',
        ['mp__margTop20', props.margTop]
    )}>
        <div className='mp__flex mp__flexCenteredVert'>
            <div className='mp__margRi5 mp__flex chainIcon'>
                {props.icon}
            </div>
            <p className={clsNames(
                'mp__noMarg',
                'mp__p',
                'mp__p3',
                ['mp__disabledP', props.disabled]
            )}>
                Balance on {props.chainName}
            </p>
        </div>
        <div className='mp__flex mp__flexCenteredVert mp__margTop5'>
            {props.balance ? (<p className={clsNames(
                'mp__noMarg',
                'mp__p',
                'mp__p2',
                'whiteText',
                ['mp__disabledP', props.disabled]
            )}>
                {displayedBalance} {displayedToken}
            </p>) : <Skeleton width='70px' />}
        </div>
    </div>)
}