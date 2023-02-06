import type { NextApiRequest, NextApiResponse, NextPage } from 'next'
// import Link from 'next/link'
// import { Button } from '@mui/material';
import { Stack, Typography } from '@mui/material'
// import TextField from '@mui/material/TextField';
import { useContext, useState } from 'react';
import OneScreenLayout from '@layouts/oneScreenLayout';
import InputFormText from '@components/forms/inputFormText';
import theme from '@src/theme';
import prisma from '@src/prisma'
import { LoadingButton } from '@mui/lab';
import { useZodForm } from '@src/utils/useZodForm';
import { unstable_getServerSession } from 'next-auth';
import { getAuthOptions } from '@src/pages/api/auth/[...nextauth]';
import { Account, User } from '@prisma/client';
import { trpc } from '@src/trpc'
import { registerUserSchema } from '@src/schemas/userSchemas';
import { useRouter } from 'next/router';
import { userContext } from '@src/utils/UserProvider';

type userProp = User & {
    accounts: (Account)[];
  }

export async function getServerSideProps({req, res}: {req: NextApiRequest, res: NextApiResponse}) {
  const session = await unstable_getServerSession(req, res, getAuthOptions(req, res))
  if (session) {
    const user = await prisma.user.findUnique({
      where: {
        id: session?.user.id
      },
      include:{ 
        accounts: true
      }
    })
    
    return {
      props: {
        user: JSON.parse(JSON.stringify(user)),
        // profile: JSON.parse(JSON.stringify(user))
      }
    }
  }
  return {
    redirect: {
      destination: "/auth/login"
    }
  }
}

const LoginPage: NextPage<{user: userProp}> = ({ user }) => {
  const router = useRouter()
  const { refetch: refetchUser } = useContext(userContext)
  const { handleSubmit, control, fieldErrors } = useZodForm({
    schema: registerUserSchema,
    settings: {
      defaultValues: {
        firstName: user.name || undefined,
        email: user.email || undefined
      }
    }
  })
  const userMutation = trpc.useMutation("user.register", {
    onMutate() {
      setFormError(false)
    },
    onSuccess(data) {
      if (data.message === "Created") {
        refetchUser()
        router.push("/auth/register/success?userId=" + user.id)
        return
      }
      // Catched server error
      setFormError(true)
      setFormErrorMessage(data.message)
    },
    onError(e) {
      console.log(e)
      setFormError(true)
      setFormErrorMessage("Error de conexión")
    }
  }
  )
  const [ formError, setFormError ] = useState(false)
  const [ formErrorMessage, setFormErrorMessage ] = useState<string>()

  const handleRegister = handleSubmit(
    async (registerData) => {
      userMutation.mutateAsync(registerData)
    },
    (e) => {
      console.log(e)
    }
  )
  console.log(fieldErrors)

  return (
    <OneScreenLayout>
      <Typography variant="h3" style={{
        textAlign: "center"
      }}>
        Unirse a Knoly
      </Typography>
      

      <Stack spacing={1}>
        <InputFormText label="Nombre *" name="firstName" control={control} error={fieldErrors?.firstName}/>
        <InputFormText label="Apellido" name="lastName" control={control} error={fieldErrors?.lastName}/>
        <InputFormText label="Teléfono de contacto" name="phoneNumber" control={control} error={fieldErrors?.phoneNumber}/>
        <InputFormText label="Correo electrónico *" type="email" name="email" control={control} error={fieldErrors?.email}/>
      </Stack>

      <Stack>
        {formError? <Typography color={theme.palette.error.main}>{formErrorMessage || "Error creando perfil"}</Typography>:""}
        <LoadingButton variant="contained" onClick={handleRegister} loading={userMutation.isLoading}>
          Registrarse
        </LoadingButton>
      </Stack>
    </OneScreenLayout>
  )
}

export default LoginPage