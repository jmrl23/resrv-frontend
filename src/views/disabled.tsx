import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/router'
import { useCookies } from 'react-cookie'
import type { FC, MouseEventHandler } from 'react'
import type { User } from '../types'

export const Disabled: FC<{ user: User }> = ({ user }) => {

  const [_cookies, _setCookies, removeCookies] = useCookies(['session'])
  const router = useRouter()
  const handleSignOut: MouseEventHandler<HTMLButtonElement> = () => {
    if (!router.isReady) return
    removeCookies('session')
    router.push('/sign-in')
  }

  return (
    <div className='p-4 h-screen flex items-center'>
      <div className='w-screen'>
        <div className='shadow rounded-lg prose p-4 text-slate-900 max-w-screen-sm mx-auto'>
          <h2 className='text-red-500'>
            Account Disabled
          </h2>
          <p>
            Paumanhin {user.givenName},
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Pariatur obcaecati, facilis consequuntur odio dolorum facere blanditiis perferendis, nostrum distinctio aliquid, vel inventore suscipit asperiores quibusdam. Rem voluptatum soluta nostrum accusantium!
          </p>
          <div className='flex justify-end'>
            <button className='btn btn-red flex gap-x-2' type='button' title='Sign out' onClick={handleSignOut}>
              <ArrowLeftOnRectangleIcon className='w-6 h-6' />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
