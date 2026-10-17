import componentsMetadata from '@primer/react/generated/components.json' with {type: 'json'}

export const components = Object.values(componentsMetadata.components)

function idToSlug(id: string): string {
  if (id === 'actionbar') {
    return 'action-bar'
  }

  return id.replaceAll('_', '-')
}

export function getComponent(identifier: string) {
  const normalized = identifier.toLowerCase()
  const match = components.find(component => {
    return component.id.toLowerCase() === normalized || component.name.toLowerCase() === normalized
  })
  if (!match) {
    throw new Error(`No component found for "${identifier}". Use "primer components list" to see available components.`)
  }

  const docsId = 'docsId' in match ? match.docsId : match.id
  return {name: match.name, slug: idToSlug(docsId)}
}
