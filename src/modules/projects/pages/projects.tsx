import type { Metadata } from 'next'

import { ProjectsList } from '../components/projects-list'

export const metadata: Metadata = {
  title: 'Projects',
}

const ProjectsPage = () => {
  return (
    <div className="relative mx-auto flex w-full flex-col">
      <ProjectsList />
    </div>
  )
}

export { ProjectsPage }
