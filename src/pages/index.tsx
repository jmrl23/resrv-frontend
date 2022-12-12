import { serialize } from 'cookie'
import type { GetServerSideProps, NextPage } from 'next'

const Home: NextPage<Props> = ({ user }) => {
  switch (user.UserLevel.role) {
    case 'ADMIN':     return <Admin />
    case 'REGISTRY':  return <Registry />
    case 'STUDENT':   return <Student />
    default:          return null
  }
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
        authorization: `Bearer ${context.req.cookies?.authorization}`
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

type Props = {
  user: any
}

export default Home

function Admin() {
  return (
    <p>
      Admin
    </p>
  )
}

function Registry() {
  return (
    <p>
      Registry
    </p>
  )
}

function Student() {
  return (
    <p>
      Student
    </p>
  )
}
