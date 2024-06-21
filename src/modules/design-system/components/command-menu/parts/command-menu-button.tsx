'use client'

import { SearchIcon } from 'lucide-react'

type CommandMenuButtonProps = {
  onClick: () => void
}

const CommandMenuButton = ({ onClick }: CommandMenuButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="group inline-flex h-8 w-[12.5rem] items-center justify-between gap-2 rounded-lg border px-2 transition-colors duration-150 hover:bg-primary focus-visible:shadow-focus focus-visible:outline-0 active:bg-primary-active"
    >
      <div className="flex items-center gap-1 text-secondary transition-colors duration-150 group-hover:text-primary">
        <SearchIcon size={14} />
        <span className="text-sm">Search...</span>
      </div>
      <kbd className="pointer-events-none hidden h-5 select-none items-center gap-px rounded bg-primary px-1.5 font-sans text-xs font-medium leading-5 text-secondary transition-colors duration-150 group-hover:bg-primary-active group-hover:text-primary sm:flex">
        <span>⌘</span>
        <span>K</span>
      </kbd>
    </button>
  )
}

export { CommandMenuButton }
