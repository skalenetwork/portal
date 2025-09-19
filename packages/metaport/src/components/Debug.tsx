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
 * @file Debug.ts
 * @copyright SKALE Labs 2023-Present
 */

import { useState, useEffect, useReducer } from 'react'
import { types } from '@/core'

import Grid from '@mui/material/Grid'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'

import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import ExpandRoundedIcon from '@mui/icons-material/ExpandRounded'

import { useCPStore } from '../store/CommunityPoolStore'
import { useMetaportStore } from '../store/MetaportStore'
import { cls, cmn, styles } from '../core/css'
import { Collapse } from '@mui/material'

const initialState = { queue: [] }

function reducer(state, action) {
  switch (action.type) {
    case 'enqueue':
      return { queue: [...state.queue, action.payload] }
    case 'dequeue':
      return { queue: state.queue.slice(1) }
    case 'empty':
      return { queue: [] }
    default:
      throw new Error()
  }
}

function useQueue() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const enqueue = (item) => {
    dispatch({ type: 'enqueue', payload: item })
  }

  const dequeue = () => {
    dispatch({ type: 'dequeue' })
  }

  const empty = () => {
    dispatch({ type: 'empty' })
  }

  return {
    queue: state.queue,
    enqueue,
    dequeue,
    empty
  }
}

function formatUTCTime() {
  const now = new Date()
  const hours = String(now.getUTCHours()).padStart(2, '0')
  const minutes = String(now.getUTCMinutes()).padStart(2, '0')
  const seconds = String(now.getUTCSeconds()).padStart(2, '0')
  const milliseconds = String(now.getUTCMilliseconds()).padStart(3, '0')
  return `${hours}:${minutes}:${seconds}.${milliseconds}`
}

export default function Debug() {
  const debug = useMetaportStore((state) => state.mpc.config.debug)
  if (!debug) return

  function stringifyBigInt(obj) {
    return JSON.stringify(obj, (_, value) => (typeof value === 'bigint' ? value.toString() : value))
  }

  const { queue, enqueue, empty } = useQueue()

  const { queue: queueAction, enqueue: enqueueAction, empty: emptyAction } = useQueue()

  const [expanded, setExpanded] = useState<boolean>(false)

  const chainName1 = useMetaportStore((state) => state.chainName1)
  const chainName2 = useMetaportStore((state) => state.chainName2)
  const amount = useMetaportStore((state) => state.amount)
  const stepsMetadata = useMetaportStore((state) => state.stepsMetadata)

  const token = useMetaportStore((state) => state.token)
  const tokenBalances = useMetaportStore((state) => state.tokenBalances)
  const destTokenBalance = useMetaportStore((state) => state.destTokenBalance)
  const tokenContracts = useMetaportStore((state) => state.tokenContracts)
  const tokens = useMetaportStore((state) => state.tokens)

  const cpData = useCPStore((state) => state.cpData)

  const getRows = () => [
    { name: 'chainName1', value: chainName1 },
    { name: 'chainName2', value: chainName2 },
    { name: 'token', value: JSON.stringify(token) },
    { name: 'tokenBalances', value: stringifyBigInt(tokenBalances) },
    { name: 'destTokenBalance', value: stringifyBigInt(destTokenBalance) },
    { name: 'cpData', value: stringifyBigInt(cpData) },
    {
      name: 'tokenContracts',
      value:
        '(' + Object.keys(tokenContracts).length + ') ' + Object.keys(tokenContracts).join(', ')
    },
    {
      name: 'tokens',
      value: '(' + Object.keys(tokens.erc20).length + ') ' + Object.keys(tokens.erc20).join(', ')
    }
  ]

  const [prevRows, setPrevRows] = useState(getRows)

  useEffect(() => {
    window.addEventListener('metaport_actionStateUpdated', actionStateUpdated, false)
  }, [])

  function actionStateUpdated(e: CustomEvent) {
    const actionStateUpdate: types.mp.ActionStateUpdate = e.detail
    enqueueAction({
      action: actionStateUpdate.actionState,
      chainName1: actionStateUpdate.actionData.chainName1,
      chainName2: actionStateUpdate.actionData.chainName2,
      amountWei: actionStateUpdate.actionData.amountWei.toString(),
      address: actionStateUpdate.actionData.address,
      time: formatUTCTime()
    })
  }

  useEffect(() => {
    const currentRows = getRows()
    currentRows.forEach((row, index) => {
      if (row.value !== prevRows[index]?.value) {
        enqueue({
          name: row.name,
          oldValue: prevRows[index]?.value,
          value: row.value,
          time: formatUTCTime()
        })
      }
    })
    setPrevRows(currentRows)
  }, [
    chainName1,
    chainName2,
    amount,
    stepsMetadata,
    token,
    tokenBalances,
    destTokenBalance,
    tokenContracts,
    tokens,
    cpData
  ])

  return (
    <div>
      <Button
        onClick={() => {
          setExpanded((expanded) => !expanded)
        }}
        color={expanded ? 'warning' : 'info'}
        size="small"
        className={cls(styles.btnAction, cmn.mtop20)}
        startIcon={expanded ? <CloseRoundedIcon /> : <ExpandRoundedIcon />}
      >
        {expanded ? 'Hide' : 'Show'} debug info
      </Button>
      <Collapse in={expanded}>
        <div className={cls(cmn.flex, cmn.flexcv, styles.smallTable)}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 12 }}>
              <TableContainer component={Paper}>
                <Table aria-label="simple table" size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Property</TableCell>
                      <TableCell align="left">Value</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getRows().map((row) => (
                      <TableRow
                        key={row.name}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          <code>{row.name}</code>
                        </TableCell>
                        <TableCell align="left">
                          <code>{row.value}</code>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Button
                onClick={() => {
                  empty()
                }}
                color="error"
                size="small"
                className={cls(styles.btnAction)}
                startIcon={<DeleteRoundedIcon />}
              >
                Clear actions history
              </Button>
              <TableContainer component={Paper}>
                <Table stickyHeader aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Property</TableCell>
                      <TableCell align="left">Old value</TableCell>
                      <TableCell align="left">New value</TableCell>
                      <TableCell align="left">Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {queue.map((row, i) => (
                      <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell component="th" scope="row">
                          <code>{row.name}</code>
                        </TableCell>
                        <TableCell align="left">
                          <code>{row.oldValue}</code>
                        </TableCell>
                        <TableCell align="left">
                          <code>{row.value}</code>
                        </TableCell>
                        <TableCell align="left">
                          <code>{row.time}</code>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Button
                onClick={() => {
                  emptyAction()
                }}
                color="error"
                size="small"
                className={cls(styles.btnAction)}
                startIcon={<DeleteRoundedIcon />}
              >
                Clear transfer actions history
              </Button>
              <TableContainer component={Paper}>
                <Table stickyHeader aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">Action</TableCell>
                      <TableCell align="left">chainName1</TableCell>
                      <TableCell align="left">chainName2</TableCell>
                      <TableCell align="left">amountWei</TableCell>
                      <TableCell align="left">address</TableCell>
                      <TableCell align="left">Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {queueAction.map((row, i) => (
                      <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell align="left">
                          <code>{row.action}</code>
                        </TableCell>
                        <TableCell align="left">
                          <code>{row.chainName1}</code>
                        </TableCell>
                        <TableCell align="left">
                          <code>{row.chainName2}</code>
                        </TableCell>
                        <TableCell align="left">
                          <code>{row.amountWei}</code>
                        </TableCell>
                        <TableCell align="left">
                          <code>{row.address}</code>
                        </TableCell>
                        <TableCell align="left">
                          <code>{row.time}</code>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </div>
      </Collapse>
    </div>
  )
}
