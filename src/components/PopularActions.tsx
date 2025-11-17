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
 * MERCHANTABILITY and FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * @file PopularActions.tsx
 * @copyright SKALE Labs 2025-Present
 */

import { Link } from 'react-router-dom'

import StarIcon from '@mui/icons-material/Star'
import { useTheme } from '@mui/material/styles'

import { SkPaper } from '@skalenetwork/metaport'
import { types, metadata } from '@/core'

import Logo from './Logo'

export default function PopularActions(props: {
  skaleNetwork: types.SkaleNetwork
  chainsMeta: types.ChainsMetadataMap
  chainName: string
}) {
  const theme = useTheme()
  const shortAlias = metadata.getChainShortAlias(props.chainsMeta, props.chainName)

  const chainMeta = props.chainsMeta[props.chainName]

  const actions = metadata.getActions(props.chainsMeta, props.chainName)

  if (!actions) {
    return null
  }

  const getActionDescription = (action: types.ChainAction) => {
    if (action.description) {
      return action.description.split('.')[0] + '.'
    }

    const appMeta = chainMeta?.apps?.[action.app]
    const appDescription = appMeta?.description || 'Description not available'
    return appDescription.split('.')[0] + '.'
  }

  return (
    <div>
      <div className="pt-5 flex"></div>
      <div
        className="flex items-center mb-2.5 font-semibold"
        style={{ color: theme.palette.primary.main }}
      >
        <StarIcon color="primary" className="mr-2.5 mb-2.5" />
        Popular Actions
      </div>
      <div className="flex flex-row items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {
            actions.map((action) => (
              <div className="col-span-1">
                <Link
                  to={
                    chainMeta.apps?.[action.app].social?.website ||
                    `/ecosystem/${shortAlias}/${action.app}`
                  }
                  className="flex w-full"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SkPaper gray className="w-full hoverable" key={action.text}>
                    <div className="flex items-center">
                      <Logo
                        chainsMeta={props.chainsMeta}
                        skaleNetwork={props.skaleNetwork}
                        chainName={props.chainName}
                        appName={action.app}
                      />
                      <div>
                        <div
                          className="text-sm shortP font-bold text-primary ml-2.5 mr-2.5">
                          {action.text}
                        </div>
                        <div className="text-xs text-secondary-foreground/60 mr-2.5 ml-2.5">
                          {getActionDescription(action)}
                        </div>
                      </div>
                    </div>
                  </SkPaper>
                </Link >
              </div >
            ))
          }
        </div >
      </div >
    </div >
  )
}
