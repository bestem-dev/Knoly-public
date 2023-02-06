import { useSession } from 'next-auth/react'
import { ReactNode, FC } from 'react'
import { User } from '@prisma/client'

export const OnlyUser: FC<{user: User, children: ReactNode}> = ({ user, children }) => {
  const { data: session } = useSession()
  return (<>{
    session?.user?.id === user.id ? (
      children
    ): ""
  }</>)
}

export const OnlyOtherUsers: FC<{user: User, children: ReactNode}> = ({ user, children }) => {
  const { data: session } = useSession()
  return (<>{
    session && session?.user?.id !== user.id ? (
      children
    ): ""
  }</>)
}

export const OnlyLoggedIn: FC<{children: ReactNode}> = ({ children }) => {
  const { data: session } = useSession()
  return (<>{
    session? (
      children
    ): ""
  }</>)
}