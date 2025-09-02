import componentsMetadata from '@primer/react/generated/components.json' with {type: 'json'}
import octicons from '@primer/octicons/build/data.json' with {type: 'json'}

type Component = {
  id: string
  name: string
  importPath: string
  slug: string
}

function idToSlug(id: string): string {
  if (id === 'actionbar') {
    return 'action-bar'
  }

  if (id === 'tooltip-v2') {
    return 'tooltip'
  }

  if (id === 'dialog_v2') {
    return 'dialog'
  }

  if (id.startsWith('skeleton')) {
    return 'skeleton-loaders'
  }

  return id.replaceAll('_', '-')
}

const components: Array<Component> = Object.entries(componentsMetadata.components).map(([id, component]) => {
  return {
    id,
    name: component.name,
    importPath: component.importPath,
    slug: idToSlug(id),
  }
})

function listComponents(): Array<Component> {
  return components
}

type Pattern = {
  id: string
  name: string
}

const patterns: Array<Pattern> = [
  {
    id: 'data-visualization',
    name: 'Data Visualization',
  },
  {
    id: 'degraded-experiences',
    name: 'Degraded Experiences',
  },
  {
    id: 'empty-states',
    name: 'Empty States',
  },
  {
    id: 'feature-onboarding',
    name: 'Feature Onboarding',
  },
  {
    id: 'forms',
    name: 'Forms',
  },
  {
    id: 'loading',
    name: 'Loading',
  },
  {
    id: 'navigation',
    name: 'Navigation',
  },
  {
    id: 'notification-messaging',
    name: 'Notification message',
  },
  {
    id: 'progressive-disclosure',
    name: 'Progressive disclosure',
  },
  {
    id: 'saving',
    name: 'Saving',
  },
]

function listPatterns(): Array<Pattern> {
  return patterns
}

type Icon = {
  name: string
  keywords: Array<string>
  heights: Array<string>
}

const icons: Array<Icon> = Object.values(octicons).map(icon => {
  return {
    name: icon.name,
    keywords: icon.keywords,
    heights: Object.keys(icon.heights),
  }
})

function listIcons(): Array<Icon> {
  return icons
}

export {listComponents, listPatterns, listIcons}
