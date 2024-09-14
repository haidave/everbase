import type { Metadata } from 'next'

import { AddNote } from '@/modules/notes/components/add-note'
import { Notes } from '@/modules/notes/components/notes'

export const metadata: Metadata = {
  title: 'Inbox',
}

const InboxPage = () => {
  return (
    <div className="relative mx-auto flex max-w-xl flex-col lg:w-1/2">
      <div className="fixed bottom-5 right-5 z-50 lg:bottom-8 lg:right-8">
        <AddNote />
      </div>
      <Notes />
    </div>
  )
}

export { InboxPage }
