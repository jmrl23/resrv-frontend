import type { FC } from 'react'
import { User } from '../types'
import { StudentInit } from '../components'

export const Student: FC<{ user: User }> = ({ user }) => {
  return <>{!user?.StudentInformation && <StudentInit user={user} />}</>
}
