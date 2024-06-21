import { GeistSans } from 'geist/font/sans'

import '@/styles/globals.css'

import { ThemeProvider } from '@/lib/providers/theme-provider'
import { belfastGrotesk } from '@/modules/design-system/theme/fonts'

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.className} ${belfastGrotesk.variable} bg-base text-primary`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <div>{children}</div>
        </ThemeProvider>
      </body>
    </html>
  )
}

export { RootLayout }
