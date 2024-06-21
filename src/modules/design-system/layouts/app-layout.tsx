import { Header } from '@/modules/design-system/components/header/header'

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      {/* w-screen prevent layout shift with scrollbar */}
      <main className="w-screen">{children}</main>
    </>
  )
}

export { AppLayout }
