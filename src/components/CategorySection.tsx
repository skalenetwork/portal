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
 * @file CategorySection.tsx
 * @copyright SKALE Labs 2022-Present
*/

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import ChainCard from './ChainCard';


export default function CategorySection(props: any) {
  if (!props.schains || props.schains.length === 0) return;
  return (
    <div className="marg-top-40">
      <h3 className='card-header no-marg-top'>
        {props.category} ({props.schains.length})
      </h3>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          {props.schains.map((schain: any[]) => (
            <Grid key={schain[0]} className='fl-centered dappCard' item md={3} sm={6} xs={6}>
              <ChainCard skaleNetwork={props.skaleNetwork} schain={schain} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
}
