import type { FC } from 'react'
import type { User } from '../types'
import { useState } from 'react'
import { Programs, Header, Moderators, Sidebar, Students } from '../components'
import {
  BuildingOffice2Icon,
  UsersIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'
import Head from 'next/head'

export const Admin: FC<{ user: User }> = ({ user }) => {
  const [page, setPage] = useState<string>('programs')

  return (
    <>
      <Head>
        <title>Resrv | Admin</title>
      </Head>
      <Sidebar>
        <button
          className={page === 'programs' ? 'active' : ''}
          type='button'
          title='programs'
          onClick={() => setPage('programs')}
        >
          <BuildingOffice2Icon className='w-6 h-6' />
          <span>Programs</span>
        </button>
        <button
          className={page === 'students' ? 'active' : ''}
          type='button'
          title='students'
          onClick={() => setPage('students')}
        >
          <UsersIcon className='w-6 h-6' />
          <span>Students</span>
        </button>
        <button
          className={page === 'moderators' ? 'active' : ''}
          type='button'
          title='moderators'
          onClick={() => setPage('moderators')}
        >
          <UserGroupIcon className='w-6 h-6' />
          <span>Moderators</span>
        </button>
      </Sidebar>
      <main className='main-container'>
        <Header activePage={page} user={user} />
        <section>
          {page === 'programs' && <Programs />}
          {page === 'students' && <Students />}
          {page === 'moderators' && <Moderators />}
        </section>
      </main>
    </>
  )
}
