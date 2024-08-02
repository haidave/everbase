import { AppHeader } from '../components/app-header'
import { Sidebar } from '../components/sidebar/sidebar'

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="lg:flex lg:w-screen lg:bg-app">
      <AppHeader />
      <Sidebar />
      <main className="textarea-scrollbar sticky top-0 flex w-full overflow-auto border-line bg-base p-6 lg:my-2 lg:mr-2 lg:h-[calc(100svh-1rem)] lg:rounded lg:border-[0.75px] lg:py-12">
        {children}
      </main>
    </div>
  )
}

export { AppLayout }
