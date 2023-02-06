import { Badge, Button } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { createContext, FC, useContext, useEffect, useState } from "react";
import SideBar from "./SideBar";
import { userContext } from "@src/utils/UserProvider";


const SideBarButton: FC = () => {
  // const userQuery = trpc.useQuery(["user.data", {id: session?.user.id || ""}], {enabled: status==="authenticated"})
  const [ sideBarOpen, setSideBarOpen ] = useState(false)
  const [ notification, setNotification ] = useState(false)

  const { user } = useContext(userContext)

  useEffect(() => {
    if (user) {
      if (user.status === "unregistered") {
        setNotification(true)
      }
      else setNotification(false)
    }
  }, [user])
  
  return (
    <>
      <Button variant="text" sx={{color: "white"}}
        onClick={()=>setSideBarOpen(true)}
      >
        <Badge badgeContent={notification? 1 : 0} color="secondary">
          <MenuIcon/>
        </Badge>
      </Button>
      <SideBar
        open={sideBarOpen}
        toggleSideBar={setSideBarOpen}
      />
    </>
  )
}

export default SideBarButton