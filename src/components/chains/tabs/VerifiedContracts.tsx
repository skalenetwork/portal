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
 * @file VerifiedContracts.tsx
 * @copyright SKALE Labs 2023-Present
 */

import { useState, useEffect } from 'react'
import { type MetaportCore, SkPaper, explorer } from '@skalenetwork/metaport'
import Button from '@mui/material/Button'

import ExpandCircleDownRoundedIcon from '@mui/icons-material/ExpandCircleDownRounded'
import HourglassBottomRoundedIcon from '@mui/icons-material/HourglassBottomRounded'

import LinkSurface from '../../LinkSurface'

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
      setContracts([...contracts, ...contractsJson.result])
      setAllLoaded(contractsJson.result.length === 0)
    } catch {
      console.error('Failed to fetch verified contracts!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SkPaper gray className="mt-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {contracts.map((contract: any, index: number) => (
          <div key={index} className="col-span-1">
            <LinkSurface
              className="h-full"
              title={contract.ContractName}
              value={contract.Address}
              url={explorer.addressUrl(props.explorerUrl, contract.Address)}
            />
          </div>
        ))}
      </div>
      {!loading && contracts.length === 0 ? (
        <p
          className="text-base font-bold text-secondary w-full mt-5 mb-5 text-center">
          No verified contracts
        </p>
      ) : (
        <div></div>
      )}
      {!allLoaded ? (
        <Button
          onClick={() => {
            setPage((prevPage) => prevPage + 1)
          }}
          color="primary"
          size="small"
          className="styles.btnAction mt-5"
          startIcon={loading ? <HourglassBottomRoundedIcon /> : <ExpandCircleDownRoundedIcon />}
          disabled={loading}
        >
          {loading ? 'Loading contracts' : 'Load more contracts'}
        </Button>
      ) : (
        <div></div>
      )}
    </SkPaper>
  )
}
