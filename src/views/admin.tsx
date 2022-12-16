import type { FC } from 'react'
import type { User } from '../types'
import { useState } from 'react'
import {
  Departments,
  Header,
  Moderators,
  Sidebar,
  Students
} from '../components'
import {
  BuildingOffice2Icon,
  UsersIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

export const Admin: FC<{ user: User }> = ({ user }) => {
  const [page, setPage] = useState<string>('departments')

  return (
    <>
      <Sidebar>
        <button
          className={page === 'departments' ? 'active' : ''}
          type="button"
          title="departments"
          onClick={() => setPage('departments')}
        >
          <BuildingOffice2Icon className="w-6 h-6" />
          <span>Departments</span>
        </button>
        <button
          className={page === 'students' ? 'active' : ''}
          type="button"
          title="students"
          onClick={() => setPage('students')}
        >
          <UsersIcon className="w-6 h-6" />
          <span>Students</span>
        </button>
        <button
          className={page === 'moderators' ? 'active' : ''}
          type="button"
          title="moderators"
          onClick={() => setPage('moderators')}
        >
          <UserGroupIcon className="w-6 h-6" />
          <span>Moderators</span>
        </button>
      </Sidebar>
      <main className="main-container">
        <Header activePage={page} user={user} />
        <section>
          {page === 'departments' && <Departments />}
          {page === 'students' && <Students />}
          {page === 'moderators' && <Moderators />}
        </section>
      </main>
    </>
  )
}
