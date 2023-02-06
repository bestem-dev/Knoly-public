import type { NextPage, NextApiRequest, NextApiResponse } from 'next'
import Link from 'next/link'
import { Button } from '@mui/material';
import { Stack, Typography } from '@mui/material'
import OneScreenLayout from '@layouts/oneScreenLayout';
import { getProviders } from "next-auth/react"
import WalletLogin from '@components/login/WalletLogin';
import Image from 'next/image';
import { Box } from '@mui/system';
import { getAuthOptions } from '@src/pages/api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth';
import { userCache } from '@src/caching';
import { BrandedSignInButton } from '@components/login/BrandedSignInButton';
import { handleLoginCallback } from '@src/utils/urls';
import { NextApiRequestQuery } from 'next/dist/server/api-utils';


export async function getServerSideProps({req, res, query}: {req: NextApiRequest, res: NextApiResponse, query:NextApiRequestQuery}) {
  const session = await unstable_getServerSession(req, res, getAuthOptions(req, res))

  if (session) {
    const callback = handleLoginCallback(query)
    if (callback) return {
      redirect: {
        destination: callback
      }
    }
    const user = await userCache.get(session.user.id)
    if (user?.status === "unregistered") {
      return {
        redirect: {
          destination: "/auth/register"
        }
      }
    }


    return {
      redirect: {
        destination: "/users/" + user.id
      }
    }
  }
  const providers = await getProviders()
  return {
    props: { providers },
  }
}

const LoginPage: NextPage<{providers: {name: string, id: string}[]}> = ({ providers }) => {

  return (
    <OneScreenLayout>
      <Box
        sx={{
          width:"90%",
          maxWidth: "300px"
        }}
      >
        <Image
          alt="Knoly"
          src="/assets/images/welcome/knoly_header.png"
          layout="responsive"
          height={415}
          width={1400}
        />
      </Box>
      {/* <Typography variant="h1" style={{
        textAlign: "center"
      }}>
        Knoly
      </Typography> */}
      <Stack sx={{mx:2}}>
      <Typography variant="h4" sx={{
        textAlign: "center",
        marginBottom: 2
      }}>
        Inicia sesión con:
      </Typography>
      {Object.values(providers).map((provider) => (
        provider.id !== "Ethereum"?
        (
          <BrandedSignInButton name={provider.name} id={provider.id}/>
          // <Button
          //   variant='contained'
          //   onClick={() => signIn(provider.id)}
          //   sx={{my:2, mx:2}}
          // >
          // </Button>
        ):""
      ))}
      <WalletLogin/>
      </Stack>
      <Link href="/" passHref>
        <Button>
          Volver al inicio
        </Button>
      </Link>
    </OneScreenLayout>
  )
}

export default LoginPage