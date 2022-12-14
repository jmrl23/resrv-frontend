import { Dispatch, SetStateAction, type FC } from 'react'
import { TargetModal } from '../types'

export const Moderators: FC<{
  modal: TargetModal,
  setModal: Dispatch<SetStateAction<TargetModal>>
}> = () => {
  return (
    <section>
      Moderators
    </section>
  )
}
