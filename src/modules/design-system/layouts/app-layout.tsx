const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {/* w-screen prevent layout shift with scrollbar */}
      <main className="w-screen">{children}</main>
    </>
  )
}

export { AppLayout }
