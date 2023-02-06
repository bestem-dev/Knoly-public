import { Alert, AppBar, Stack, Toolbar } from "@mui/material";
import { FC, ReactNode, useContext } from "react";
import { BackButton } from "./BackButton";
// import SessionButton from "./SessionButton";
import SideBarButton from "./SideBarButton";
import CTA from "./CTA"
import { userContext } from "@src/utils/UserProvider";
import Link from "next/link";

const MainAppBar: FC<{children?: ReactNode}> = ({ children }) => {

  const { user } = useContext(userContext)
  
  return (
    <Stack>
      <AppBar sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        width: "100%",
        // height: 64,
        marginBottom: 0,
        }}
        position="fixed">
        <Stack justifyContent="flex-start" sx={{width:"100%", height:"100%"}}>
          <Stack direction="row" justifyContent="space-between">
            <BackButton/>
            <Stack direction="row" spacing={0} justifyContent="flex-end1">
              { children }
              <CTA/>
              <SideBarButton/>
            </Stack>
          </Stack>
        </Stack>
      </AppBar>
      <Toolbar></Toolbar>
      {(user?.status === "unregistered")? <Link href={"/auth/register"} passHref>
          <Alert severity="error" sx={{ width: '100%' }}>
            Tu perfil no está registrado. Haz click aquí para terminar el registro de tu perfil y recibir validaciones.
          </Alert>
        </Link>
      :<></>}
    </Stack>
  )
}

export default MainAppBar