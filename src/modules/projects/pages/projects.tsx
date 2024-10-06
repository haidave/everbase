import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects',
}

const ProjectsPage = () => {
  return <div className="relative mx-auto flex w-full max-w-xl flex-col lg:w-1/2">Projects</div>
}

export { ProjectsPage }
