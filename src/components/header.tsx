import Image from 'next/image'
import type { User } from '../types'
import {
  type FC,
  MouseEvent,
  MouseEventHandler,
  useCallback,
  Fragment
} from 'react'
import { Role } from '../types'
import { useRouter } from 'next/router'
import { useCookies } from 'react-cookie'
import {
  ChevronDownIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline'
import { Menu, Transition } from '@headlessui/react'

export const Header: FC<{
  activePage: string
  user: User
}> = ({ activePage, user }) => {
  const router = useRouter()
  const [_cookies, _setCookie, removeCookie] = useCookies(['session'])
  const handleSignOut: MouseEventHandler<HTMLAnchorElement> = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault()
      removeCookie('session')
      router.push('/sign-in')
    },
    [router, removeCookie]
  )

  return (
    <header className='border-b border-b-gray-200 p-4 flex justify-between items-center sticky top-0 bg-white z-10 gap-x-'>
      <h2 className='font-poppins text-sm md:text-2xl font-bold capitalize'>
        {activePage}
      </h2>
      <Menu as='div' className='relative'>
        <Menu.Button className='text-sm md:text-base flex rounded-xl font-medium bg-gray-200 hover:bg-gray-300 transition-colors hover:font-semibold p-4 gap-x-2 items-center cursor-default'>
          <div className='rounded-full overflow-hidden w-10 h-10'>
            <Image
              className='w-full h-full'
              src={user?.picture ?? ''}
              alt={`${user?.givenName}'s picture`}
              width={150}
              height={150}
              priority
            />
          </div>
          <p className='flex items-center gap-x-2'>
            <span className='font-bold hidden md:inline'>
              {user?.UserLevel?.role}
            </span>
            <span className='overflow-hidden max-w-[250px] text-ellipsis'>
              {user?.givenName}
            </span>
          </p>
          <ChevronDownIcon className='w-6 h-6' />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter='transition ease-out duration-100'
          enterFrom='transform opacity-0 scale-95'
          enterTo='transform opacity-100 scale-100'
          leave='transition ease-in duration-75'
          leaveFrom='transform opacity-100 scale-100'
          leaveTo='transform opacity-0 scale-95'
        >
          <div className='p-4 shadow w-full rounded-lg bg-white absolute flex flex-col gap-y-4'>
            {user.UserLevel?.role === Role.STUDENT && (
              <a className='btn flex gap-x-2' href='#'>
                <span>
                  <UserCircleIcon className='w-6 h-6' />
                </span>
                <span>Profile</span>
              </a>
            )}
            <a
              className='btn btn-red flex gap-x-2'
              href='#'
              onClick={handleSignOut}
            >
              <span>
                <ArrowLeftOnRectangleIcon className='w-6 h-6' />
              </span>
              <span>Sign out</span>
            </a>
          </div>
        </Transition>
      </Menu>
    </header>
  )
}
