import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'

import SwapHorizontalCircleOutlinedIcon from '@mui/icons-material/SwapHorizontalCircleOutlined'
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined'
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined'
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined'
import WalletOutlinedIcon from '@mui/icons-material/WalletOutlined'

import PageCard from '../components/PageCard'

import { cmn, cls } from '@skalenetwork/metaport'

export default function Start() {
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
                description="Connect, get block explorer links and endpoints"
                name="chains"
                icon={<PublicOutlinedIcon />}
              />
            </Grid>
            <Grid className="fl-centered dappCard" item lg={6} md={6} sm={6} xs={12}>
              <PageCard
                description="Apps and games on SKALE Network"
                name="apps"
                icon={<AppsOutlinedIcon />}
              />
            </Grid>
            <Grid className="fl-centered dappCard" item lg={6} md={6} sm={6} xs={12}>
              <PageCard
                description="SKALE Network statistics"
                name="stats"
                icon={<InsertChartOutlinedIcon />}
              />
            </Grid>
            <Grid className="fl-centered dappCard" item lg={6} md={6} sm={6} xs={12}>
              <PageCard
                description="Assets overview across all SKALE Chains"
                name="portfolio"
                icon={<WalletOutlinedIcon />}
              />
            </Grid>
          </Grid>
        </Box>
      </Stack>
    </Container>
  )
}
