import type { FC } from 'react'
import type { User } from '../types'
import { useState } from 'react'
import { Departments, Header, Sidebar, Students } from '../components'
import {
  BuildingOffice2Icon,
  UsersIcon,
  CalendarDaysIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline'
import Head from 'next/head'

export const Registry: FC<{ user: User }> = ({ user }) => {
  const [page, setPage] = useState<string>('reservations')

  return (
    <>
      <Head>
        <title>Resrv | Registry</title>
      </Head>
      <Sidebar>
        <button
          className={page === 'reservations' ? 'active' : ''}
          type='button'
          title='departments'
          onClick={() => setPage('reservations')}
        >
          <CalendarDaysIcon className='w-6 h-6' />
          <span>Reservations</span>
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
          className={page === 'departments' ? 'active' : ''}
          type='button'
          title='departments'
          onClick={() => setPage('departments')}
        >
          <BuildingOffice2Icon className='w-6 h-6' />
          <span>Departments</span>
        </button>
        <button
          className={page === 'courses' ? 'active' : ''}
          type='button'
          title='courses'
          onClick={() => setPage('courses')}
        >
          <BookOpenIcon className='w-6 h-6' />
          <span>Courses</span>
        </button>
      </Sidebar>
      <main className='main-container'>
        <Header activePage={page} user={user} />
        <section>
          {page === 'departments' && <Departments />}
          {page === 'students' && <Students />}
        </section>
      </main>
    </>
  )
}
