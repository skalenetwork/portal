import { useEffect } from 'react';

import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';

import TransferFrom from './components/TransferFrom';



export default function Main(props: any) {
  useEffect(() => {
    props.metaport.close();
  }, []);

  return (
    <Container maxWidth="md">
      <Stack spacing={2}>
        <TransferFrom />
      </Stack>
    </Container>)
}