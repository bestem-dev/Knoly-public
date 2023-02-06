import { LoadingButton } from "@mui/lab"
import { Box, Button, Grid, Typography } from "@mui/material"
import { signIn } from "next-auth/react"
import Image from "next/image"
import { FC } from "react"

export const buttonImages: any= {
  google: {
    imageUrl: "/assets/images/3rdParty/google.jpeg"
  },
  github: {
    imageUrl: "/assets/images/3rdParty/GitHub-Mark-64px.png" 
  },
  linkedin: {
    imageUrl: "/assets/images/3rdParty/Linkedin-PNG-Picture-180x180-3137698370.png"
  },
  injected: {
    imageUrl: "/assets/images/3rdParty/metamask.png"
  },
  walletConnect: {
    imageUrl: "/assets/images/3rdParty/walletconnect.png"
  },
  ethereum: {
    imageUrl: "/assets/images/3rdParty/ethereum.png"
  }
}

export const BrandedSignInButton: FC<{name: string, id: string, onClick?: any, loading?: boolean}> = ({name, id, onClick, loading}) => {
  console.log(id)
  const logoSize = 32
  const defaultOnClick = () => signIn(id)

  return (
    <LoadingButton
      variant='contained'
      loading={loading}
      onClick={onClick || defaultOnClick}
      key={id}
      sx={{my:1}}
    >
        <Grid container sx={{width: "100%"}} >
          {/* <Grid item xs={2}/> */}
          <Grid item container xs={2} alignItems="center" justifyContent="flex-end">
            <Box sx={{backgroundColor: "white", borderRadius:2 , padding:0.5, height:logoSize, width:logoSize}}>
              <Image src={buttonImages[id].imageUrl} height={logoSize} width={logoSize} alt={id}></Image>    
            </Box>
          </Grid>
          <Grid item container xs={10} alignItems="center" justifyContent="space-around">
            <Typography>
              {name}
            </Typography>
          {/* <Grid item xs={2}/> */}
          </Grid>
        </Grid>
    </LoadingButton>
      // <Stack direction="row" alignItems="center" justifyContent="flex-start" spacing={2} sx={{width: "100%"}}>
      // </Stack>
    )
}