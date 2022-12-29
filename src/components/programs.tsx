import useSWR, { useSWRConfig } from 'swr'
import type { Program } from '../types'
import {
  Dispatch,
  FormEvent,
  FormEventHandler,
  Fragment,
  SetStateAction,
  useEffect,
  useRef,
  useState,
  type FC
} from 'react'
import { useCookies } from 'react-cookie'
import { Menu, Switch, Transition } from '@headlessui/react'
import {
  BuildingOffice2Icon,
  EllipsisVerticalIcon,
  PlusCircleIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { Modal } from './modal'
import { toast } from 'react-toastify'

export const Programs: FC<Record<string, never>> = () => {
  const [modal, setModal] = useState<{
    for: string
    data?: Record<string, unknown>
  } | null>(null)
  const [cookies] = useCookies(['session'])
  const { mutate } = useSWRConfig()
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
  const { data, isLoading, error } = useSWR<Program[]>(
    '/api/program/list',
    programFetcher
  )

  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', !!modal)
  }, [modal])

  if (isLoading) return <p className='font-bold'>Loading..</p>
  if (error) return <p>An error occurs</p>

  return (
    <div>
      <div className='flex gap-4 flex-wrap w-full'>
        <div
          className='bg-slate-500 w-[300px] h-[300px] md:w-[200px] md:h-[200px] lg:w-[300px] lg:h-[300px] rounded-lg p-4 text-white md:cursor-pointer'
          onClick={() => setModal({ for: 'create' })}
        >
          <div className='w-full h-full grid place-items-center'>
            <PlusCircleIcon className='w-20 h-20' />
          </div>
        </div>
        {data &&
          data.map((program) => (
            <ProgramsCard
              key={program.id}
              setModal={setModal}
              program={program}
              mutate={() => mutate('/api/program/list')}
            />
          ))}
      </div>
      {modal &&
        ((modal.for === 'create' && (
          <ProgramsCreateModal
            mutate={() => mutate('/api/program/list')}
            hide={() => setModal(null)}
          />
        )) ||
          (modal.for === 'update' && (
            <UpdateModal
              mutate={() => mutate('/api/program/list')}
              hide={() => setModal(null)}
              modal={modal}
            />
          )) ||
          (modal?.for === 'delete' && (
            <ProgramsDeleteModal
              mutate={() => mutate('/api/program/list')}
              hide={() => setModal(null)}
              modal={modal}
            />
          )))}
    </div>
  )
}

export const ProgramsCreateModal: FC<{
  hide: () => void
  mutate: () => void
}> = ({ hide, mutate }) => {
  const [cookies] = useCookies(['session'])
  const formRef = useRef<HTMLFormElement>(null)
  const handleSubmit: FormEventHandler<HTMLFormElement> = (
    event: FormEvent
  ) => {
    event.preventDefault()
    const form = formRef?.current
    if (!form) return
    const name = form['program-name'].value.trim()
    const alias = form['program-alias'].value.trim().toUpperCase()
    const color = form['program-color'].value
    fetch('/api/program/create', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cookies.session}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        alias,
        color
      })
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) return toast.error(data.message)
        toast.success(`Program ${alias} created!`)
        hide()
        mutate()
      })
  }

  return (
    <Modal hide={hide}>
      <form
        className='bg-white shadow max-w-[400px] rounded-lg mx-auto p-4'
        ref={formRef}
        onSubmit={handleSubmit}
      >
        <header className='flex justify-between items-center'>
          <h2 className='font-poppins text-xl font-bold'>Create Program</h2>
          <button
            className='p-2 rounded-lg bg-gray-100 hover:bg-gray-200'
            type='button'
            title='close'
            onClick={hide}
          >
            <XMarkIcon className='w-6 h-6' />
          </button>
        </header>
        <BuildingOffice2Icon className='w-20 h-20 mx-auto my-4' />
        <section className='flex flex-col gap-y-4'>
          <div>
            <label className='font-bold' htmlFor='program-name'>
              Name
            </label>
            <input
              className='w-full px-4 py-2 rounded-md bg-gray-200'
              type='text'
              name='program-name'
              id='program-name'
              placeholder='Bachelor of Science in Information Technology'
            />
          </div>
          <div>
            <label className='font-bold' htmlFor='program-alias'>
              Alias
            </label>
            <input
              className='w-full px-4 py-2 rounded-md bg-gray-200'
              type='text'
              name='program-alias'
              id='program-alias'
              placeholder='BSIT'
            />
          </div>
          <div>
            <label className='font-bold'>Color</label>
            <div className='flex gap-x-2 mt-2'>
              <label className='inline-block md:cursor-pointer'>
                <input
                  className='hidden peer'
                  type='radio'
                  name='program-color'
                  defaultValue='slate-900'
                  defaultChecked
                />
                <span className='h-4 w-4 bg-slate-900 block rounded-full peer-checked:bg-slate-800 peer-checked:ring' />
              </label>
              <label className='inline-block md:cursor-pointer'>
                <input
                  className='hidden peer'
                  type='radio'
                  name='program-color'
                  defaultValue='red-500'
                />
                <span className='h-4 w-4 bg-red-500 block rounded-full peer-checked:bg-red-600 peer-checked:ring' />
              </label>
              <label className='inline-block md:cursor-pointer'>
                <input
                  className='hidden peer'
                  type='radio'
                  name='program-color'
                  defaultValue='orange-500'
                />
                <span className='h-4 w-4 bg-orange-500 block rounded-full peer-checked:bg-orange-600 peer-checked:ring' />
              </label>
              <label className='inline-block md:cursor-pointer'>
                <input
                  className='hidden peer'
                  type='radio'
                  name='program-color'
                  defaultValue='amber-500'
                />
                <span className='h-4 w-4 bg-amber-500 block rounded-full peer-checked:bg-amber-600 peer-checked:ring' />
              </label>
              <label className='inline-block md:cursor-pointer'>
                <input
                  className='hidden peer'
                  type='radio'
                  name='program-color'
                  defaultValue='green-500'
                />
                <span className='h-4 w-4 bg-green-500 block rounded-full peer-checked:bg-green-600 peer-checked:ring' />
              </label>
              <label className='inline-block md:cursor-pointer'>
                <input
                  className='hidden peer'
                  type='radio'
                  name='program-color'
                  defaultValue='blue-500'
                />
                <span className='h-4 w-4 bg-blue-500 block rounded-full peer-checked:bg-blue-600 peer-checked:ring' />
              </label>
              <label className='inline-block md:cursor-pointer'>
                <input
                  className='hidden peer'
                  type='radio'
                  name='program-color'
                  defaultValue='purple-500'
                />
                <span className='h-4 w-4 bg-purple-500 block rounded-full peer-checked:bg-purple-600 peer-checked:ring' />
              </label>
              <label className='inline-block md:cursor-pointer'>
                <input
                  className='hidden peer'
                  type='radio'
                  name='program-color'
                  defaultValue='pink-500'
                />
                <span className='h-4 w-4 bg-pink-500 block rounded-full peer-checked:bg-pink-600 peer-checked:ring' />
              </label>
            </div>
          </div>
        </section>
        <footer className='flex justify-end gap-x-4 mt-4'>
          <button className='btn' type='button' title='close' onClick={hide}>
            Cancel
          </button>
          <button className='btn btn-black' title='confirm' type='submit'>
            Confirm
          </button>
        </footer>
      </form>
    </Modal>
  )
}

export const UpdateModal: FC<{
  hide: () => void
  mutate: () => void
  modal: { for: string; data?: unknown } | null
}> = ({ hide, modal, mutate }) => {
  const program = modal?.data as Program
  const [cookies] = useCookies(['session'])
  const formRef = useRef<HTMLFormElement>(null)
  const handleSubmit: FormEventHandler<HTMLFormElement> = (
    event: FormEvent
  ) => {
    event.preventDefault()
    const form = formRef?.current
    if (!form || !modal?.data) return
    const data = modal.data as Program
    const name = form['program-name'].value.trim()
    const alias = form['program-alias'].value.trim().toUpperCase()
    const color = form['program-color'].value
    fetch('/api/program/update', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cookies.session}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: data.id,
        name,
        alias,
        color
      })
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) return toast.error(data.message)
        toast.success(`Program ${alias} updated!`)
        hide()
        mutate()
      })
  }

  return (
    <Modal hide={hide}>
      <form
        className='bg-white shadow max-w-[400px] rounded-lg mx-auto p-4'
        ref={formRef}
        onSubmit={handleSubmit}
      >
        <header className='flex justify-between items-center'>
          <h2 className='font-poppins text-xl font-bold'>Create Program</h2>
          <button
            className='p-2 rounded-lg bg-gray-100 hover:bg-gray-200'
            type='button'
            title='close'
            onClick={hide}
          >
            <XMarkIcon className='w-6 h-6' />
          </button>
        </header>
        <BuildingOffice2Icon className='w-20 h-20 mx-auto my-4' />
        <section className='flex flex-col gap-y-4'>
          <div>
            <label className='font-bold' htmlFor='program-name'>
              Name
            </label>
            <input
              className='w-full px-4 py-2 rounded-md bg-gray-200'
              type='text'
              name='program-name'
              id='program-name'
              placeholder='Bachelor of Science in Information Technology'
              defaultValue={program.name}
            />
          </div>
          <div>
            <label className='font-bold' htmlFor='program-alias'>
              Alias
            </label>
            <input
              className='w-full px-4 py-2 rounded-md bg-gray-200'
              type='text'
              name='program-alias'
              id='program-alias'
              placeholder='BSIT'
              defaultValue={program.alias}
            />
          </div>
          <div>
            <label className='font-bold'>Color</label>
            <div className='flex gap-x-2 mt-2'>
              <label className='inline-block md:cursor-pointer'>
                <input
                  className='hidden peer'
                  type='radio'
                  defaultValue='slate-900'
                  defaultChecked={program.color === 'slate-900'}
                />
                <span className='h-4 w-4 bg-slate-900 block rounded-full peer-checked:bg-slate-800 peer-checked:ring' />
              </label>
              <label className='inline-block md:cursor-pointer'>
                <input
                  className='hidden peer'
                  type='radio'
                  name='program-color'
                  defaultValue='red-500'
                  defaultChecked={program.color === 'red-500'}
                />
                <span className='h-4 w-4 bg-red-500 block rounded-full peer-checked:bg-red-600 peer-checked:ring' />
              </label>
              <label className='inline-block md:cursor-pointer'>
                <input
                  className='hidden peer'
                  type='radio'
                  name='program-color'
                  defaultValue='orange-500'
                  defaultChecked={program.color === 'orange-500'}
                />
                <span className='h-4 w-4 bg-orange-500 block rounded-full peer-checked:bg-orange-600 peer-checked:ring' />
              </label>
              <label className='inline-block md:cursor-pointer'>
                <input
                  className='hidden peer'
                  type='radio'
                  name='program-color'
                  defaultValue='amber-500'
                  defaultChecked={program.color === 'amber-500'}
                />
                <span className='h-4 w-4 bg-amber-500 block rounded-full peer-checked:bg-amber-600 peer-checked:ring' />
              </label>
              <label className='inline-block md:cursor-pointer'>
                <input
                  className='hidden peer'
                  type='radio'
                  name='program-color'
                  defaultValue='green-500'
                  defaultChecked={program.color === 'green-500'}
                />
                <span className='h-4 w-4 bg-green-500 block rounded-full peer-checked:bg-green-600 peer-checked:ring' />
              </label>
              <label className='inline-block md:cursor-pointer'>
                <input
                  className='hidden peer'
                  type='radio'
                  name='program-color'
                  defaultValue='blue-500'
                  defaultChecked={program.color === 'blue-500'}
                />
                <span className='h-4 w-4 bg-blue-500 block rounded-full peer-checked:bg-blue-600 peer-checked:ring' />
              </label>
              <label className='inline-block md:cursor-pointer'>
                <input
                  className='hidden peer'
                  type='radio'
                  name='program-color'
                  defaultValue='purple-500'
                  defaultChecked={program.color === 'purple-500'}
                />
                <span className='h-4 w-4 bg-purple-500 block rounded-full peer-checked:bg-purple-600 peer-checked:ring' />
              </label>
              <label className='inline-block md:cursor-pointer'>
                <input
                  className='hidden peer'
                  type='radio'
                  name='program-color'
                  defaultValue='pink-500'
                  defaultChecked={program.color === 'pink-500'}
                />
                <span className='h-4 w-4 bg-pink-500 block rounded-full peer-checked:bg-pink-600 peer-checked:ring' />
              </label>
            </div>
          </div>
        </section>
        <footer className='flex justify-end gap-x-4 mt-4'>
          <button className='btn' type='button' title='close' onClick={hide}>
            Cancel
          </button>
          <button className='btn btn-black' title='confirm' type='submit'>
            Confirm
          </button>
        </footer>
      </form>
    </Modal>
  )
}

export const ProgramsDeleteModal: FC<{
  hide: () => void
  mutate: () => void
  modal: { for: string; data?: unknown } | null
}> = ({ hide, mutate, modal }) => {
  const program: Program = modal?.data as Program
  const [cookies] = useCookies(['session'])
  const formRef = useRef<HTMLFormElement>(null)
  const handleSubmit: FormEventHandler<HTMLFormElement> = (
    event: FormEvent
  ) => {
    event.preventDefault()
    const form = formRef.current
    if (!form) return
    fetch('/api/program/delete', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cookies.session}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: program.id })
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) return toast.error(data.message)
        toast.success(`Program ${program.alias} removed!`)
        hide()
        mutate()
      })
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
            <span className='font-bold break-words'>{program.name}</span>?
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

export const ProgramsCard: FC<{
  setModal: Dispatch<
    SetStateAction<{
      for: string
      data?: Record<string, unknown> | undefined
    } | null>
  >
  program: Program
  mutate: () => void
}> = ({ setModal, program, mutate }) => {
  const [enabled, setEnabled] = useState<boolean>(!program.isDisabled)
  const [cookies] = useCookies(['session'])

  const handleOnChange = (_event: MouseEvent) => {
    fetch('/api/program/toggle', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cookies.session}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: program.id,
        state: enabled
      })
    })
      .then((response) => response.json())
      .then((data) => setEnabled(!data.isDisabled))
      .then(() => mutate())
    setEnabled(!enabled)
  }

  return (
    <>
      <div
        className={`bg-${program.color} w-[300px] h-[300px] md:w-[200px] md:h-[200px] lg:w-[300px] lg:h-[300px] rounded-lg p-4 text-white relative shadow`}
      >
        <header className='absolute w-full left-0 top-0 flex justify-between p-4'>
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
          <Menu as='div' className='text-black'>
            <Menu.Button
              className='md:cursor-pointer text-white'
              title='Options'
            >
              <EllipsisVerticalIcon className='w-6 h-6' />
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
              <Menu.Items className='w-32 h-16 bg-white text-gray-600 rounded-xl font-poppins py-1 shadow absolute right-6 overflow-hidden'>
                <div>
                  <Menu.Item>
                    <button
                      className='hover:bg-gray-200 mt-1 px-4 block w-full text-left'
                      type='button'
                      title='Update'
                      onClick={() => setModal({ for: 'update', data: program })}
                    >
                      Update
                    </button>
                  </Menu.Item>
                  <Menu.Item>
                    <button
                      className='hover:bg-gray-200 px-4 block w-full text-left text-red-500'
                      type='button'
                      title='Delete'
                      onClick={() => setModal({ for: 'delete', data: program })}
                    >
                      Delete
                    </button>
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </header>
        <div className='w-full h-full grid place-items-center'>
          <div className='text-center flex flex-col gap-y-4 items-center'>
            <h2 className='font-poppins text-4xl md:text-2xl lg:text-4xl font-bold'>
              {program.alias}
            </h2>
            <p className='md:text-sm lg:text-base'>{program.name}</p>
          </div>
        </div>
      </div>
    </>
  )
}
