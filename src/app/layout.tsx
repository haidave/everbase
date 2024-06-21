import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'everbase',
    template: '%s | everbase',
  },
  description: 'TBD',
}

export { RootLayout as default } from '@/modules/design-system/layouts/root-layout'
