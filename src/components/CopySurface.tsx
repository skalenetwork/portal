/**
 * @license
 * SKALE proxy-ui
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
 * @file CopySurface.tsx
 * @copyright SKALE Labs 2021-Present
*/

import React, { useState } from 'react';

import { CopyToClipboard } from 'react-copy-to-clipboard';

import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';
import ButtonBase from '@mui/material/ButtonBase';

import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';


export default function CopySurface(props: any) {
  const [copy, setCopied] = useState(false);

  const handleClick = () => {
    setCopied(true);
  };

  const handleClose = (_: any, reason: any) => {
    if (reason === 'clickaway') {
      return;
    }
    setCopied(false);
  };

  const action = (
    <React.Fragment>
      <IconButton
        // size="small"
        // aria-label="close"
        // color="inherit"
        // onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <div>
      <CopyToClipboard text={props.url}
        onCopy={handleClick}>
        <Tooltip title="Click to copy to clipboard">
          <ButtonBase className='copyBoard flex-container'>

            <div className="overflow-auto flex-container fl-centered-vert fl-grow">
              <code>
                {props.url}
              </code>
            </div>
            <div className="flex-container">
              <ContentCopyIcon className='copy-icon marg-left-10' />
            </div>
          </ButtonBase>
        </Tooltip>
      </CopyToClipboard>
      <Snackbar
        open={copy}
        autoHideDuration={6000}
        onClose={handleClose}
        message='URL copied to clipboard'
        action={action}
        // severity="success"
      />
    </div>

  );
}
