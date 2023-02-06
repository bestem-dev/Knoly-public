import { useRouter } from "next/router";
import { FC } from "react"
import { Button, Stack } from "@mui/material"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import theme from "@src/theme";

export const BackButton: FC<{darkColor?: boolean}> = ({ darkColor }) => {
  const router = useRouter()

  return (
    // <Stack direction="row">
      <Button
        sx={{ width: 10, padding:1.5}}
        onClick={() => router.back()}
      >
        <ArrowBackIcon
          sx={{color: darkColor? theme.palette.primary.main: "white"}} // lightColor? theme.palette.primary.light: undefined}}
        />
      </Button>
    //   <Button
    //     sx={{ width: 10, padding:1.5}}
    //     onClick={() => router.push("/")}
    //   >
    //     <HomeIcon
    //       sx={{color: darkColor? theme.palette.primary.main: "white"}}
    //     />
    //   </Button>
    // </Stack>
  )
}