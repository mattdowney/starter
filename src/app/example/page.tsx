import { Metadata } from 'next'
import { Header, Footer, Container } from '@/components/layout'
import ExampleContent from '@/content/pages/example.mdx'

export const metadata: Metadata = {
  title: 'Example Page - Starter',
  description: 'This is an example MDX page',
}

export default function ExamplePage() {
  return (
    <>
      <Header />
      <main className="py-12">
        <Container>
          <article className="prose prose-gray mx-auto dark:prose-invert">
            <ExampleContent />
          </article>
        </Container>
      </main>
      <Footer />
    </>
  )
}
