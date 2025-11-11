import { Container } from './container'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-muted/50">
      <Container>
        <div className="flex h-16 items-center justify-between text-sm text-muted-foreground">
          <p>&copy; {currentYear} Starter. All rights reserved.</p>
          <div className="flex gap-4">
            {/* Add footer links here */}
          </div>
        </div>
      </Container>
    </footer>
  )
}
