import { Container } from './container'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-muted/50 border-t">
      <Container>
        <div className="text-muted-foreground flex h-16 items-center justify-between text-sm">
          <p>&copy; {currentYear} Starter. All rights reserved.</p>
          <div className="flex gap-4">{/* Add footer links here */}</div>
        </div>
      </Container>
    </footer>
  )
}
