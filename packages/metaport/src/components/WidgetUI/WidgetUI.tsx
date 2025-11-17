/**
 * @license
 * SKALE Metaport
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
/**
 * @file WidgetUI.ts
 * @copyright SKALE Labs 2023-Present
 */

import React from 'react'
import { types } from '@/core'

import Collapse from '@mui/material/Collapse'
import Fab from '@mui/material/Fab'
import CloseIcon from '@mui/icons-material/Close'

import skaleLogo from './skale_logo_short.svg'

import { useUIStore } from '../../store/Store'
import { useMetaportStore } from '../../store/MetaportStore'
import SkPaper from '../SkPaper'

import WidgetBody from '../WidgetBody'

import { styles } from '../../core/css'

import ErrorMessage from '../ErrorMessage'

export function WidgetUI(props: { config: types.mp.Config }) {
  const metaportTheme = useUIStore((state) => state.theme)
  const isOpen = useUIStore((state) => state.open)
  const setOpen = useUIStore((state) => state.setOpen)
  const errorMessage = useMetaportStore((state) => state.errorMessage)

  const handleClick = (_: React.MouseEvent<HTMLElement>) => {
    setOpen(isOpen ? false : true)
  }

  let fabTop: boolean = false
  let fabLeft: boolean = false
  if (metaportTheme) {
    fabTop = metaportTheme.position.bottom === 'auto'
    fabLeft = metaportTheme.position.right === 'auto'
  }

  const fabButton = (
    <div className="flex items-center">
      <div className={fabLeft ? null : 'flex-grow'}></div>
      <div className="flex items-center">
        <Fab
          color={isOpen ? 'secondary' : 'primary'}
          className={props.config.openButton ? styles.skaleBtn : styles.skaleBtnHidden}
          aria-label="add"
          type="button"
          onClick={handleClick}
        >
          {isOpen ? (
            <CloseIcon
              style={{
                color: metaportTheme.mode == 'dark' ? 'white' : 'black'
              }}
            />
          ) : (
            <img className={styles.skaleLogoSm} src={skaleLogo} />
          )}
        </Fab>
      </div>
    </div>
  )

  return (
    <div
      className={styles.imaWidgetBody}
      style={metaportTheme ? { ...metaportTheme.position, zIndex: metaportTheme.zIndex } : null}
    >
      <div className={props.config.openButton ? 'mb-5' : null}>
        {fabTop ? fabButton : null}
      </div>
      <Collapse in={isOpen}>
        <SkPaper className={`${styles.popper} ${styles.contentHeight}`}>
          <Collapse in={!!errorMessage}>
            <ErrorMessage errorMessage={errorMessage} />
          </Collapse>
          <Collapse in={!errorMessage} className={styles.widgetContent}>
            <WidgetBody config={props.config} />
          </Collapse>
        </SkPaper>
      </Collapse>
      <div className={props.config.openButton ? 'mt-5' : null}>{fabTop ? null : fabButton}</div>
    </div>
  )
}

export default WidgetUI
