import { trpc } from "@src/trpc"
import { useSession } from "next-auth/react"
import { createContext, FC, ReactNode, useState } from "react"
import { ExtendedUser } from "types/combined"

export const userContext = createContext<{user: ExtendedUser | undefined, setUser: (user: ExtendedUser)=>any, refetch: ()=>any}>({
  user:undefined,
  setUser: ()=>{},
  refetch: ()=>{}
})

export const UserProvider: FC<{children: ReactNode}> = ({ children }) => {
  const { data: session, status} = useSession()
  const [userData, setUserData ] = useState<ExtendedUser | undefined>()
  const { refetch } = trpc.useQuery(["user.data", {id: session?.user.id || ""}], {
    enabled: status==="authenticated",
    onSuccess(data) {
      setUserData(data)
    }
  })
  return (
    <userContext.Provider value={{
        user: userData,
        setUser: setUserData,
        refetch
    }}>
        {children}
    </userContext.Provider>
  )
}