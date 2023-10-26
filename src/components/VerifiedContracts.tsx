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
 * @file VerifiedContracts.tsx
 * @copyright SKALE Labs 2023-Present
 */

import { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import ExpandCircleDownRoundedIcon from '@mui/icons-material/ExpandCircleDownRounded'
import HourglassBottomRoundedIcon from '@mui/icons-material/HourglassBottomRounded'
import { cmn, cls, styles, MetaportCore } from '@skalenetwork/metaport'

import LinkSurface from './LinkSurface'

const BLOCKSCOUT_OFFSET = 20

export default function VerifiedContracts(props: {
  schainName: string
  mpc: MetaportCore
  explorerUrl: string
}) {
  const [contracts, setContracts] = useState<any[]>([])
  const [page, setPage] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(true)
  const [allLoaded, setAllLoaded] = useState<boolean>(false)

  useEffect(() => {
    loadContracts()
  }, [])

  useEffect(() => {
    loadContracts()
  }, [page])

  function getApiParams() {
    return `/api?module=contract&action=listcontracts&filter=1&page=${page}&offset=${BLOCKSCOUT_OFFSET}`
  }

  async function loadContracts() {
    setLoading(true)
    try {
      const response = await fetch(`${props.explorerUrl}${getApiParams()}`)
      const contractsJson = await response.json()
      setContracts([...contracts, ...contractsJson['result']])
      setAllLoaded(contractsJson['result'].length === 0)
    } catch {
      console.error('Failed to fetch verified contracts!')
    } finally {
      setLoading(false)
    }
  }

  function addressUrl(address: string) {
    return `${props.explorerUrl}/address/${address}`
  }

  return (
    <div>
      <Grid container spacing={2} className={cls(cmn.full)}>
        {contracts.map((contract: any, index: number) => (
          <Grid key={index} item lg={6} md={6} sm={6} xs={12}>
            <LinkSurface
              className={cls(styles.fullHeight)}
              title={contract['ContractName']}
              value={contract['Address']}
              url={addressUrl(contract['Address'])}
            />
          </Grid>
        ))}
      </Grid>
      {!loading && contracts.length === 0 ? (
        <p
          className={cls(
            cmn.p,
            cmn.p2,
            cmn.p700,
            cmn.pSec,
            cmn.fullWidth,
            cmn.mtop20,
            cmn.mbott20,
            cmn.pCent
          )}
        >
          No verified contracts
        </p>
      ) : null}
      {!allLoaded ? (
        <Button
          onClick={() => {
            setPage((prevPage) => prevPage + 1)
          }}
          color="primary"
          size="small"
          className={cls(styles.btnAction, cmn.mtop20)}
          startIcon={loading ? <HourglassBottomRoundedIcon /> : <ExpandCircleDownRoundedIcon />}
          disabled={loading}
        >
          {loading ? 'Loading contracts' : 'Load more contracts'}
        </Button>
      ) : null}
    </div>
  )
}
