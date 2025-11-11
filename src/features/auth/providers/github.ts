import GitHub from 'next-auth/providers/github'

export const githubProvider = GitHub({
  clientId: process.env.GITHUB_ID ?? '',
  clientSecret: process.env.GITHUB_SECRET ?? '',
})
