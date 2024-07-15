import { Sidebar } from '../components/sidebar/sidebar'

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex w-screen">
      <Sidebar />
      <main className="textarea-scrollbar sticky top-0 my-2 mr-2 flex h-[calc(100svh-1rem)] w-full overflow-auto rounded border-[0.75px] border-line bg-base px-4 py-12">
        {children}
      </main>
    </div>
  )
}

export { AppLayout }
