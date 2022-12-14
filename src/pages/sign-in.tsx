import type { GetServerSideProps, NextPage } from 'next'
import { useRef } from 'react'
import { serialize } from 'cookie'
import Image from 'next/image'
import Head from 'next/head'

const SignIn: NextPage<{
  error: string | undefined;
}> = ({ error }) => {
  const errorContainer = useRef<HTMLDivElement>(null)

  return (
    <>
      <Head>
        <title>Resrv | Sign In</title>
      </Head>
      <main className="flex flex-col lg:flex-row min-h-screen">
        <section className="w-full lg:max-w-screen-sm flex flex-col h-screen justify-center p-4">
          <div className="mt-auto">
            <Image
              className="mx-auto w-[200px]"
              src="/assets/image/app-logo.svg"
              width="129"
              height="32"
              alt="Subject Reservation System Logo"
            />
            <p className="my-8 text-black/60 text-center text-sm">
              Sign in with your organization&apos;s email
            </p>
            {error && (
              <div
                className="bg-red-100 border border-red-500 text-red-500 rounded pl-4 pr-2 py-2 my-4 max-w-sm mx-auto flex justify-between"
                ref={errorContainer}
              >
                <div>
                  <h3 className="font-bold uppercase">Error</h3>
                  <p>{error}</p>
                </div>
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 lg:cursor-pointer"
                    onClick={() => errorContainer.current?.remove()}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              </div>
            )}
            <a
              className="btn btn-black px-4 py-2 flex items-center justify-center gap-x-2 max-w-[250px] mx-auto"
              href="/api/auth/google"
              tabIndex={1}
              title="Sign In"
            >
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 48 48"
              >
                <defs>
                  <path
                    id="a"
                    d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"
                  />
                </defs>
                <clipPath id="b">
                  <use xlinkHref="#a" overflow="visible" />
                </clipPath>
                <path clipPath="url(#b)" fill="#FBBC05" d="M0 37V11l17 13z" />
                <path
                  clipPath="url(#b)"
                  fill="#EA4335"
                  d="M0 11l17 13 7-6.1L48 14V0H0z"
                />
                <path
                  clipPath="url(#b)"
                  fill="#34A853"
                  d="M0 37l30-23 7.9 1L48 0v48H0z"
                />
                <path
                  clipPath="url(#b)"
                  fill="#4285F4"
                  d="M48 48L17 24l-4-3 35-10z"
                />
              </svg>
              Continue with Google
            </a>
          </div>
          <footer className="mt-auto">
            <p className="text-black/60 text-center text-sm">
              PTC Subject Reservation System
            </p>
          </footer>
        </section>
        <section className="grow h-[300px] lg:h-auto grid relative lg:rounded-l-3xl lg:mx-0 place-items-center overflow-hidden">
          <Image
            className="abolute left-0 top-0 -z-10 object-cover h-full"
            placeholder="blur"
            blurDataURL="data:image/gif;base64,UklGRjIAAABXRUJQVlA4ICYAAABwAQCdASoBAAEAAUAmJYgCdAFAAAD++fsDXFzZEUfuj97fxyzQAA=="
            src="/assets/image/login-side-banner.webp"
            alt="PTC front view"
            width="4000"
            height="2457"
          />
        </section>
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<{
  error?: string | null;
}> = async (context) => {
  const { token, error } = context.query

  // if token is present
  if (token) {
    await fetch(`${process.env.BACKEND_URL}/user/current`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((user) => 'error' in user)
      .then((invalid) => {
        if (invalid) return
        context.req.cookies.session = token as string
        context.res.setHeader(
          'Set-Cookie',
          serialize('session', token as string, {
            path: '/',
            maxAge: 1000 * 60 * 60 * 24 * 30,
          })
        )
      })
  }

  const { session } = context.req.cookies

  // if session is present
  if (session)
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }

  const errorMap = new Map<string | string[], string>()
  errorMap.set('1', 'Invalid email')

  // if error is present
  if (error) return { props: { error: errorMap.get(error) ?? null } }

  return {
    props: {},
  }
}

export default SignIn
