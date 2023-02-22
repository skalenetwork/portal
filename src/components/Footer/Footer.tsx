import debug from 'debug';
import { Link } from "react-router-dom";

debug.enable('*');
const log = debug('bridge:components:Faq');


export default function Footer(props: any) {
    return (<div className='bridgeFooter'>
        <div className='mp__margBott10 mp__margTop10 mp__margRi10 mp__flex'>
            <div className='mp__flex mp__flexGrow'></div>
            <div className='mp__flex'>
                <Link to="/other/terms-of-service" className="undec fullWidth">
                    <p className='mp__margRi10 mp__p mp__p5'>
                        Terms of service
                    </p>
                </Link>
            </div>
            <div className='mp__flex'>
                <a className="undec fullWidth" target="_blank" href='https://skale.space/'>
                    <p className='mp__margRi10 mp__p mp__p5'>
                        Main website
                    </p>
                </a>
            </div>
            <div className='mp__flex'>
                <a className="undec fullWidth" target="_blank" href='https://docs.skale.network/'>
                    <p className='mp__margRi10 mp__p mp__p5'>
                        Docs portal
                    </p>
                </a>
            </div>
            <div className='mp__flex mp__flexGrow'></div>
        </div>
    </div>)
}