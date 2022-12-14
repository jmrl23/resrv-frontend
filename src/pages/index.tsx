import type { GetServerSideProps, NextPage } from 'next'
import { serialize } from 'cookie'
import Head from 'next/head'
import type { FC, SetStateAction, Dispatch } from 'react'
import { useState, useEffect } from 'react'
import { 
  SideNav as AdminSideNav,
  Content as AdminContent
} from '../components/admin'
import { Header } from '../components'
import { TargetModal } from '../types'

const Home: NextPage<{
  user: any
}> = ({ user }) => {

  const [modal, setModal] = useState<TargetModal>(null)
  const role = user.UserLevel.role

  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', !!modal)
  }, [modal])

  return (
    <>
      { role === 'ADMIN'    &&  <Admin user={user} modal={modal} setModal={setModal} /> }
      { role === 'REGISTRY' &&  <Registry /> }
      { role === 'STUDENT'  &&  <Student /> }
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (!context.req.cookies?.authorization) {
    return {
      redirect: {
        destination: '/sign-in',
        permanent: false
      },
      props: {}
    }
  }
  try {
    const data = await fetch(`${process.env.BACKEND_URL}/user/current`, {
      headers: {
        Authorization: `Bearer ${context.req.cookies?.authorization}`
      }
    })
    .then(data => data.json())
    if (!data.error) return { props: { user: data } }
    throw new Error(data.error)
  } catch(error) {
    context.res.setHeader('Set-Cookie', [
      serialize('authorization', '', {
        path: '/',
        httpOnly: true,
        maxAge: 0
      })
    ])
    return {
      redirect: {
        destination: '/sign-in?error=2',
        permanent: false
      },
      props: {}
    }
  }
}

export default Home

const Admin: FC<{
  user: any,
  modal: TargetModal,
  setModal: Dispatch<SetStateAction<TargetModal>>
}> = ({ user, modal, setModal }) => {
  const [activePage, setActivePage] = useState<string>('departments')

  return (
    <>
      <Head>
        <title>
          Resrv | Admin
        </title>
      </Head>
      <AdminSideNav activePage={activePage} setActivePage={setActivePage} />
      <main className='main-container'>
        <Header activePage={activePage} {...user} role={user?.UserLevel?.role} />
        <AdminContent activePage={activePage} modal={modal} setModal={setModal} />
      </main>
    </>
  )
}

const Registry: FC<{

}> = () => {
  return (
    <p>
      Registry
    </p>
  )
}

const Student: FC<{

}> = () => {
  return (
    <p>
      Student
    </p>
  )
}
