import type { NextPage } from 'next'
// import Typography from '@mui/material/Typography';
import OneScreenLayout from '@layouts/oneScreenLayout';
import { useSession } from 'next-auth/react';
import { signIn } from "next-auth/react"
import { useRouter } from 'next/router';
import HomeScreenCaroussel from '@components/HomeScreenCaroussel';
import Image from 'next/image';
import { Box, Button } from '@mui/material';
// import { trpc } from '@src/trpc';
import { Metadata } from '@components/Metadata';


const WelcomePage: NextPage= () => {
  const router = useRouter()
  const { data: session, status } = useSession()
  // const userQuery = trpc.useQuery(["user.data", {wallet: session?.user.address || ""}], {enabled:status!=="loading"})
  
  console.log("Session", session)
  console.log("Session status", status)
  // if (session && userQuery.isSuccess) {
  //   if (!userQuery.data) {
  //     console.log("No user")
  //     router.push(`/register`)
  //   }
  //   else {
  //     router.push(`/users/${session.user.address}/`)
  //   }
  // }

  // console.log(userQuery)

  return (
    <OneScreenLayout>
      <Metadata/>
      <Box
        sx={{
          height: "15vh",
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
      }}>Knoly</Typography> */}

      <HomeScreenCaroussel sx={{
        height: "50vh",
        width: "90%"
      }}/>

      {status === "authenticated"? (
      <Button
        onClick={() => router.push(`/users/${session.user.id}/`)}
        variant="contained"
      >
        Ir a Perfil
      </Button>
      )
      :<Button
       onClick={() => signIn(undefined, {redirect: false})}
       variant="contained"
      >Iniciar Sesión</Button>}
      {/* <WalletLogin/> */}
      {/* <SelectWalletModal/> */}
    </OneScreenLayout>
  );
}

export default WelcomePage;
