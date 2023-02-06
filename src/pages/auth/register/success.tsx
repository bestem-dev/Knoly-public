import { NextPage } from "next";
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import { Button, Stack, Typography } from "@mui/material";
import Link from "next/link";

import OneScreenLayout from "@layouts/oneScreenLayout";
import { useRouter } from "next/router";

const RegisterSuccessPage: NextPage = () => {
  const router = useRouter()
  const { userId } = router.query

  return (
    <OneScreenLayout>
      <Stack
        alignItems="center"
        spacing={2}
        >
        <CheckCircleOutlineOutlinedIcon
          color="success"
          sx={{
            fontSize: 160
          }}
        />
        <Typography variant="h4"style={{
            textAlign: "center"
          }}>
          Tu cuenta ha sido creada exitosamente.
        </Typography>
        <Typography style={{
            textAlign: "center"
          }}>
          ¡Termina de completar tu perfil para empezar tu experiencia en Knoly!
        </Typography>
      </Stack>

      <Link href={`/users/${userId}/edit`} passHref>
        <Button variant="contained">
          Continuar
        </Button>
      </Link>
    </OneScreenLayout>
  )
}

export default RegisterSuccessPage