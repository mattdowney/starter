import type { MDXComponents } from 'mdx/types'
import { Button } from '@/components/ui'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Button,
    ...components,
  }
}
