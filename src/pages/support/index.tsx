import type { NextPage } from 'next'
import LongScreenLayout from '@layouts/longScreenLayout'
import Head from 'next/head'
import MainAppBar from '@components/navigation/MainAppBar'
import { Stack, Typography } from '@mui/material'


const Support: NextPage = () => {
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL
  return (
    <>
      <Head>
        <title>{`Soporte | Knoly`}</title>
      </Head>
      <LongScreenLayout>
        <MainAppBar/>
        <Stack
          justifyContent='center'
          alignItems="center"
          sx={{height:"100vh"}}
        >
          <Typography sx={{textAlign: "center"}}>
              Para soporte mandar un mail a <a href={"mailto:" + supportEmail}>{supportEmail}</a>
          </Typography>
        </Stack>
      </LongScreenLayout>
    </>
  )
}

export default Support