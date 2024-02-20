import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'

import SwapHorizontalCircleOutlinedIcon from '@mui/icons-material/SwapHorizontalCircleOutlined'
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined'
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined'
// import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined'
// import WalletOutlinedIcon from '@mui/icons-material/WalletOutlined'

import { JsonRpcProvider } from 'ethers'
import { useEffect } from 'react'
import { skaleContracts } from "@skalenetwork/skale-contracts-ethers-v6";

import PageCard from '../components/PageCard'

import { cmn, cls } from '@skalenetwork/metaport'

export default function Start() {


  useEffect(() => {
    load()
  }, [])

  async function load() {
    const provider = new JsonRpcProvider('https://cloudflare-eth.com/')
    const network = await skaleContracts.getNetworkByProvider(provider)
    const project = await network.getProject("skale-manager")
    const instance = await project.getInstance("production")
    const distributor = await instance.getContract("Distributor")
    const fee = await distributor.getEarnedFeeAmount()
    console.log('fee', fee.toString())
  }

  return (
    <Container maxWidth="md">
      <Stack spacing={0}>
        <div className={cls(cmn.flex)}>
          <h2 className={cls(cmn.nom)}>SKALE Portal</h2>
        </div>
        <p className={cls(cmn.nom, cmn.p, cmn.p3, cmn.pSec)} style={{ zIndex: '2' }}>
          Gateway to the SKALE Ecosystem
        </p>
        <Box sx={{ flexGrow: 1 }} className={cls(cmn.mtop20)}>
          <Grid container spacing={3}>
            <Grid className="fl-centered dappCard" item lg={6} md={6} sm={6} xs={12}>
              <PageCard
                name="bridge"
                description="Transfer tokens without gas fees"
                icon={<SwapHorizontalCircleOutlinedIcon />}
              />
            </Grid>
            <Grid className="fl-centered dappCard" item lg={6} md={6} sm={6} xs={12}>
              <PageCard
                description="Chains list, block explorers and endpoints"
                name="chains"
                icon={<PublicOutlinedIcon />}
              />
            </Grid>
            {/* <Grid className="fl-centered dappCard" item lg={6} md={6} sm={6} xs={12}>
              <PageCard
                description="Apps and games on SKALE Network"
                name="apps"
                icon={<AppsOutlinedIcon />}
              />
            </Grid> */}
            <Grid className="fl-centered dappCard" item lg={6} md={6} sm={6} xs={12}>
              <PageCard
                description="SKALE Network statistics"
                name="stats"
                icon={<InsertChartOutlinedIcon />}
              />
            </Grid>
            {/* <Grid className="fl-centered dappCard" item lg={6} md={6} sm={6} xs={12}>
              <PageCard
                description="Assets overview across all SKALE Chains"
                name="portfolio"
                icon={<WalletOutlinedIcon />}
              />
            </Grid> */}
          </Grid>
        </Box>
      </Stack>
    </Container>
  )
}
