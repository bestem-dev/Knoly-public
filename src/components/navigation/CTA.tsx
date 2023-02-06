
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { FC } from "react";
import { Button, Tooltip } from "@mui/material";
import LoginIcon from '@mui/icons-material/Login';
import { useRouter } from "next/router";


const CTA: FC = () => {
  const router = useRouter()
  const session = useSession()

  if (session.status === "unauthenticated") return (
    <Tooltip title="Unirse a Knoly (o iniciar sesión)">
      <Link href={{pathname: "/auth/login", query: {callbackUrl: router.asPath}}}passHref>
        <Button variant="text" sx={{color: "white"}}>
          Unirse a Knoly <LoginIcon/>
        </Button>
      </Link>
    </Tooltip>
  )

  return (<></>)
}

export default CTA