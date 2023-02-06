import { width } from "@mui/system";
import { getCurrentURL } from "@src/utils/urls";
import Head from "next/head";
import { useRouter } from "next/router";
import { FC } from "react";

export const Metadata: FC<{title?: string, description?:string |null, image?:string | null}> = ({title, description, image}) => {
  const router = useRouter()
  const currentURL = getCurrentURL() + router.pathname
  title = title || "Knoly"
  description = description || "Registro Verificable de Conocimiento Humanos"
  image = image || getCurrentURL() + "/assets/images/welcome/knoly_header.png"
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description}/>

      <meta property="og:url" content={currentURL}/>
      <meta property="og:type" content="website"/>
      <meta property="og:title" content={title}/>
      <meta property="og:description" content={description}/>
      <meta property="og:image" content={image}/>

      <meta name="twitter:card" content="summary_large_image"/>
      <meta property="twitter:domain" content="app.knoly.me"/>
      <meta property="twitter:url" content={currentURL}/>
      <meta name="twitter:title" content={title}/>
      <meta name="twitter:description" content={description}/>
      <meta name="twitter:image" content={image}/>
    </Head>
  )
};
