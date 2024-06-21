import localFont from 'next/font/local'

const belfastGrotesk = localFont({
  src: [
    {
      path: '../../../../public/fonts/belfast-grotesk-medium.woff2',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-logo',
})

export { belfastGrotesk }
