import { Header, Footer } from '@/components/layout'
import { Hero, NewsletterSection } from '@/components/marketing'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero
          title="Welcome to Starter"
          subtitle="A production-ready Next.js template for building landing pages with ease."
        />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  )
}
