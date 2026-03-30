import componentsMetadata from '@primer/react/generated/components.json' with {type: 'json'}

type Component = {
  name: string
  slug: string
}

function idToSlug(id: string): string {
  if (id === 'actionbar') return 'action-bar'
  if (id === 'tooltip-v2') return 'tooltip'
  if (id === 'dialog_v2') return 'dialog'
  return id.replaceAll('_', '-')
}

const components: Component[] = Object.entries(componentsMetadata.components).map(([id, component]) => ({
  name: (component as {name: string}).name,
  slug: idToSlug(id),
}))

function listComponents(): Component[] {
  return components
}

/**
 * Fetch a component's documentation from primer.style.
 * Tries /llms.txt first (concise LLM-optimized format), falls back to HTML.
 */
async function fetchComponentDocs(slug: string): Promise<string | null> {
  const timeout = AbortSignal.timeout(10_000)

  try {
    const llmsUrl = `https://primer.style/product/components/${slug}/llms.txt`
    const llmsResponse = await fetch(llmsUrl, {signal: timeout})
    if (llmsResponse.ok) {
      const text = await llmsResponse.text()
      if (text) return text
    }

    // Fallback: fetch HTML and extract main content
    const url = `https://primer.style/product/components/${slug}`
    const response = await fetch(url, {signal: timeout})
    if (!response.ok) return null

    const html = await response.text()
    if (!html) return null

    // Simple extraction: grab text between <main> tags
    const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)
    if (!mainMatch) return null

    // Strip HTML tags for a rough text extraction
    return mainMatch[1]
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  } catch {
    return null
  }
}

/**
 * Given a user question, find relevant components by name matching.
 * Handles variations like "action list", "ActionList", "actionlist".
 */
function findRelevantComponents(question: string): Component[] {
  const questionNormalized = question.toLowerCase().replace(/[\s_-]/g, '')
  const matched: Component[] = []

  for (const component of components) {
    const nameNormalized = component.name.toLowerCase()
    if (questionNormalized.includes(nameNormalized)) {
      matched.push(component)
    }
  }

  // Sort by name length descending so more specific matches come first
  // (e.g. "ActionList" before "Action")
  matched.sort((a, b) => b.name.length - a.name.length)

  return matched.slice(0, 3)
}

export interface RetrievedContext {
  componentDocs: Array<{name: string; docs: string}>
  componentList: string
}

/**
 * Retrieve all relevant Primer context for a given question.
 */
export async function retrieveContext(question: string): Promise<RetrievedContext> {
  const relevantComponents = findRelevantComponents(question)

  // Fetch docs for matched components in parallel
  const componentDocs: Array<{name: string; docs: string}> = []
  const docResults = await Promise.all(
    relevantComponents.map(async c => {
      const docs = await fetchComponentDocs(c.slug)
      return {name: c.name, docs}
    }),
  )

  for (const result of docResults) {
    if (result.docs) {
      componentDocs.push({name: result.name, docs: result.docs})
    }
  }

  const componentList = listComponents()
    .map(c => c.name)
    .join(', ')

  return {componentDocs, componentList}
}

/**
 * Format retrieved context into a string suitable for the LLM prompt.
 */
export function formatContext(ctx: RetrievedContext): string {
  const sections: string[] = []

  sections.push(`Available Primer React components: ${ctx.componentList}`)

  for (const {name, docs} of ctx.componentDocs) {
    const truncated = docs.length > 4000 ? `${docs.slice(0, 4000)}\n...(truncated)` : docs
    sections.push(`### ${name} Documentation\n\n${truncated}`)
  }

  return sections.join('\n\n---\n\n')
}
