import { Button, Dialog, DialogTitle, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Typography} from "@mui/material";
import { FC, useEffect, useRef, useState} from "react";
import AddToHomeScreenIcon from '@mui/icons-material/AddToHomeScreen';
// import usePWA from 'react-pwa-install-prompt'

// IMPORTANT: This component only works client side. So you need to use it on a non-ssr page or import it dynamically

const InstallPWAButton: FC = () => {
  // const { isStandalone, isInstallPromptSupported, promptInstall } = usePWA()
  
  // console.log("PWA status")
  // console.log({ isStandalone, isInstallPromptSupported, promptInstall })

  // const installPWA = async () => {
  //   const didInstall = await promptInstall()
  //   if (didInstall) {
  //     // User accepted PWA install
  //   }
  // }

  const [openDialog, setOpenDialog] = useState(false);

  // Check if installed
  // if (
  //   (window.navigator as interface {standalone: any}).standalone || // IOS
  //   window.matchMedia('(display-mode: standalone)').matches // Android
  // ) return 

  return (
    <>
      <ListItem disablePadding key="install-pwa">
        <ListItemButton onClick={()=>setOpenDialog(true)}>
          <ListItemIcon>
            <AddToHomeScreenIcon />
          </ListItemIcon>
          <ListItemText primary="Instalar App" />
        </ListItemButton>
      </ListItem>
      <Dialog onClose={()=>setOpenDialog(false)} open={openDialog}>
        <DialogTitle>Instalar Aplicación Web</DialogTitle>
        <Stack justifyContent="space-between" alignItems="center" spacing={2} sx={{width:300, padding:3}}>
          <Typography sx={{textAlign: "center"}}>
            Para instalar busca un botón de instalar en la interfáz de tu navegador. Puede estar en la barra de navegación o en el menú lateral.
          </Typography>
          <Button onClick={()=>setOpenDialog(false)}>
            Ok
          </Button>
        </Stack>
      </Dialog>
    </>
  )

  // return (isInstallPromptSupported && isStandalone)?
  //   <ListItem disablePadding>
  //     <ListItemButton onClick={installPWA}>
  //       <ListItemIcon>
  //         <AddToHomeScreenIcon />
  //       </ListItemIcon>
  //       <ListItemText primary="Instalar App" />
  //     </ListItemButton>
  //   </ListItem>:<></>
            
}

export default InstallPWAButton