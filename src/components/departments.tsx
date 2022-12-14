import { FormEvent, FormEventHandler, useRef } from 'react'
import { useCookies } from 'react-cookie'
import useSWR, { useSWRConfig } from 'swr'
import { toast } from 'react-toastify'
import type { FC, Dispatch, SetStateAction } from 'react'
import type { TargetModal } from '../types'

export const Departments: FC<{
  modal: TargetModal,
  setModal: Dispatch<SetStateAction<TargetModal>>
}> = ({ modal, setModal }) => {

  const modalRef = useRef<HTMLDivElement>(null)
  const [cookies] = useCookies(['authorization'])
  const { mutate } = useSWRConfig()
  const { data, error, isLoading } = useSWR<any[]>('/api/department/list', async () => {
    return await fetch('/api/department/list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookies.authorization}`
      }
    }).then(response => response.json())
  })
  const hideModal = () => setModal(null)

  if (isLoading) return <p className='font-bold p-4'>Loading..</p>

  return (
    <section>
      <div className="flex gap-4 flex-wrap w-full">
        <div className="bg-slate-500 w-[300px] h-[300px] md:w-[200px] md:h-[200px] lg:w-[300px] lg:h-[300px] rounded-lg p-4 text-white md:cursor-pointer" onClick={() => setModal({ for: 'create' })}>
          <div className="w-full h-full grid place-items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-20 h-20">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
      { 
        data && data.map(
          department => {
            const handleCheckbox = () => {
              department.isDisabled = !department.isDisabled
              fetch('/api/department/toggle', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${cookies.authorization}`
                },
                body: JSON.stringify({ id: department.id, state: !department.isDisabled })
              })
              .then(response => response.json())
              .then(data => {
                if (data.error) return toast.error(data.message)
                department.isDisabled = data.isDisabled
                mutate('/api/department/list')
              })
            }

            return (
                <div key={department.id} className={`bg-${department.color} w-[300px] h-[300px] md:w-[200px] md:h-[200px] lg:w-[300px] lg:h-[300px] rounded-lg p-4 text-white relative shadow`}>
                <header className='absolute w-full left-0 top-0 flex justify-between p-4'>
                  <label className='w-[50px] h-[25px] rounded-full inline-block relative bg-[#F0F0F0] overflow-hidden shadow cursor-pointer' onClick={handleCheckbox}>
                    <input type='checkbox' className='peer hidden' title='switch' defaultChecked={!department.isDisabled} />
                    <span className={`w-full h-full left-0 top-0 p-[2px] peer-checked:bg-[#0ACF83] absolute transition-colors before:content-[''] before:w-[17px] before:h-[17px] before:bg-white before:shadow before:rounded-full before:absolute before:left-[4px] before:top-[4px] peer-checked:before:translate-x-[24px] before:transition-transform`}></span>
                  </label>
                  <button className='md:cursor-pointer' type='button' title='options'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                    </svg>
                    <div className='w-32 h-16 bg-white text-gray-600 rounded-xl font-poppins py-1 modal -z-50 invisible absolute left-24 overflow-hidden'>
                      <button className='hover:bg-gray-200 mt-1 px-4 block w-full text-left' type='button' title='update'>
                        Edit
                      </button>
                      <button className='hover:bg-gray-200 px-4 block w-full text-left' type='button' title='delete'>
                        Delete
                      </button>
                    </div>
                  </button>
                </header>

              </div>
            )
          }
        )
      }
      {
        modal && (
          <div className='w-full h-full fixed z-50 left-0 top-0 backdrop-blur-sm bg-black/10 place-items-center grid' ref={modalRef} onClick={(e) => (e.target === modalRef?.current || e.target === modalRef?.current?.firstElementChild) && hideModal()}>
            <div className="p-4 md:p-0 w-full">
              { modal.for === 'create' && <CreateDepartmentModal hideModal={hideModal} /> }
              { modal.for === 'update' && <UpdateDepartmentModal /> }
            </div>
          </div>
        )
      }
    </section>
  )
}

const CreateDepartmentModal: FC<{
  hideModal: () => void
}> = ({ hideModal }) => {

  const formRef = useRef<HTMLFormElement>(null)
  const [cookies] = useCookies(['authorization'])

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e: FormEvent) => {
    e.preventDefault()
    const form = formRef?.current
    if (!form) return
    const name = form['department-name'].value.trim()
    const alias = form['department-alias'].value.trim().toUpperCase()
    const color = form['department-color'].value
    fetch('/api/department/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookies.authorization}`
      },
      body: JSON.stringify({ name, alias, color })
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) return toast.error(data.message)
      toast.success(`Department ${data.alias} created!`)
    })
    hideModal()
  }

  return (
    <form className="bg-white shadow max-w-[400px] rounded-lg mx-auto p-4" onSubmit={handleSubmit} ref={formRef}>
      <header className="flex justify-between items-center">
        <h2 className="font-poppins text-xl font-bold">
          Create Department
        </h2>
        <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200" type="button" title="close" onClick={hideModal}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </header>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-20 h-20 mx-auto my-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
      </svg>
      <section className="flex flex-col gap-y-4">
        <div>
          <label className="font-bold" htmlFor="department-name">Name</label>
          <input className="w-full px-4 py-2 rounded-md bg-gray-200" type="text" id="department-name" name="department-name" placeholder="Bachelor of Science in Information Technology" />
        </div>
        <div>
          <label className="font-bold" htmlFor="department-alias">Alias</label>
          <input className="w-full px-4 py-2 rounded-md bg-gray-200" type="text" id="department-alias" name="department-alias" placeholder="BSIT" />
        </div>
        <div>
          <label className="font-bold">Color</label>
          <div className="flex gap-x-2 mt-2">
            <label className="inline-block md:cursor-pointer">
              <input className="hidden peer" type="radio" name="department-color" defaultValue="slate-900" defaultChecked />
              <span className="h-4 w-4 bg-slate-900 block rounded-full peer-checked:bg-slate-800 peer-checked:ring" />
            </label>
            <label className="inline-block md:cursor-pointer">
              <input className="hidden peer" type="radio" name="department-color" defaultValue="red-500" />
              <span className="h-4 w-4 bg-red-500 block rounded-full peer-checked:bg-red-600 peer-checked:ring" />
            </label>
            <label className="inline-block md:cursor-pointer">
              <input className="hidden peer" type="radio" name="department-color" defaultValue="orange-500" />
              <span className="h-4 w-4 bg-orange-500 block rounded-full peer-checked:bg-orange-600 peer-checked:ring" />
            </label>
            <label className="inline-block md:cursor-pointer">
              <input className="hidden peer" type="radio" name="department-color" defaultValue="amber-500" />
              <span className="h-4 w-4 bg-amber-500 block rounded-full peer-checked:bg-amber-600 peer-checked:ring" />
            </label>
            <label className="inline-block md:cursor-pointer">
              <input className="hidden peer" type="radio" name="department-color" defaultValue="green-500" />
              <span className="h-4 w-4 bg-green-500 block rounded-full peer-checked:bg-green-600 peer-checked:ring" />
            </label>
            <label className="inline-block md:cursor-pointer">
              <input className="hidden peer" type="radio" name="department-color" defaultValue="blue-500" />
              <span className="h-4 w-4 bg-blue-500 block rounded-full peer-checked:bg-blue-600 peer-checked:ring" />
            </label>
            <label className="inline-block md:cursor-pointer">
              <input className="hidden peer" type="radio" name="department-color" defaultValue="purple-500" />
              <span className="h-4 w-4 bg-purple-500 block rounded-full peer-checked:bg-purple-600 peer-checked:ring" />
            </label>
            <label className="inline-block md:cursor-pointer">
              <input className="hidden peer" type="radio" name="department-color" defaultValue="pink-500" />
              <span className="h-4 w-4 bg-pink-500 block rounded-full peer-checked:bg-pink-600 peer-checked:ring" />
            </label>
          </div>
        </div>
      </section>
      <footer className="flex justify-end gap-x-4 mt-4">
        <button className="btn" type="button" title="close" onClick={hideModal}>
          Cancel
        </button>
        <button className="btn btn-black" title="confirm" type="submit">
          Confirm
        </button>
      </footer>
    </form>
  )
}

const UpdateDepartmentModal: FC<{

}> = () => {
  return (
    <div>
      Update
    </div>
  )
}
