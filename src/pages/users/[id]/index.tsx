import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import Link from 'next/link'
// import { getSession } from 'next-auth/react'
import { User, Skill, Validations } from '@prisma/client'
import {  Avatar, Fab, Typography } from '@mui/material'
import { Stack } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';
import LongScreenLayout from '@layouts/longScreenLayout'
import { getSkillList, userCache } from '@src/caching'
// import { logger } from '@src/logger'
import { OnlyUser } from '@components/AccessControl'
import { UserValidationsList } from '@components/users/UserValidationsList'
import { QRButton, QRButtonStyle } from '@components/QRButton'
// import Head from 'next/head'
import MainAppBar from '@components/navigation/MainAppBar'
import Image from 'next/image'
// import { logger } from '@src/logger'
import { displayName } from '@src/utils/users'
import { Metadata } from '@components/Metadata'
import { Box } from '@mui/system'
import { ExternalValidationsList } from '@components/users/ExternalValidationsList'
import { useContext } from 'react'
import { userContext } from '@src/utils/UserProvider'

interface UserPageProps {
  user: User & {validations: Validations[]}
  skills: Skill[]
  // initialSkillScores: { [skill: string]: number }
  // initialValidatedSkills: string[]
}

export const getStaticPaths: GetStaticPaths = async() => {
  return {
    paths: [],
    fallback: "blocking"
  }
}

// export const getServerSideProps: GetServerSideProps = async (context) => {
export const getStaticProps: GetStaticProps = async (context) => {
  if (context!.params!.id) {
    // logger.info("User page requested", Date.now())
    // const sessionPromise = getSession(context)
    const skillsPromise = getSkillList()

    const user = await userCache.get(context!.params!.id.toString())
    // logger.info("Got user", Date.now())
    if (user) {
      return {
        props: {
          user: JSON.parse(JSON.stringify(user)),
          skills: await skillsPromise,
          // initialSkillScores: skillScores,
          // initialValidatedSkills: validatedSkills,
          revalidate: 30
        }
      }
    }
  }
  return {
    notFound: true
  }
}


const UserPage: NextPage<UserPageProps> = (props) => {
  let { user } = props

  const { user: contextUser } = useContext(userContext)
  if (contextUser && user.id === contextUser.id) {
    user = contextUser
  }

  const fullName = displayName(user)

  return (
    <>
      {/* <Head>
        <title>{`${fullName} | Knoly`}</title>
      </Head> */}
      <Metadata title={`${fullName} | Knoly`} description={user.description} image={user.profilePicUrl}/>
      <LongScreenLayout>
        <MainAppBar/>

        <Stack direction="row" sx={{ marginTop:1, marginLeft:3}}>
          <Avatar sx={{ width: 128, height: 128, boxShadow:2 }}
          >
            {user.profilePicUrl?
            <Image src={user.profilePicUrl} alt={fullName} layout="fill" />
            : null
            }
          </Avatar>
          <Stack sx={{marginLeft:2, marginTop:{xs:1.5, sm:3}}}>
            <Typography variant="h4">
              {fullName}
            </Typography>
            <Typography>
              {user.description}
            </Typography>
          </Stack>
        </Stack>

        <Stack sx={{
          paddingTop: 3,
          paddingX: 2,
        }}>
          <Typography variant="h5">
            Acerca de
          </Typography>
          <Typography variant="body1" sx={{whiteSpace: "pre-line"}}>
            {user.bio}
          </Typography>

          <Typography variant="h5" style={{marginTop: 20}}>
            Validaciones p2p
          </Typography>
          <UserValidationsList user={user} skills={props.skills}/>

          <ExternalValidationsList user={user}/>

        </Stack>
        <OnlyUser user={user}>
          <Box sx={{height: 140}}/>
          <QRButton/>
          <Link href={`/users/${user.id}/edit`} passHref>
            <Fab sx={{position: 'fixed', right: 16, bottom: 86}}>
                <EditIcon/>
            </Fab>
          </Link>
        </OnlyUser>
      </LongScreenLayout>
    </>
  )
}

export default UserPage