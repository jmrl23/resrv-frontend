import { FC } from 'react'
import { Program } from '../types'
import { toast } from 'react-toastify'
import { useCookies } from 'react-cookie'
import useSWR from 'swr'

export const Courses: FC<Record<string, never>> = () => {
  return (
    <>
      <CoursesProgramsCards />
    </>
  )
}

export const CoursesProgramsCards: FC<Record<string, never>> = () => {
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
      {programs &&
        programs.map((program) => (
          <CoursesProgramsCard key={program.id} {...program} />
        ))}
    </>
  )
}

export const CoursesProgramsCard: FC<Program> = ({ color, alias, name }) => {
  return (
    <div
      className={`bg-${color} w-[300px] h-[300px] md:w-[200px] md:h-[200px] lg:w-[300px] lg:h-[300px] rounded-lg p-4 text-white relative shadow md:cursor-pointer`}
    >
      <div className='w-full h-full grid place-items-center'>
        <div className='text-center flex flex-col gap-y-4 items-center'>
          <h2 className='font-poppins text-4xl md:text-2xl lg:text-4xl font-bold'>
            {alias}
          </h2>
          <p className='md:text-sm lg:text-base'>{name}</p>
        </div>
      </div>
    </div>
  )
}
