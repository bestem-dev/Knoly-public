
import { signOut, useSession } from "next-auth/react";
import CropSquareIcon from '@mui/icons-material/CropSquare';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import { useRouter } from "next/router";

const useSessionButton = () => {
  const session = useSession()
  const router = useRouter()
  if (session.status === "authenticated") {
    return {
      buttonText: "Cerrar Sesión",
      onClick: async () => {
            signOut({callbackUrl: "/"})
          },
      icon: LogoutIcon
    }
  }
  if (session.status === "loading") return {
    buttonText: "Cargando",
    onClick: undefined,
    icon: CropSquareIcon
  }

  return {
    buttonText: "Iniciar Sesión",
    onClick: () => router.push("/"),
    icon: LoginIcon
  }
}

export default useSessionButton