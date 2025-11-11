import { Container } from '@/components/layout'

interface HeroProps {
  title: string
  subtitle: string
  children?: React.ReactNode
}

export function Hero({ title, subtitle, children }: HeroProps) {
  return (
    <section className="py-20 md:py-32">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            {title}
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            {subtitle}
          </p>
          {children && <div className="mt-10">{children}</div>}
        </div>
      </Container>
    </section>
  )
}
