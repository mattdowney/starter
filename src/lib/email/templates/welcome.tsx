import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Heading,
} from '@react-email/components'

interface WelcomeEmailProps {
  email: string
}

export default function WelcomeEmail({ email }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={section}>
            <Heading style={heading}>Welcome! 👋</Heading>
            <Text style={text}>
              Thanks for subscribing to our newsletter at {email}.
            </Text>
            <Text style={text}>
              We'll keep you updated with the latest news and updates.
            </Text>
            <Text style={footer}>
              If you didn't sign up for this, you can{' '}
              <Link href="#" style={link}>
                unsubscribe here
              </Link>
              .
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
}

const section = {
  padding: '0 48px',
}

const heading = {
  fontSize: '32px',
  lineHeight: '1.3',
  fontWeight: '700',
  color: '#484848',
}

const text = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#484848',
}

const footer = {
  fontSize: '14px',
  lineHeight: '24px',
  color: '#9ca299',
  marginTop: '32px',
}

const link = {
  color: '#0070f3',
  textDecoration: 'underline',
}
