import type { GetServerSideProps, NextPage } from 'next'
import { useRouter } from "next/router"
import { getSession, useSession } from 'next-auth/react'
import { useContext, useMemo, useState } from 'react'
import { User, Skill, Validations } from '@prisma/client'

import { Avatar, Badge, Typography } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton';
import EditIcon from '@mui/icons-material/Edit';
import { Stack } from '@mui/material'

import theme from '@src/theme'
import LongScreenLayout from '@layouts/longScreenLayout'
import InputFormText from '@components/forms/inputFormText';
import InputMultiSelect from '@components/forms/inputMultiSelect'
import InputFormPicture from '@components/forms/InputFormPicture'
import { validationNamesToIds, validationIdsToNames } from '@src/utils/validations'
import { getSkillList, userCache } from '@src/caching'
import Head from 'next/head'
import MainAppBar from '@components/navigation/MainAppBar'
import Image from 'next/image'
import { trpc } from '@src/trpc'
import { useZodForm } from '@src/utils/useZodForm'
import { editUserSchema } from '@src/schemas/userSchemas'
import { displayName } from '@src/utils/users'
import { userContext } from '@src/utils/UserProvider'


interface EditUserPageProps {
  user: User & {validations: Validations[]}
  skills: Skill[]
}

interface FormFields {
  firstName: string;
  lastName: string | null;
  phoneNumber: string | null;
  email: string | null;
  description: string | null;
  profilePicUrl: string | null;
  skills: string[];
}


export const getServerSideProps: GetServerSideProps = async (context) => {
  if (context!.params!.id) {
    const sessionPromise = getSession(context)
    const skillsPromise = getSkillList()
    const [user, session] = await Promise.all([
      userCache.get(context!.params!.id.toString()),
      sessionPromise
    ])
    if (session && session?.user?.id !== user.id) {
      return {
        props: {},
        redirect: {
          destination: `/users/${context!.params!.id}`
        }
      }
    }
    if (user) {
      return {
        props: {
          user: JSON.parse(JSON.stringify(user)),
          skills: await skillsPromise
        }
      }
    }
  }
  return {
    notFound: true
  }
}


const EditUserPage: NextPage<EditUserPageProps> = (props) => {
  const { user, skills } = props
  const router = useRouter()
  const [ submitError, setSubmitError ] = useState(false)
  const { setUser } = useContext(userContext)

  const { handleSubmit, watch, control, fieldErrors } = useZodForm({
    schema: editUserSchema.omit({id:true, skillsToRemove:true}),
    settings: {
      defaultValues: {
        firstName: user.firstName || "",
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        email: user.email || "",
        description: user.description,
        bio: user.bio,
        profilePicUrl: user.profilePicUrl,
        skills: Array.from(new Set(validationIdsToNames(user.validations, skills)))
      }
    }
  })

  const userMutation = trpc.useMutation("user.edit", {
    onMutate() {
      setSubmitError(false)
    },
    onSuccess(user){
      setUser(user)
      router.push("/users/" + user.id)
    },
    onError(e) {
      console.log(e)
      setSubmitError(true)
    }
  })

  const handleEdit = handleSubmit(
    async (userData) => {
      const skillsToRemove = user.validations.filter((x: Validations) => (
        !userData.skills?.includes(x.skillId) && x.validatorId === user.id
        )
      ).map((v) => v.skillId)
      
      userData.skills = validationNamesToIds(userData.skills || [], skills)
      userMutation.mutateAsync({...userData, id: user.id, skillsToRemove})
    }
  )

  const watchprofilePicUrl = watch("profilePicUrl", user.profilePicUrl)

  return (
    <>
      <Head>
        <title>{`Edit: ${displayName(user)} | Knoly`}</title>
      </Head>
      <LongScreenLayout>
        <MainAppBar/>
        <Stack direction="row" 
          sx={{ marginTop:1, marginBottom:2, justifyContent: "center"}}>
          <InputFormPicture name="profilePicUrl" control={control}>
            <Badge
              overlap="circular"
              color="primary"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              // sx={{heigth:20}}
              badgeContent={
                <EditIcon sx={{paddingY: 0.5}}/>
              }
            >
              <Avatar
                sx={{ width: 128, height: 128, boxShadow:2 }}
              >
                {
                  (watchprofilePicUrl ?? user.profilePicUrl)?
                  <Image src={(watchprofilePicUrl ?? user.profilePicUrl)||""} alt="Profile Picture" layout="fill" />
                  : null
                }
              </Avatar>
            </Badge>
          </InputFormPicture>
        </Stack>
        <Stack sx={{
          paddingX: 2,
          alignItems: "center",
          width: "100%"
        }}>
          <Stack spacing={2} sx={{width: "95%"}}>
            <InputFormText label="Nombre" name="firstName" control={control} error={fieldErrors?.firstName}/>
            <InputFormText label="Apellido" name="lastName" control={control} error={fieldErrors?.lastName}/>
            <InputFormText label="Teléfono de contacto" name="phoneNumber" control={control} error={fieldErrors?.phoneNumber}/>
            <InputFormText label="Correo electrónico" type="email" name="email" control={control} error={fieldErrors?.email}/>
            <InputFormText label="Descripción" name="description" control={control} error={fieldErrors?.description}/>
            <InputFormText label="Bio (Descripción larga)" multiline minRows={5} name="bio" control={control} error={fieldErrors?.bio}/>
            <InputMultiSelect label="Habilidades" options={skills.map((s)=>s.name)} name="skills" control={control} error={fieldErrors?.skills}/>
          </Stack>

          <Stack sx={{marginTop:4}}>
            {submitError && <Typography color={theme.palette.error.main}>
              Ha habido un error
            </Typography>}
            <LoadingButton
              variant="contained"
              loading={userMutation.isLoading}
              onClick={handleEdit}
            >
              Guardar
            </LoadingButton>
          </Stack>
        </Stack>
      </LongScreenLayout>
    </>
  )
}


export default EditUserPage