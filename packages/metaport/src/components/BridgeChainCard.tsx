/**
 * @license
 * SKALE portal
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
 * @file BridgeChainCard.tsx
 * @copyright SKALE Labs 2025-Present
 */


import { type types, metadata } from '@/core'
import { cmn, cls, styles } from '../core/css'
import SkPaper from './SkPaper'

import ChainIcon from './ChainIcon';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

interface ChainCardProps {
  skaleNetwork: types.SkaleNetwork;
  chainName: string;
  chainsMeta: types.ChainsMetadataMap;
  onClick: () => void;
  disabled: boolean;
  from: boolean;
}

export default function BridgeChainCard(props: ChainCardProps) {
  const { skaleNetwork, chainName, chainsMeta, onClick, disabled } = props;
  const chainMeta = chainsMeta[chainName];
  const chainDescription = chainMeta ? chainMeta.description : 'Ethereum is a global, decentralized platform for money and new kinds of applications.';
  const backgroundColor = disabled ? '#a1a1a133' : metadata.chainBg(chainsMeta, chainName); 
  const firstSentence = chainDescription.split('.')[0] + (chainDescription.includes('.') ? '.' : '');

  const disabledText = props.from ? 'Destination chain' : 'Source chain';

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const iconSize = isSmallScreen ? 'lg' : 'xl';

  return (
    <div onClick={disabled ? undefined : onClick}>
    <SkPaper
      gray={disabled} 
      className={cls(cmn.flex, cmn.flexc, cmn.mtop10, [cmn.pointer, !disabled], [styles.disabledCard, disabled])}
      background={backgroundColor}
      
    >
      <div className={cls(cmn.mbott20, cmn.mtop20,)} style={{ width: '100%', height: '100%' }}>
        <div
          className={cls(cmn.mbott20, cmn.mtop20,cmn.bordRad)} >
        <div className={cls(cmn.flex, cmn.flexcv)}></div>
        <div
          className={cls(cmn.bordRad, cmn.flex, cmn.flexcv)}
           style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}
            >
          <ChainIcon
            skaleNetwork={skaleNetwork}
            chainName={chainName}
            size={iconSize}
          />
        </div>
        </div>
      
        <p
          className={cls(cmn.p, cmn.pPrim, cmn.p600, cmn.p1, cmn.pCent)}
        >
          {metadata.getAlias(chainsMeta, chainName, undefined, true)}
        </p>

        {disabled && (
        <div className={cls(cmn.flex, cmn.mtop10)} style={{ marginBottom: '18px'}}>
          <div className={cls(cmn.flexg)}></div>
        <SkPaper gray className={cls(cmn.nop,)}>
                    <p
                      className={cls(
                        cmn.p,
                        cmn.p4,
                        cmn.p600,
                        cmn.pSec,
                        cmn.mtop5,
                        cmn.mbott5,
                        cmn.mleft10,
                        cmn.mri10,
                        cmn.pWrap
                      )}
                    >
                      {disabledText}
                      </p>
                  </SkPaper>
                  <div className={cls(cmn.flexg)}></div>
        </div>
       )}
       {!disabled && (
        <p
          className={cls(cmn.p, cmn.pSec, cmn.p4, cmn.pCent)}
        >
          {firstSentence}
        </p>
      )}
      </div>
    </SkPaper>
    </div>
  );
}

