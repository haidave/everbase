import { cn } from '@/lib/utils'

type ContainerProps = {
  children: React.ReactNode
  className?: string
}

const Container = ({ children, className }: ContainerProps) => {
  return <div className={cn('mx-auto w-full max-w-7xl px-8', className)}>{children}</div>
}

export { Container }
