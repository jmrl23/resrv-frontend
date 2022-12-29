import { Switch } from '@headlessui/react'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import {
  type FC,
  useEffect,
  useState,
  useRef,
  useCallback,
  type FormEvent,
  type FormEventHandler,
  type Dispatch,
  type SetStateAction
} from 'react'
import { useCookies } from 'react-cookie'
import { toast } from 'react-toastify'
import { type Program, Role, type User } from '../types'
import { Modal } from './modal'
import Link from 'next/link'
import useSWR, { useSWRConfig } from 'swr'

export const Students: FC<Record<string, never>> = () => {
  const [cookies] = useCookies(['session'])
  const [skip, setSkip] = useState<number>(0)
  const [modal, setModal] = useState<{
    for: string
    data?: Record<string, unknown>
  } | null>(null)
  const take = 20
  const searchFormRef = useRef<HTMLFormElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const filterProgramRef = useRef<HTMLSelectElement>(null)
  const programFetcher = async () => {
    return fetch('/api/program/list', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cookies.session}`,
        'Content-Type': 'application/json'
      }
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.message)
          return []
        }
        return data
      })
  }
  const studentFetcher = useCallback(async () => {
    if (!searchInputRef.current || !filterProgramRef.current) return []
    const keyword = searchInputRef.current.value.trim()
    const programId = filterProgramRef.current.value.trim()
    const payload: Record<string, unknown> = {
      role: [Role.STUDENT],
      skip: parseInt(skip as unknown as string, 10),
      take
    }
    if (keyword) payload.keyword = keyword
    if (programId && programId !== 'placeholder') payload.programId = programId
    return fetch('/api/user/list', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cookies.session}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.message)
          return []
        }
        return data
      })
  }, [searchInputRef, filterProgramRef, cookies.session, skip])
  const { data: programs } = useSWR<Program[]>(
    '/api/program/list',
    programFetcher
  )
  const { data: students, isLoading } = useSWR<User[]>(
    '/api/user/list',
    studentFetcher
  )
  const { mutate } = useSWRConfig()
  const handleSearchSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    (event: FormEvent) => {
      event.preventDefault()
      mutate('/api/user/list')
    },
    [mutate]
  )

  useEffect(() => {
    if (isLoading) return
    mutate('/api/user/list')
  }, [mutate, skip, isLoading])

  if (isLoading) return <p className='font-bold'>Loading..</p>

  return (
    <div>
      <div className='flex flex-col gap-x-2 gap-y-4 md:flex-row justify-between border-b border-b-gray-200 pb-4'>
        <form
          className='flex gap-x-2 w-full md:max-w-screen-sm'
          ref={searchFormRef}
          onSubmit={handleSearchSubmit}
        >
          <input
            className='border-none rounded-md bg-gray-200 px-4 py-2 w-[calc(100%-4rem)]'
            placeholder='Search'
            type='search'
            name='q'
            ref={searchInputRef}
          />
          <button className='btn w-14' type='submit'>
            <MagnifyingGlassIcon className='w-6 h-6' />
          </button>
        </form>
        <div className='flex justify-end gap-x-2'>
          <button
            className='btn'
            type='button'
            title='previous'
            onClick={() => {
              setSkip((value) => {
                if (!value) return 0
                if (value - take < 0) return value
                return value - take
              })
            }}
          >
            <ChevronLeftIcon className='w-6 h-6' />
          </button>
          <select
            className='border-none bg-gray-200 rounded-md text-sm grow md:-order-1'
            title='Filter by Program'
            ref={filterProgramRef}
            onChange={() => mutate('/api/user/list')}
          >
            <option value='placeholder' defaultChecked>
              Filter by program
            </option>
            {programs?.map((program) => (
              <option key={program.id} value={program.id}>
                {program.alias}
              </option>
            ))}
          </select>
          <button
            className='btn'
            type='button'
            title='next'
            onClick={() => {
              setSkip((value) => {
                if (!value) return take
                return value + take
              })
            }}
          >
            <ChevronRightIcon className='w-6 h-6' />
          </button>
        </div>
      </div>
      <div className='overflow-x-auto mt-4'>
        <table>
          <thead>
            <tr>
              <th>Enable</th>
              <th>Email</th>
              <th>Name</th>
              <th>Program</th>
              <th>{/* actions */}</th>
            </tr>
          </thead>
          <tbody>
            {!isLoading &&
              students?.map((student) => (
                <StudentsTableRow
                  key={student.id}
                  student={student}
                  mutate={() => mutate('/api/user/list')}
                  setModal={setModal}
                />
              ))}
          </tbody>
        </table>
      </div>
      {modal && modal?.for === 'delete' && (
        <StudentsDeleteModal
          mutate={() => mutate('/api/student/list')}
          hide={() => setModal(null)}
          modal={modal}
        />
      )}
    </div>
  )
}

export const StudentsTableRow: FC<{
  student: User
  mutate: () => void
  setModal: Dispatch<
    SetStateAction<{
      for: string
      data?: Record<string, unknown> | undefined
    } | null>
  >
}> = ({ student, mutate, setModal }) => {
  const [enabled, setEnabled] = useState<boolean>(!student.isDisabled)
  const [cookies] = useCookies(['session'])

  const handleOnChange = (_event: MouseEvent) => {
    fetch('/api/user/toggle', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cookies.session}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: student.id,
        state: enabled
      })
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) return toast.error(data.message)
        setEnabled(!data.isDisabled)
      })
      .finally(() => mutate())
    setEnabled(!enabled)
  }

  return (
    <tr>
      <td>
        <Switch
          className={
            'relative inline-flex h-[25px] w-[50px] cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 ' +
            (enabled ? 'bg-[#0ACF83]' : 'bg-[#F0F0F0]')
          }
          checked={enabled}
          onChange={handleOnChange as () => void}
          title='Toggle'
          type='button'
        >
          <span
            className={
              'pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out' +
              (enabled ? ' translate-x-[25px]' : '')
            }
          ></span>
        </Switch>
      </td>
      <td>{student.email}</td>
      <td>{student.displayName}</td>
      <td>
        {student.StudentInformation?.program?.id ?? (
          <span className='text-gray-400'>N/A</span>
        )}
      </td>
      <td>
        <div className='flex gap-x-2'>
          <Link href={`/profile/${student.email}`} target='_blank'>
            <button type='button' className='btn'>
              View
            </button>
          </Link>
          <button
            type='button'
            className='btn btn-red'
            onClick={() => setModal({ for: 'delete', data: student })}
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  )
}

export const StudentsDeleteModal: FC<{
  hide: () => void
  mutate: () => void
  modal: { for: string; data?: unknown } | null
}> = ({ hide, mutate, modal }) => {
  const user: User = modal?.data as User
  const [cookies] = useCookies(['session'])
  const formRef = useRef<HTMLFormElement>(null)
  const handleSubmit: FormEventHandler<HTMLFormElement> = (
    event: FormEvent
  ) => {
    event.preventDefault()
    const form = formRef.current
    if (!form) return
    fetch('/api/student/delete', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cookies.session}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: user.id })
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) return toast.error(data.message)
        toast.success(`User ${user.email} removed!`)
        hide()
      })
      .finally(() => mutate())
  }

  return (
    <Modal hide={hide}>
      <form
        className='bg-white shadow max-w-[400px] rounded-lg mx-auto p-4'
        ref={formRef}
        onSubmit={handleSubmit}
      >
        <header className='flex justify-between items-center'>
          <h2 className='font-poppins text-xl font-bold'>Delete Program</h2>
          <button
            className='p-2 rounded-lg bg-gray-100 hover:bg-gray-200'
            type='button'
            title='close'
            onClick={hide}
          >
            <XMarkIcon className='w-6 h-6' />
          </button>
        </header>
        <TrashIcon className='w-20 h-20 mx-auto my-4 text-red-500' />
        <section className='flex flex-col gap-y-4'>
          <h3 className='text-center'>
            Are you sure you want to delete{' '}
            <span className='font-bold'>{user.email}</span>?
          </h3>
        </section>
        <footer className='flex justify-end gap-x-4 mt-4'>
          <button className='btn' type='button' title='close' onClick={hide}>
            Cancel
          </button>
          <button className='btn btn-red' title='confirm' type='submit'>
            Confirm
          </button>
        </footer>
      </form>
    </Modal>
  )
}
