const NotesSkeleton = () => {
  return (
    <div className="relative grid gap-8 pb-12 lg:gap-10">
      {Array.from({ length: 10 }, (_, groupIndex) => (
        <div key={groupIndex} className="relative">
          <div className="flex items-center gap-2 font-mono text-sm lg:absolute lg:right-full lg:mr-10">
            <div className="h-4 w-32 animate-pulse rounded bg-subtle" />
            <div className="size-4 animate-pulse rounded bg-subtle" />
          </div>

          <ul className="grid gap-4 max-lg:mt-3">
            <li className="relative rounded-md bg-subtle px-5 py-4 transition-all duration-150">
              <div className="mb-3.5 h-3 w-12 animate-pulse rounded bg-primary" />
              <div className="space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-primary" />
                <div className="h-4 w-full animate-pulse rounded bg-primary" />
                <div className="h-4 w-full animate-pulse rounded bg-primary lg:hidden" />
                <div className="h-4 w-full animate-pulse rounded bg-primary lg:hidden" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-primary" />
              </div>
            </li>
          </ul>
        </div>
      ))}
    </div>
  )
}

export { NotesSkeleton }
