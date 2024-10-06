import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tasks',
}

const TasksPage = () => {
  return <div className="relative mx-auto flex w-full max-w-xl flex-col lg:w-1/2">Tasks</div>
}

export { TasksPage }
