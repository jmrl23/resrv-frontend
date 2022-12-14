import { Dispatch, SetStateAction, type FC } from 'react'
import { TargetModal } from '../types'

export const Students: FC<{
  modal: TargetModal,
  setModal: Dispatch<SetStateAction<TargetModal>>
}> = () => {
  return (
    <section>
      Students
    </section>
  )
}
