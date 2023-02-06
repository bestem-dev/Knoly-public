import { ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Typography} from "@mui/material";
import { FC, useContext} from "react";
// import AddToHomeScreenIcon from '@mui/icons-material/AddToHomeScreen';
import PersonIcon from '@mui/icons-material/Person';
import Link from "next/link";
import { useSession } from "next-auth/react";
import { userContext } from "@src/utils/UserProvider";
// import usePWA from 'react-pwa-install-prompt'

// IMPORTANT: This component only works client side. So you need to use it on a non-ssr page or import it dynamically

const UserButton: FC = () => {
  const { data: session } = useSession()
  // const user = trpc.useQuery(["user.data", {id: session?.user.id || ""}], {enabled: status==="authenticated"})
  const { user } = useContext(userContext)
  const walletString = user?.wallet?.slice(0,13) + "..." + user?.wallet?.slice(user?.wallet?.length-5)
  const registeredUser = user?.status === "registered"
  console.log(registeredUser)
  
  return (
    <ListItem disablePadding key="user-profile">
      <Link href={registeredUser? "/users/"+session?.user.id: "/auth/register"} passHref>
        <ListItemButton sx={registeredUser?{}:{
          backgroundColor: "lightblue"
        }}>
          <ListItemIcon>
            <PersonIcon/>
          </ListItemIcon>
          <ListItemText
            primary={registeredUser? user?.firstName: "Registra tu perfil"}
            secondary={user?.wallet? walletString: undefined}  
          />
        </ListItemButton>
      </Link>
    </ListItem>
  )

            
}

export default UserButton