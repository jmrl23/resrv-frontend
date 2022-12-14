import type { FC, ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export const Sidebar: FC<{ children: ReactNode[] }> = ({ children }) => {
  return (
    <nav className="sidenav">
      <Link href="/" title="Resrv">
        <Image
          className="w-52 mx-auto mt-8 mb-10 hidden md:block"
          src="/assets/image/app-logo.svg"
          alt="Resrv logo"
          width={129}
          height={32}
          priority
        />
      </Link>
      <div className="flex flex-col gap-y-4 mx-4 text-black/60">{children}</div>
      <p className="mt-auto text-center text-gray-400 p-4 pb-0 hidden md:block">
        PTC Subject Reservation System
      </p>
    </nav>
  )
}
