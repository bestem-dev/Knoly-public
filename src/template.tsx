import type { NextPage } from 'next'
import LongScreenLayout from '@layouts/longScreenLayout'
import Head from 'next/head'
import MainAppBar from '@components/navigation/MainAppBar'


const Template: NextPage = () => {
  return (
    <>
      <Head>
        <title>{`Template | Knoly`}</title>
      </Head>
      <LongScreenLayout>
        <MainAppBar/>
        {/* Content */}
      </LongScreenLayout>
    </>
  )
}

export default Template