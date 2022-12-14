import type { Dispatch, FC, SetStateAction } from 'react'
import type { TargetModal } from '../../types'
import { Departments, Moderators, Students } from '..'

export const Content: FC<{
  activePage: string,
  modal: TargetModal,
  setModal: Dispatch<SetStateAction<TargetModal>>
}> = ({ activePage, modal, setModal }) => {
  return (
    <>
      { activePage === 'departments' && <Departments modal={modal} setModal={setModal} /> }
      { activePage === 'students' && <Students modal={modal} setModal={setModal} /> }
      { activePage === 'moderators' && <Moderators modal={modal} setModal={setModal} /> }
    </>
  )
}
