import { Container } from '@/components/layout'
import { NewsletterForm } from '@/features/newsletter'

interface NewsletterSectionProps {
  title?: string
  description?: string
}

export function NewsletterSection({
  title = 'Stay updated',
  description = 'Get the latest updates delivered to your inbox.',
}: NewsletterSectionProps) {
  return (
    <section className="bg-muted/50 py-16">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          <p className="text-muted-foreground mt-4 text-lg">{description}</p>
          <div className="mt-8 flex justify-center">
            <NewsletterForm />
          </div>
        </div>
      </Container>
    </section>
  )
}
