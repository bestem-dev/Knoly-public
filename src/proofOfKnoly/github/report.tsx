import { CircularProgressWithLabel } from "@components/CircularProgressWithLabel"
import { buttonImages } from "@components/login/BrandedSignInButton"
import { Chip, Dialog, LinearProgress, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material"
import { Box } from "@mui/system"
import { Account, proofOfKnoly, ScrapedData } from "@prisma/client"
import { capitalizeWord, dateFormatter } from "@src/utils/text"
import Image from "next/image"
import { FC, useState } from "react"

const GitHubReport: FC<{
    data: proofOfKnoly & {source: Account | null, dataSources: ScrapedData[]}
}> = ({data}) => {
  const [ open, setOpen ] = useState(false)

  const langScores = Object.fromEntries(
    Object.entries((data.content as any).skillScores as {[k:string]: number}).sort(([,a],[,b]) => b-a)
  )
  const maxLangScore = Object.values(langScores)[0]

  return (
  <>
    <ListItemButton onClick={()=>setOpen(true)}>
      <ListItemIcon>
        <Box sx={{background: "white", borderRadius:"50%", padding:0.5, height:38, width:38}}>
          <Image src={buttonImages[(data.content as any).source].imageUrl} height={32} width={32} alt={(data.content as any).source}></Image>
        </Box>
      </ListItemIcon>
      <ListItemText primary={<>
        <Typography sx={{display:"inline"}}>
          {(data.dataSources[0].data as any).rest.login}
        </Typography>
        {" - "}{capitalizeWord((data.content as any).source)}
      </>} secondary={<>
        Verificado: {dateFormatter.format(new Date(data.dataSources[0].added))}
      </>} />
    </ListItemButton>
    <Dialog open={open} onClose={()=>setOpen(false)}>
      <List sx={{padding: 2}}>
        <ListItem key="title">
          <ListItemText primary={<Typography variant="h5" sx={{fontWeight: "bold"}}>Lenguaje</Typography>}/>
          <ListItemIcon sx={{paddingLeft: 2, marginX: "auto"}}>
            Puntos
          </ListItemIcon>
        </ListItem>
        {
          Object.keys(langScores).map((skill) => (
            <ListItem key={(data.content as any).skillScores[skill]}>
              <ListItemText primary={skill} secondary={(
                <LinearProgress variant="determinate" value={langScores[skill]/maxLangScore * 100}
                sx={{minWidth:150}}/>
              )}/>
              <ListItemIcon sx={{paddingLeft: 2, marginX: "auto"}}>
                <Chip sx={{width:50}}label={Math.round(langScores[skill]/maxLangScore * 100)}/>
              </ListItemIcon>
            </ListItem>
          ))
        }
      </List>
    </Dialog>
  </>
  )
}

export default GitHubReport


