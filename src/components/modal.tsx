import { FC, ReactNode, useEffect, useRef } from 'react'

export const Modal: FC<{ children: ReactNode; hide: () => void }> = ({
  children,
  hide
}) => {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.body.classList.add('overflow-hidden')
    return () => {
      document.body.classList.remove('overflow-hidden')
    }
  }, [])

  return (
    <div
      className='w-full h-full fixed z-50 left-0 top-0 backdrop-blur-sm bg-black/30 grid place-items-center'
      ref={modalRef}
      onClick={(e) =>
        (e.target === modalRef.current ||
          e.target === modalRef.current?.firstElementChild) &&
        hide()
      }
    >
      <div className='p-4 md:p-0 w-full'>{children}</div>
    </div>
  )
}
