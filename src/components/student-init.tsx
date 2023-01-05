import { FC } from 'react'
import { Gender, Program, User } from '../types'
import { toast } from 'react-toastify'
import { useCookies } from 'react-cookie'
import useSWR from 'swr'

// TODO: student type (regular, irregular)

export const StudentInit: FC<{ user: User }> = ({ user }) => {
  const [cookies] = useCookies(['session'])
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
  const {
    data: programs,
    isLoading,
    error
  } = useSWR<Program[]>('/api/program/list', programFetcher)

  if (isLoading) return <p className='font-bold'>Loading..</p>
  if (error) return <p>An error occurs</p>

  return (
    <>
      <form className='p-4'>
        <h1 className='text-center text-3xl font-bold'>Welcome PTCian!</h1>
        <h3 className='text-center text-xl mt-4'>Tell us about yourself</h3>

        <div className='max-w-screen-md mx-auto flex flex-col md:flex-row md:gap-x-4 mt-8'>
          <div className='md:w-1/2'>
            <div className='flex flex-col'>
              <label className='text-sm font-bold my-2'>First Name</label>
              <input
                className='rounded bg-gray-200 border-none'
                type='text'
                disabled
                defaultValue={user?.givenName}
                title='First Name'
              />
            </div>
            <div className='flex flex-col'>
              <label className='text-sm font-bold my-2'>Last Name</label>
              <input
                className='rounded bg-gray-200 border-none'
                type='text'
                disabled
                defaultValue={user?.familyName}
                title='Last Name'
              />
            </div>
            <div className='flex flex-col'>
              <label className='text-sm font-bold my-2' htmlFor='program'>
                Program
              </label>
              <select
                className='rounded bg-gray-200 border-none'
                name='program'
                id='program'
                title='Program'
              >
                {programs &&
                  programs.map(
                    (program) =>
                      !program.isDisabled && (
                        <option key={program.id} value={program.id}>
                          {program.alias}
                        </option>
                      )
                  )}
              </select>
            </div>
            <div className='flex flex-col'>
              <label className='text-sm font-bold my-2' htmlFor='student-id'>
                Student Id
              </label>
              <input
                className='rounded bg-gray-200 border-none'
                type='text'
                title='Student Id'
                id='student-id'
                name='student-id'
                placeholder='20XX-XXXX'
              />
            </div>
            <div className='flex flex-col'>
              <label className='text-sm font-bold my-2'>Email</label>
              <input
                className='rounded bg-gray-200 border-none'
                type='text'
                disabled
                defaultValue={user?.email}
                title='Email'
              />
            </div>
          </div>
          <div className='w-full md:w-1/2'>
            <div className='flex flex-col'>
              <label className='text-sm font-bold my-2' htmlFor='gender'>
                Gender
              </label>
              <select
                className='rounded bg-gray-200 border-none'
                name='gender'
                id='gender'
                title='Gender'
              >
                {Object.values(Gender).map((value) => (
                  <option key={value}>
                    {value.toLowerCase().replace('_', '-')}
                  </option>
                ))}
              </select>
            </div>
            <div className='flex flex-col'>
              <label className='text-sm font-bold my-2' htmlFor='address'>
                Address
              </label>
              <textarea
                className='rounded bg-gray-200 border-none resize-none h-32'
                name='address'
                id='address'
                placeholder='Address'
              ></textarea>
            </div>
            <div className='flex flex-col'>
              <label
                className='text-sm font-bold my-2'
                htmlFor='contact-number'
              >
                Contact No. (10 Digit)
              </label>
              <input
                className='rounded bg-gray-200 border-none'
                type='text'
                title='Contact Number'
                id='contact-number'
                placeholder='9XXXXXXXXX'
              />
            </div>
            <div className='mt-4 flex justify-end'>
              <button className='btn btn-green px-8' type='submit'>
                save
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  )
}
