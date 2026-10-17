import {DocumentationFetchError, fetchMarkdown} from '../../documentation'
import {getComponent} from './metadata'

export async function getGuidelines(identifier: string, kind: 'usage' | 'accessibility'): Promise<string> {
  const match = getComponent(identifier)
  const path = kind === 'usage' ? 'guidelines' : 'accessibility'
  const url = new URL(`/product/components/${match.slug}/${path}`, 'https://primer.style')
  let documentation: string

  try {
    documentation = await fetchMarkdown(url, match.name)
  } catch (error) {
    if (error instanceof DocumentationFetchError && error.status === 404) {
      return `There are no ${kind} guidelines for the \`${match.name}\` component in the @primer/react package.`
    }
    throw error
  }

  return `Here are the ${kind} guidelines for the \`${match.name}\` component from the @primer/react package:\n\n${documentation}`
}
