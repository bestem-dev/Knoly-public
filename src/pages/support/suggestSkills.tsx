import type { NextPage } from 'next'
import MainAppBar from '@components/navigation/MainAppBar'
import { Alert, Snackbar, Stack, Typography } from '@mui/material'
import OneScreenLayout from '@layouts/oneScreenLayout'
import InputFormText from '@components/forms/inputFormText'
import { useState } from 'react'
import { trpc } from '@src/trpc'
import * as z from "zod"
import { useSession } from 'next-auth/react'
import { useZodForm } from '@src/utils/useZodForm'
import { LoadingButton } from '@mui/lab'


const SuggestSkills: NextPage = () => {
  const { data: session, status } = useSession()
  const [ formError, setFormError ] = useState("")
  const [ successMessage, setSuccessMessage ] = useState(false)
  
  const { handleSubmit, control, reset, fieldErrors } = useZodForm({
    // We don't use the schema from trpc because we need to alias fields to avoid ugly autocomplete
    schema: z.object({
      skillName: z.string().max(20),
      skillDescription: z.string().max(140)
    })
  })
  
  const mutation = trpc.useMutation(["support.suggest-skill"], {
    onMutate() {
      setFormError("")
    },
    onSuccess() {
      reset()
      mutation.reset()
      setSuccessMessage(true)
    },
    onError(error) {
      console.log(error)
      mutation.reset()
      setFormError("Error enviando sugerencia")
    }
  })

  // if (mutation.isSuccess) {
  //   reset()
  //   mutation.reset()
  //   setSuccessMessage(true)
  // }

  // if (mutation.error) {
  //   console.log(mutation.error)
  //   mutation.reset()
  //   setFormError("Error enviando sugerencia")
  // }

  const handler = handleSubmit(
    async (skillData) => {
      mutation.mutate({
        name: skillData.skillName,
        description: skillData.skillDescription,
        userId: session!.user.id
      })
    }
  )
  return (
    <OneScreenLayout>
      <MainAppBar/>
      <Typography variant="h3" style={{
        textAlign: "center"
      }}>
        Sugerir habilidad
      </Typography>

      {/* // TODO: Do some sort of form validation */}
      

      <Stack spacing={1}>
        <InputFormText label="Habilidad" name="skillName" control={control} error={fieldErrors?.skillName}/>
        <InputFormText label="Descripción" name="skillDescription" control={control} error={fieldErrors?.skillDescription}/>
      </Stack>

      <Stack>
        {formError? <Alert severity="error">{formError}</Alert>:""}
        <LoadingButton variant="contained"
          loading={mutation.isLoading}
          onClick={handler}
        >
          Enviar
        </LoadingButton>
      </Stack>
      <Snackbar
        open={successMessage}
        autoHideDuration={6000}
        onClose={()=>setSuccessMessage(false)}
      >
        <Alert severity="success" sx={{width: "100%"}}>Sugerencia enviada</Alert>
      </Snackbar>
    </OneScreenLayout>
  )
}

export default SuggestSkills