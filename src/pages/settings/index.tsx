import type { NextPage } from 'next'
import LongScreenLayout from '@layouts/longScreenLayout'
import Head from 'next/head'
import { useSession } from 'next-auth/react';
import { Dialog, DialogTitle, List, ListItem, ListItemButton, ListItemText, Stack, Typography } from "@mui/material";
import MainAppBar from '@components/navigation/MainAppBar'
import { FC, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { trpc } from '@src/trpc';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';


const DeleteProfileButton: FC = () => {
  const router = useRouter()
  const [ dialogOpen, setDialogOpen ] = useState(false)
  const handleClose = () => setDialogOpen(false)
  const handleOpen = () => setDialogOpen(true)
  const deleteUserMutation = trpc.useMutation("user.delete", {
    async onSuccess() {
      await signOut({redirect:false})
      handleClose()
      router.push("/")
    }
  })

  const handleDelete = () => {
    deleteUserMutation.mutate()
  }

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton key="delete-profile" onClick={handleOpen}>
          <ListItemText primary="Borrar Perfil" />
        </ListItemButton>
      </ListItem>
      <Dialog onClose={handleClose} open={dialogOpen}>
        <DialogTitle>Borrar Perfil</DialogTitle>
        <Stack  sx={{padding: 2}}>
          <Typography sx={{textAlign:"center"}}>¿Estás seguro de que querés borrar tu perfil?</Typography>
          <LoadingButton loading={deleteUserMutation.isLoading} sx={{marginY: 2}} onClick={handleDelete}>
            Borrar
          </LoadingButton>
        </Stack>
      </Dialog>
    </>
  )
}


const Template: NextPage = () => {
  return (
    <>
      <Head>
        <title>{`Template | Knoly`}</title>
      </Head>
      <LongScreenLayout>
        <MainAppBar/>
          <List sx={{marginTop:0}}>
            <DeleteProfileButton/>
          </List>
      </LongScreenLayout>
    </>
  )
}

export default Template