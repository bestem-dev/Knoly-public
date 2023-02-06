import type { NextPage } from 'next'
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import OneScreenLayout from '@layouts/oneScreenLayout';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import SwipeableViews from 'react-swipeable-views';
import { AppBar, Button, Fab, Tab, Tabs, Zoom } from '@mui/material';
import Box from '@mui/material/Box';
import SwitchCameraIcon from '@mui/icons-material/SwitchCamera';
import Skeleton from '@mui/material/Skeleton';
import LinkIcon from '@mui/icons-material/Link';
import { useEffect, useState } from 'react';
import theme from '@src/theme';
import { QRCodeSVG } from 'qrcode.react';
import QrReader from 'react-qr-scanner'

// import prisma from "@src/prisma"
// import { User } from '@prisma/client';
import { BackButton } from '@components/navigation/BackButton';
import Head from 'next/head';
// import { getCurrentURL } from '@src/utils/urls';
import { trpc } from '@src/trpc';


function a11yProps(index: any) {
  return {
    id: `action-tab-${index}`,
    'aria-controls': `action-tabpanel-${index}`,
  };
}

const transitionDuration = {
  enter: theme.transitions.duration.enteringScreen,
  exit: theme.transitions.duration.leavingScreen,
};

const CameraSwitchButtonStyle = {
  position: 'absolute',
  bottom: 16,
  right: 16,
};

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const session = await getSession(context)
//   context.res.setHeader("Cache-Control", 'public, s-maxage=10, stale-while-revalidate=59')
//   if (session) {
//     const user = await prisma.user.findUnique({
//       where: {
//         wallet: session.user.address
//       },
//     })
//     if (user) {
//       return {
//         props: {
//           user: JSON.parse(JSON.stringify(user)),
//         }
//       }
//     }
//   }
//   return {
//     props: {},
//     redirect: {
//       destination: "/"
//     }
//   }
// }


// const QrPage: NextPage<{user: User}> = ({ user }) => {
const QrPage: NextPage = () => {
  const router = useRouter()
  const [tab, setTab] = useState(0);
  const [ deviceList, setDeviceList ] = useState<MediaDeviceInfo[]>([])
  const [ url, setUrl ] = useState("")
  const [ scanned, setScanned ] = useState(false)
  const [ cameraId, setCameraId ] = useState<string>("")
  const { data: session, status } = useSession()
  const profileURL = `${url}/users/${session?.user.id}/`

  const userQuery = trpc.useQuery(["user.data", {id: session?.user.id || ""}], {enabled:status==="authenticated"})
  const loading = userQuery.isLoading || userQuery.isIdle
  const user = userQuery.data
  
  useEffect(() => {
    navigator.mediaDevices.enumerateDevices()
    .then((devices) => {
      const videoSelect: MediaDeviceInfo[] = []
      devices.forEach((device) => {
        if (device.kind === 'videoinput') {
          videoSelect.push(device)
        }
      })
      return videoSelect
    })
    .then((devices) => {
      let defaultDevice = devices.filter((d)=>d.label.includes("facing back"))[0] || devices[0]

      setCameraId(defaultDevice.deviceId)
      setDeviceList(devices)
    })
    .catch((error) => {
      console.log(error)
    })
    if (typeof window !== "undefined") {
      setUrl(window.location.origin)
    }
  }, [])

  const handleChange = (event: unknown, newValue: number) => {
    setTab(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setTab(index);
  };


  const handleQrScan = (data: any) => {
    // if (data) console.log(data)
    if (!scanned && tab===1){
      if (data?.text.slice(0, url.length) ===  url) {
        router.push(data.text)
        setScanned(true)
      }
    }
  }

  return (
    <>
      <Head>
        <title>QR | Knoly</title>
      </Head>
      <OneScreenLayout justifyContent='flex-start'>
        <AppBar position="fixed">
          <Stack 
            sx={{ width: "100%", justifyContent: "flex-start", alignItems: "flex-start"}}>
            <BackButton darkColor/>
          <Tabs
            value={tab}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            aria-label="action tabs example"
            sx={{ width: "100%"}}
          >
            <Tab label="Mi código" {...a11yProps(0)} />
            <Tab label="Escanear" {...a11yProps(1)} />
          </Tabs>
          </Stack>
        </AppBar>
        <SwipeableViews
          style={{
            overflow:"hidden"
          }}
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={tab}
          onChangeIndex={handleChangeIndex}
        >
          <Stack
            justifyContent={"space-around"}
            alignItems={"center"}
            sx={{
              height: "100vh",
              width: "100%"
            }}
          >
            <Stack
              alignItems="center"
            >
              <Box sx={{marginBottom: 2, marginTop: 12, background: "white", padding:2, borderRadius:4}}>
                {
                  url?
                  <QRCodeSVG
                    value={profileURL}
                    size={250}
                    />:""
                }
              </Box>
              <Typography variant='h4'>
                {loading? <Skeleton/>:
                user?.firstName + " " + user?.lastName}
              </Typography>
              <Typography>
                {loading? <Skeleton/>:
                user?.description}
              </Typography>
              <Button
                onClick={()=>{
                  navigator.clipboard.writeText(profileURL)
                }}
                sx={{marginY:2}}
              >
                Copiar Link <LinkIcon/>
              </Button>
            </Stack>
          </Stack>
          {/* <TabPanel value={tab} index={0} dir={theme.direction}> */}
          {/* </TabPanel> */}
          <Box>
            <QrReader
              style={{
                height: "100vh",
                // marginLeft:300,
                marginX: "auto",
                width: "100%",
                objectFit: "cover",
                overflow: "hidden"
              }}
              constraints={cameraId && ({ audio: false, video: { deviceId: cameraId } })}
              // chooseDeviceId={(a) => {
              //   console.log(a);
              //   console.log(camera)
              //   return a[0]
              // }}
              // facingMode={camera}
              onError={() => console.log("Error scanning")}
              onScan={handleQrScan}
            />
            <Box className="QR-cam-overlay"/>
          </Box>
        </SwipeableViews>
        {tab===1?
        <Zoom
            in={tab === 1}
            timeout={transitionDuration}
            style={{
              transitionDelay: `${tab === 1 ? transitionDuration.exit : 0}ms`,
            }}
            unmountOnExit
        >
          <Fab onClick={()=>{
            console.log("switched")
            const cameraIndex = (deviceList.map((d)=>d.deviceId).indexOf(cameraId) + 1) % deviceList.length
            console.log(cameraIndex)
            setCameraId(deviceList[cameraIndex].deviceId)
          }} sx={CameraSwitchButtonStyle}>
            <SwitchCameraIcon/>
          </Fab>
        </Zoom>
        :""
        }
      </OneScreenLayout>
    </>
  );
}

export default QrPage;
