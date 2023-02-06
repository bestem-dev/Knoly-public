import { Stack, Typography } from '@mui/material'
import { WagmiConfig, createClient } from 'wagmi'
import { getDefaultProvider } from 'ethers'
import { getCsrfToken, signIn, useSession } from 'next-auth/react'
import { FC, useReducer, useRef, useState } from 'react'
import { SiweMessage } from 'siwe' 
import { Connector, useConnect, useAccount, useSignMessage } from 'wagmi'
import NoSSR from '@components/NoSSR'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { trpc } from '@src/trpc';
import { BrandedSignInButton } from './BrandedSignInButton';
import { useRouter } from 'next/router';
import { handleLoginCallback } from '@src/utils/urls';

interface ConnectButtonListType {
  handleLogin: (conn: Connector) => void,
  connectors: Connector[],
  isConnecting: boolean,
  errorMsg: any
}

const ConnectButtonList: FC<ConnectButtonListType> = ({handleLogin, connectors, isConnecting, errorMsg}) => (
  <Stack
    sx={{
      textAlign:"center",
      paddingTop:2
      // padding: 1,
      // border:1,
      // borderRadius: 1,
      // borderColor: "lightgray"
    }}
  >
    {/* <Typography>Inicia sesión con:</Typography> */}
    <Typography>Conectar Wallet</Typography>
      {connectors.map((x: Connector) => (x.ready ?
        <BrandedSignInButton
          name={x.name}
          id={x.id}
          onClick={() => handleLogin(x)}
          loading={isConnecting}
        />
        // <LoadingButton variant='contained'
        //   loading={isConnecting}// || (isConnecting && pendingConnector?.id === x.id)}
        //   key={x.id} onClick={() => handleLogin(x)}
        //   sx={{my:1}}
        // >
        // {x.name}
        // </LoadingButton>
      :""))}
    {errorMsg && <div>{errorMsg.message}</div>}
  </Stack>
)

const client = createClient({
  autoConnect: true,
  provider: getDefaultProvider(),
})

const BaseComponent: FC = () => {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [ signatureTimedOut, timeOutSignature ] = useReducer(() => false, true)
  const [ signingIn, setSigningIn ] = useState(false)
  const { address, connector: activeConnector, isConnected } = useAccount()
  const {
    // connectors,
    connectAsync,
    error: errorMsg,
    isLoading: isConnecting,
    pendingConnector,
  } = useConnect()

  const connectors = [
    new InjectedConnector(),
    new WalletConnectConnector({
      options: {
        qrcode: true,
      },
    })
  ]

  const userQuery = trpc.useQuery(["user.data", {id: session?.user.id || ""}], {enabled:status==="authenticated"})

  const message = useRef(new SiweMessage({}))

  const { data, isSuccess, signMessage, isIdle, isLoading } = useSignMessage({
    onSuccess: async (data) => {
      console.log(message.current)
      console.log(data)
      console.log(userQuery.data)
      // let callbackUrl
      // if (userQuery.data?.status === "registered") {
      //   callbackUrl = "/users/" + address
      // }
      // else {
      //   callbackUrl = "/auth/register"
      // }
      setSigningIn(true)
      signIn('Ethereum', { message: JSON.stringify(message.current), signature:data,
        callbackUrl: handleLoginCallback(router.query) || "/auth/login"
      })
    }
  })
  
  const handleLogin = async (conn: Connector) => {
    try {
      let connector: Connector
      console.log(activeConnector)
      console.log(conn)
      if (!activeConnector) {
        const connResult = (await connectAsync({connector: conn})).connector
        if (!connResult) throw Error ("No connector")
        connector = connResult;
      }
      else {
        connector = activeConnector
      }
      console.log("connected")

      web3SignIn(connector)
      setTimeout(timeOutSignature, 5000)
    } catch (error) {
      window.alert(error)
    }
  }

  const web3SignIn = async (connector: Connector) => {
    message.current = new SiweMessage({
      domain: window.location.host,
      address: await connector.getAccount(),
      statement: 'Sign in with Ethereum to the app.',
      uri: window.location.origin,
      version: '1',
      chainId: await connector.getChainId(),
      nonce: await getCsrfToken()
    })

    signMessage({
      message: message.current.prepareMessage()
    });
  }

  return (
    <NoSSR>        
      {
        isConnected? (
          <BrandedSignInButton
            name="Ethereum Wallet"
            id="ethereum"
            onClick={() => web3SignIn(activeConnector!)}
            loading={signingIn || (isLoading && !signatureTimedOut) || userQuery.isFetching}// || (isConnecting && pendingConnector?.id === x.id)}
          />
        ):
        <ConnectButtonList
          handleLogin={handleLogin}
          connectors={connectors}
          isConnecting={isConnecting}
          errorMsg={errorMsg}
        />
      }
    </NoSSR>
  )
}

const WalletLogin: FC = () => (
  <WagmiConfig client={client}>
    <BaseComponent/>
  </WagmiConfig>
)

export default WalletLogin