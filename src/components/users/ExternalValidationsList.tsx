import { Button, CircularProgress, Dialog, DialogTitle, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Typography } from '@mui/material';
import { Add } from '@mui/icons-material';
import { User, Validations, ScrapedData, Account, proofOfKnoly } from '@prisma/client';
import { FC, useState } from 'react';
import { OnlyUser } from '@components/AccessControl';
import { trpc } from '@src/trpc';
import { supportedSources } from '@src/proofOfKnoly/supportedSources';
import { buttonImages } from '@components/login/BrandedSignInButton';
import Image from 'next/image';
import GitHubReport from '@src/proofOfKnoly/github/report';

export interface ExternalValidationListProps {
  user: User & { validations: Validations[]; };
}

export const ExternalValidationsList: FC<ExternalValidationListProps> = ({ user }) => {
  const [addValidationModalOpen, setAddValidationModalOpen] = useState(false)
  
  const userAccountsQuery = trpc.useQuery(["user.accounts",{id: user.id}])
  const externalValidationsQuery = trpc.useQuery(["pok.get", {userId: user.id}])
  const externalValidations = externalValidationsQuery.data
  const generatePoKMutation = trpc.useMutation("pok.create", {
    onSuccess() {
      setAddValidationModalOpen(false)
      externalValidationsQuery.refetch()
    }
  })
  
  const accountsAvailable = userAccountsQuery.data
    ?.map(a => a.provider)
    .filter(a => ((supportedSources as unknown) as string[]).includes(a))
    .filter(a => !externalValidations?.map(p => p.source?.provider).includes(a))

  return (externalValidationsQuery.isSuccess && ((externalValidations?.length || 0) > 0 || (accountsAvailable?.length || 0) > 0))? (
    <>
      <Typography variant="h5" style={{marginTop: 20}}>
        Validaciones externas
      </Typography>
      <List>
        {externalValidations!.map((v) => (
        <ListItem
          key={v.id}
        >
          <PoKDisplay data={v}/>
        </ListItem>
        ))}
        {accountsAvailable?.length !== 0 ? <OnlyUser user={user}>
          <ListItem key="add">
            <ListItemButton onClick={()=>setAddValidationModalOpen(true)}>
              <ListItemIcon>
                <Add/>
              </ListItemIcon>
              <ListItemText primary="Agregar Validación" secondary={""} />
            </ListItemButton>              
          </ListItem>
        </OnlyUser>:<></>}
      </List>
      <AddExternalValidationModal
        setOpen={setAddValidationModalOpen}
        open={addValidationModalOpen}
        accountsAvailable={accountsAvailable}
        createPoK={generatePoKMutation.mutate}
        loading={generatePoKMutation.isLoading}
      />
    </>
  ): <></>
};

const AddExternalValidationModal: FC<{
  setOpen: any, open: boolean, accountsAvailable: string[] | undefined, createPoK: any, loading: boolean
}> = ({setOpen, open, accountsAvailable, createPoK, loading}) => {
  return <Dialog onClose={() => setOpen(false)} open={open}>
    <DialogTitle>Agregar validación</DialogTitle>
    <Stack justifyContent="space-between" alignItems="center" spacing={2} sx={{ width: 300, padding: 1 }}>
      <Typography variant='h5'>
        Cuentas conectadas:
      </Typography>
      <List>
        {accountsAvailable?.map(a => (
          <ListItem key={a}>
            <ListItemButton onClick={() => createPoK({ account: (a as any) })} disabled={loading}>
              <ListItemText primary={a} />
              <ListItemIcon sx={{ padding: 2 }}>
                {loading ?
                  <CircularProgress />
                  : <Image src={buttonImages[a].imageUrl} height={24} width={24} alt={a}></Image>}
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Typography>
        o (próximamente):
      </Typography>
      <Button disabled variant='contained'> Conctar otra cuenta</Button>
      <Button onClick={() => setOpen(false)}>
        Cancelar
      </Button>
    </Stack>
  </Dialog>;
}

const PoKDisplay: FC<{
  data: proofOfKnoly & {source: Account | null, dataSources: ScrapedData[]}
}> = ({data}) => {
  const reports: any = {
    github: (<GitHubReport data={data}/>)
  }
  return reports[(data.content as any).source]
}