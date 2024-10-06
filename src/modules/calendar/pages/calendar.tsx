import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calendar',
}

const CalendarPage = () => {
  return <div className="relative mx-auto flex w-full max-w-xl flex-col lg:w-1/2">Calendar</div>
}

export { CalendarPage }
