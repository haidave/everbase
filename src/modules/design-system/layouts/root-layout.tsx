import { GeistSans } from 'geist/font/sans'

import '@/styles/globals.css'

import { Providers } from '@/lib/providers/providers'
import { belfastGrotesk, iaWriterDuo } from '@/modules/design-system/theme/fonts'

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${GeistSans.className} ${belfastGrotesk.variable} ${iaWriterDuo.variable} bg-base text-primary`}
      >
        <Providers>
          <div>{children}</div>
        </Providers>
      </body>
    </html>
  )
}

export { RootLayout }
