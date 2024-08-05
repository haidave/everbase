import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'everbase',
    template: '%s | everbase',
  },
  description: 'TBD',
  icons: {
    icon: [
      {
        url: '/images/favicon.ico',
        sizes: 'any',
      },
      {
        url: '/images/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    apple: {
      url: '/images/apple-icon.png',
      sizes: '180x180',
    },
  },
}

export { RootLayout as default } from '@/modules/design-system/layouts/root-layout'
