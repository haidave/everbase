import { Sidebar } from '../components/sidebar/sidebar'

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex w-screen">
      <Sidebar />
      <main className="my-2 mr-2 flex w-full rounded border-[0.75px] border-line bg-subtle px-4 py-12">{children}</main>
    </div>
  )
}

export { AppLayout }
