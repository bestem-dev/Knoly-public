import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, SwipeableDrawer } from "@mui/material";
import { FC } from "react";
import useSessionButton from "./useSessionButton";
import SupportIcon from '@mui/icons-material/Support';
import AddBoxIcon from '@mui/icons-material/AddBox';
import SettingsIcon from '@mui/icons-material/Settings';
// import BusinessIcon from '@mui/icons-material/Business';
// import SearchIcon from '@mui/icons-material/Search';
// import PersonIcon from '@mui/icons-material/Person';
import InstallPWAButton from "./InstallPWAButton";
import Link from "next/link";
import { OnlyLoggedIn } from "@components/AccessControl";
// import { useSession } from "next-auth/react";
// import { trpc } from "@src/trpc";
import UserButton from "./UserButton";

const SideBar: FC<{open: boolean, toggleSideBar: (arg1:boolean)=>void}> = ({ open, toggleSideBar }) => {
  const sessionButton = useSessionButton()
  // const { data: session, status} = useSession()

  // const user = trpc.useQuery(["user.data", {id: session?.user.id || ""}], {enabled: status==="authenticated"})
  // const walletString = user.data?.wallet?.slice(0,13) + "..." + user.data?.wallet?.slice(user.data?.wallet?.length-5)
  return (
    <SwipeableDrawer
      anchor="right"
      open={open}
      onClose={() =>toggleSideBar(false)}
      onOpen={() =>toggleSideBar(true)}
      color="#000000"
      >
        <Stack
          direction="column"
          justifyContent="space-between"
          alignItems="flex-start"
          spacing={2}
          sx={{
            height: "100%",
            width: "100%",
            minWidth: 240,
          }}
        >
          <List>
            <InstallPWAButton key="install-pwa"/>
            <OnlyLoggedIn key="only-logged-in">
              {/* <ListItem disablePadding>
                <ListItemButton key="search-profiles">
                  <ListItemIcon>
                    <SearchIcon />
                  </ListItemIcon>
                  <ListItemText primary="Búscar perfiles" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton key="company-profile">
                  <ListItemIcon>
                    <BusinessIcon />
                  </ListItemIcon>
                  <ListItemText primary="Perfil de Empresa" />
                </ListItemButton>
              </ListItem> */}
              <Link href="/support/suggestSkills" passHref key="suggest-skills">
                <ListItem disablePadding key="suggest-skills">
                  <ListItemButton>
                    <ListItemIcon>
                      <AddBoxIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Sugerir habilidades" />
                  </ListItemButton>
                </ListItem>
              </Link>
              <Link href="/settings" passHref key="settings">
                <ListItem disablePadding key="settings">
                  <ListItemButton>
                    <ListItemIcon>
                      <SettingsIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Configuración"/>
                  </ListItemButton>
                </ListItem>
              </Link>
            </OnlyLoggedIn>
            <Link href="/support" passHref key="support">
              <ListItem disablePadding key="support">
                <ListItemButton>
                  <ListItemIcon>
                    <SupportIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Soporte"/>
                </ListItemButton>
              </ListItem>
            </Link>
          </List>
          <List sx={{width: "100%"}}>
            <UserButton/>
            {/* <ListItem disablePadding key="user-profile">
              <Link href={"/users/"+session?.user.id} passHref>
                <ListItemButton>
                  <ListItemIcon>
                    <PersonIcon/>
                  </ListItemIcon>
                  <ListItemText
                    primary={user.data?.firstName}
                    secondary={user.data?.wallet? walletString: undefined}  
                  />
                </ListItemButton>
              </Link>
            </ListItem> */}
            <ListItem disablePadding key={sessionButton.buttonText}>
              <ListItemButton onClick={sessionButton.onClick}>
                <ListItemIcon>
                  <sessionButton.icon/>
                </ListItemIcon>
                <ListItemText primary={sessionButton.buttonText}/>
              </ListItemButton>
            </ListItem>
          </List>
        </Stack>
    </SwipeableDrawer>
  )
}

export default SideBar