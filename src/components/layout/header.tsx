import Link from 'next/link'
import { Container } from './container'

export function Header() {
  return (
    <header className="border-b">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Starter
          </Link>
          <nav className="flex gap-6">
            {/* Add navigation links here */}
          </nav>
        </div>
      </Container>
    </header>
  )
}
