import { Switch } from '@headlessui/react'
import { PlusIcon, TrashIcon, UserGroupIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { type FormEventHandler, useRef, useState, type FC, type FormEvent, Dispatch, SetStateAction } from 'react'
import { useCookies } from 'react-cookie'
import { toast } from 'react-toastify'
import useSWR, { useSWRConfig } from 'swr'
import { Role, UserLevel } from '../types'
import { Modal } from './modal'

export const Moderators: FC<Record<string, never>> = () => {
  const [cookies] = useCookies(['session'])
  const [modal, setModal] = useState<{ for: string, data?: Record<string, unknown> } | null>(null)

  const userLevelFetcher = async () => {
    return fetch('/api/userlevel/list', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cookies.session}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ role: [Role.ADMIN, Role.REGISTRY] })
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          toast.error(data.message)
          return []
        }
        return data
      })
  }

  const { data: userLevels, isLoading } = useSWR<UserLevel[]>('/api/userlevel/list', userLevelFetcher)
  const { mutate } = useSWRConfig()

  if (isLoading) return <p className="font-bold">Loading..</p>

  return (
    <div>
      <div className="flex flex-col gap-x-2 gap-y-4 md:flex-row justify-between border-b border-b-gray-200 pb-4">
        <div className="flex justify-end w-full">
          <button className="btn btn-blue flex gap-x-2" type="button" title="register" onClick={() => setModal({ for: 'create' })}>
            <PlusIcon className='w-6 h-6' />
            Register | Modify
          </button>
        </div>
      </div>
      <div className="overflow-x-auto mt-4">
        <table>
          <thead>
            <tr>
              <th>Status</th>
              <th>Email</th>
              <th>Role</th>
              <th>Enable Acount</th>
              <th>
                {/* actions */}
              </th>
            </tr>
          </thead>
          <tbody>
            {
              userLevels && 
              userLevels.map((userLevel) => (
                <TableRow 
                  key={userLevel?.id} 
                  userLevel={userLevel} 
                  setModal={setModal} 
                  mutate={() => mutate('/api/userlevel/list')} 
                />
              ))
            }
          </tbody>
        </table>
      </div>
      {
        modal && modal.for === 'create' && (
          <CreateModal 
            hide={() => setModal(null)}
            mutate={() => mutate('/api/userlevel/list')} 
          />
        )
      }
      {
        modal && modal.for === 'delete' && (
          <DeleteModal 
            hide={() => setModal(null)}
            mutate={() => mutate('/api/userlevel/list')}
            modal={modal}
          />
        )
      }
    </div>
  )
}

export const TableRow: FC<{ 
  userLevel: UserLevel, 
  mutate: () => void,
  setModal: Dispatch<SetStateAction<{ for: string, data?: Record<string, unknown> | undefined } | null>>
}> = ({ userLevel, mutate, setModal }) => {

  const [cookies] = useCookies()
  const [enabled, setEnabled] = useState<boolean>(!userLevel?.User ? false : !userLevel.User.isDisabled)
  const roleRef = useRef<HTMLSelectElement>(null)
  const handleStatusChange = () => {
    fetch('/api/user/toggle', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cookies.session}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: userLevel?.User.id,
        state: enabled
      })
    })
      .then((response) => response.json())
      .then((data) => setEnabled(!data.isDisabled))
      .finally(() => mutate())
    setEnabled(!enabled)
  }
  const handleRoleChange = () => {
    if (!roleRef.current) return
    const email = userLevel?.email
    const role = roleRef.current.value
    fetch('/api/user/set-role', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cookies.session}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email, role
      })
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) return toast.error(data.message)
        if (!userLevel) return
        userLevel.role = data.role
      })
      .finally(() => mutate())
  }

  return (
    <tr>
      <td>
        <div className='flex gap-x-2 items-center'>
          <span className={'w-2 h-2 rounded-full ' + (userLevel?.User ? 'bg-green-500' : 'bg-gray-300')}></span>
          <span className={(userLevel?.User ? 'text-green-500' : 'text-gray-400')}>{ userLevel?.User ? 'Active' : 'Unregistered' }</span>
        </div>
      </td>
      <td>
        {userLevel?.email}
      </td>
      <td>
        <select className='border-none bg-gray-200 rounded-md text-sm' value={userLevel?.role} onChange={handleRoleChange} ref={roleRef}>
          {
            Object.keys(Role).map(role => (
              role !== Role.STUDENT &&
              <option key={role}>{role}</option>
            ))
          }
        </select>
      </td>
      <td>
        {
          userLevel?.User && (
            <Switch
              className={
                'relative inline-flex h-[25px] w-[50px] cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 ' +
                  (enabled ? 'bg-[#0ACF83]' : 'bg-[#F0F0F0]')
              }
              checked={enabled}
              onChange={handleStatusChange as () => void}
              title="Toggle"
              type="button"
            >
              <span
                className={
                  'pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out' +
                    (enabled ? ' translate-x-[25px]' : '')
                }
              ></span>
            </Switch>
          )
        }
      </td>
      <td>
        <button type='button' title='Delete' className='btn btn-red' onClick={() => {
          setModal({
            for: 'delete',
            data: {
              email: userLevel?.email ?? ''
            }
          })
        }}>
          Delete
        </button>
      </td>
    </tr>
  )
}

export const CreateModal: FC<{ 
  hide: () => void, 
  mutate: () => void
}> = ({ hide, mutate }) => {
  const [cookies] = useCookies(['session'])
  const formRef = useRef<HTMLFormElement>(null)
  const handleSubmit: FormEventHandler<HTMLFormElement> = (event: FormEvent) => {
    event.preventDefault()
    const form = formRef.current
    if (!form) return
    const email = form['email'].value.toLowerCase().trim()
    const role = form['_role'].value
    fetch('/api/user/set-role', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cookies.session}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, role })
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) return toast.error(data.message)
        toast.success(`${email} successfully registered as ${role}`)
        hide()
      })
      .finally(() => mutate())
  }

  return (
    <Modal hide={hide}>
      <form className="bg-white shadow max-w-[400px] rounded-lg mx-auto p-4" onSubmit={handleSubmit} ref={formRef}>
        <header className="flex justify-between items-center">
          <h2 className="font-poppins text-xl font-bold">
              Register moderator
          </h2>
          <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200" type="button" onClick={hide}>
            <XMarkIcon className='w-6 h-6' />
          </button>
        </header>
        <UserGroupIcon className='w-20 h-20 mx-auto my-4' />
        <section className="flex flex-col gap-y-4">
          <div>
            <label className="font-bold" htmlFor="register-moderator-modal-email">Email</label>
            <input className="w-full px-4 py-2 rounded-md bg-gray-200" type="email" id="register-moderator-modal-email" name="email" placeholder="jad@paterostechnologicalcollege.edu.ph" />
          </div>
          <div>
            <label className="font-bold block" htmlFor="edit-department-modal-name">Role</label>
            <select className="border-none bg-gray-200 rounded-md text-sm" name="_role" defaultValue={Role.REGISTRY}>
              {
                Object.keys(Role).map((role) => 
                  role !== Role.STUDENT &&
                  <option key={role}>{role}</option>
                )
              }
            </select>
          </div>
        </section>
        <footer className="flex justify-end gap-x-4 mt-4">
          <button className="btn" type="button" title="close" onClick={hide}>
              Cancel
          </button>
          <button className="btn btn-black" title="confirm" type="submit">
              Confirm
          </button>
        </footer>
      </form>
    </Modal>
  )
}

export const DeleteModal: FC<{ 
  hide: () => void, 
  mutate: () => void,
  modal: { for: string, data?: Record<string, unknown> } | null
}> = ({ hide, mutate, modal }) => {

  const [cookies] = useCookies(['session'])
  const userLevel: UserLevel = modal?.data as UserLevel
  const handleSubmit: FormEventHandler<HTMLFormElement> = (event: FormEvent) => {
    event.preventDefault()
    if (!modal?.data) return
    const email = modal.data?.email
    fetch('/api/user/remove-role', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cookies.session}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) return toast.error(data.message)
        toast.success(`${email} has been removed as moderator`)
        hide()
      })
      .finally(() => mutate())
  }

  return (
    <Modal hide={hide}>
      <form className="bg-white shadow max-w-[400px] rounded-lg mx-auto p-4" onSubmit={handleSubmit}>
        <header className="flex justify-between items-center">
          <h2 className="font-poppins text-xl font-bold">
            Delete Moderator
          </h2>
          <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200" type="button" title="close" onClick={hide}>
            <XMarkIcon className='w-6 h-6' />
          </button>
        </header>
        <TrashIcon className='w-20 h-20 mx-auto my-4 text-red-500' />
        <section className="flex flex-col gap-y-4">
          <h3 className="text-center">
            Are you sure you want to delete <span className='font-bold'>{userLevel?.email}</span>?
          </h3>
        </section>
        <footer className="flex justify-end gap-x-4 mt-4">
          <button className="btn" type="button" title="close" onClick={hide}>
            Cancel
          </button>
          <button className="btn btn-red" title="confirm" type="submit">
            Confirm
          </button>
        </footer>
      </form>
    </Modal>
  )
}
