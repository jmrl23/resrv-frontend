import { type FC, useState, useCallback } from 'react'
import { Role } from '../types'
import { useRouter } from 'next/router'
import { useCookies } from 'react-cookie'
import Image from 'next/image'

export const Header: FC<{
  activePage: string,
  role: Role,
  givenName: string,
  picture: string
}> = ({ activePage, role, givenName, picture }) => {

  const router = useRouter()
  const [optionVisible, setOptionVisible] = useState<boolean>(false)
  const [_cookies, _setCookie, removeCookie] = useCookies(['authorization'])
  const signOut = useCallback((e: MouseEvent) => {
    e.preventDefault()
    removeCookie('authorization')
    router.push('/sign-in')
  }, [router, removeCookie])

  return (
    <header className="border-b border-b-gray-200 p-4 flex justify-between items-center sticky top-0 bg-white z-10 gap-x-">
      <h2 className="font-poppins text-sm md:text-2xl font-bold capitalize">
        { activePage }
      </h2>

      <div className="relative">
        <div className="text-sm md:text-base flex rounded-xl font-medium bg-gray-200 hover:bg-gray-300 transition-colors hover:font-semibold p-4 gap-x-2 items-center cursor-default md:cursor-pointer"  onClick={() => setOptionVisible(!optionVisible)}>
          <div className="rounded-full overflow-hidden w-10 h-10">
            <Image 
              className="w-full h-full"
              src={picture} 
              alt="User's picture"
              width="150"
              height="150"
            />
          </div>
          <p className="flex items-center gap-x-2">
            <span className="font-bold hidden md:inline">
              { role }
            </span> 
            <span className="overflow-hidden max-w-[250px] text-ellipsis">
              { givenName }
            </span>
          </p>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z" clipRule="evenodd" />
          </svg>
        </div>
        <div className={'p-4 shadow w-full rounded-lg bg-white absolute flex flex-col gap-y-4 ' + (optionVisible ? '' : 'invisible -z-50')}>
          {
            role === Role.STUDENT && (
              <a className="btn flex gap-x-2" href="#">
                <span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
                  </svg>          
                </span>
                <span>
                  Profile
                </span>
              </a>
            )
          }
          
          <a className="btn btn-red flex gap-x-2" href="#" onClick={signOut as () => void}>
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm5.03 4.72a.75.75 0 010 1.06l-1.72 1.72h10.94a.75.75 0 010 1.5H10.81l1.72 1.72a.75.75 0 11-1.06 1.06l-3-3a.75.75 0 010-1.06l3-3a.75.75 0 011.06 0z" clipRule="evenodd" />
              </svg>      
            </span>
            <span>
              Sign out
            </span>
          </a>
        </div>
      </div>

    </header>
  )
}
