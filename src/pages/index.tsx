import type { GetServerSideProps, NextPage } from 'next'
import type { User } from '../types'
import { serialize } from 'cookie'
import { Role } from '../types'
import { Admin, Disabled, Registry, Student } from '../views'

const Home: NextPage<{ user: User }> = (props) => {
  const { user } = props
  const role = user.UserLevel?.role

  if (user.isDisabled) return <Disabled user={user} />

  return (
    <>
      {role === Role.ADMIN && <Admin {...props} />}
      {role === Role.REGISTRY && <Registry />}
      {role === Role.STUDENT && <Student />}
    </>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps<{ user: User }> = async (
  context
) => {
  const { session } = context.req.cookies

  try {
    // if no session, redirect to login
    if (!session) throw new Error()

    // validate session token
    const user: User = await fetch(`${process.env.BACKEND_URL}/user/current`, {
      headers: { Authorization: `Bearer ${session}` }
    }).then((response) => response.json())

    // if session is expired or invalid
    if ('error' in user) throw new Error()

    return { props: { user } }
  } catch (_error) {
    context.res.setHeader(
      'Set-Cookie',
      serialize('session', '-', {
        path: '/',
        maxAge: 0
      })
    )

    return {
      redirect: {
        destination: '/sign-in',
        permanent: false
      }
    }
  }
}
