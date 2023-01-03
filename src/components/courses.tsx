import { FC, useState } from 'react'
import { Program } from '../types'
import { toast } from 'react-toastify'
import { useCookies } from 'react-cookie'
import useSWR from 'swr'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

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

  const [view, setView] = useState<string>('')

  if (isLoading) return <p className='font-bold'>Loading..</p>
  if (error) return <p>An error occurs</p>

  if (view) return <ProgramView view={view} close={() => setView('')} />

  return (
    <>
      {programs &&
        !view &&
        programs.map((program) => (
          <CoursesProgramsCard
            key={program.id}
            program={program}
            setProgram={() => setView(program.id)}
          />
        ))}
    </>
  )
}

export const CoursesProgramsCard: FC<{
  setProgram: () => void
  program: Program
}> = ({ program, setProgram }) => {
  const { color, alias, name } = program
  return (
    <div
      className={`bg-${color} w-[300px] h-[300px] md:w-[200px] md:h-[200px] lg:w-[300px] lg:h-[300px] rounded-lg p-4 text-white relative shadow md:cursor-pointer`}
      onClick={setProgram}
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

export const ProgramView: FC<{
  view: string
  close: () => void
}> = ({ view: courseId, close }) => {
  return (
    <div>
      <header className='pb-2 mb-4'>
        <button onClick={close}>
          <ArrowLeftIcon className='w-6 h-6' />
        </button>
      </header>
      <h1>{courseId}</h1>
      <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ex
        necessitatibus reiciendis nostrum ratione illo quam magnam, beatae,
        repudiandae non laborum magni alias est soluta rerum placeat aspernatur.
        Aperiam, atque laborum!
      </p>
    </div>
  )
}
