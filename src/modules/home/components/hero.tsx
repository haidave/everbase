import { Button } from '@/modules/design-system/components/button'

const Hero = () => {
  return (
    <section className="relative mx-auto mt-36 flex max-w-2xl flex-col items-center gap-6">
      <h1 className="text-gradient text-center text-6xl font-medium leading-[1.2]">
        Everything you need <br />
        in one place.
      </h1>
      <p className="text-balance text-center text-lg leading-7 text-secondary">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam aliquid culpa eos veritatis rem aut optio
        suscipit, ratione porro at!
      </p>

      <div className="mt-6 flex items-center gap-6">
        <Button asChild variant="shiny" size="large">
          <span>Get Started</span>
        </Button>
      </div>
    </section>
  )
}

export { Hero }
