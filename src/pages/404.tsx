import { NextPage } from 'next'
import Head from 'next/head'

const NotFound: NextPage<{}> = () => {
  return (
    <>
      <Head>
        <title>
          Resrv | Error
        </title>
      </Head>
      <main className='h-screen overflow-hidden grid place-items-center p-4 font-poppins w-full text-slate'>
        <div className='prose'>
          <h1>
            404
          </h1>
          <p>
            The page you are looking for might have been removed or temporary unavailable.
          </p>
        </div>
      </main>
    </>
  )
}

export default NotFound
