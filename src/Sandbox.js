import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CancelIcon from '@mui/icons-material/Cancel';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';


export default function Sandbox(props) {

  function openSandbox() {
    props.metaport.open();
  }

  function closeMetaport() {
    props.metaport.close();
  }

  function resetMetaport() {
    props.metaport.reset();
  }

  return (<div>
    <Container maxWidth="md">
      <Stack spacing={3}>
        <h1 className="mp__noMarg">Metaport Sandbox</h1>
        <Typography sx={{ mb: 1.5 }} color="text.secondary" className='mp__margBott10 mp__noMargTop'>
          Here you can freely explore Metaport functionality
        </Typography>
        <Card variant="outlined" sx={{ minWidth: 275 }} className='marg-bott-20'>
          <CardContent>
            <Chip label="Custom transfers" />
            <Typography sx={{ mb: 1.5 }} color="text.secondary" className='mp__margTop20'>
              Open Metaport popup to perform custom transfers. <br />
              You will be able to select tokens and chains.
            </Typography>
            <Button
              onClick={openSandbox}
              variant="contained"
              startIcon={<OpenInNewIcon />}
              className='mp__margTop10 demoBtn'
              elevation={0}
            >
              Open Metaport
            </Button>
            <Button
              onClick={closeMetaport}
              variant="contained"
              startIcon={<CancelIcon />}
              className='mp__margTop10 marg-left-10 demoBtn'
            >
              Close Metaport
            </Button>
            <Button
              onClick={resetMetaport}
              variant="contained"
              startIcon={<RotateLeftIcon />}
              className='mp__margTop10 marg-left-10 demoBtn'
            >
              Reset Metaport
            </Button>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  </div>)
}