import Link from 'next/link'
import React from 'react'


type Props = {}

const Navbar = (props: Props) => {
  return (
    <header className="fixed right-0 left-0 top-0 py-4 px-4 bg-black/40 backdrop-blur-lg z-[100] flex items-center border-b-[1px] border-neutral-900 justify-between">
      <aside className="flex bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent items-center gap-[2px] font-black text-md">
        KINECT.
      </aside>
      <aside>
        <Link
          href="/app"
          className="relative inline-flex h-10 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-none focus:ring-none focus:ring-none focus:ring-none"
        >
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#ABEB47_0%,#090B04_50%,#5C7237_100%)]" />
          <span className="inline-flex focus:ring-none focus:border-none focus:outline-none hover:shadow-xl h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
            Open Kinect
          </span>
        </Link>
      </aside>
    </header>
  )
}

export default Navbar
