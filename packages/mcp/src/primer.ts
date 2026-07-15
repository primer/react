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
  // 'scenario' maps to the /product/scenario-patterns/ base path, 'ui' to /product/ui-patterns/
  category: 'scenario' | 'ui'
}

// Scenario patterns are listed first so name resolution favours them over UI patterns.
const patterns: Array<Pattern> = [
  {
    id: 'copy',
    name: 'Copy',
    category: 'scenario',
  },
  {
    id: 'delete',
    name: 'Delete',
    category: 'scenario',
  },
  {
    id: 'filter',
    name: 'Filter',
    category: 'scenario',
  },
  {
    id: 'search',
    name: 'Search',
    category: 'scenario',
  },
  {
    id: 'data-visualization',
    name: 'Data Visualization',
    category: 'ui',
  },
  {
    id: 'degraded-experiences',
    name: 'Degraded Experiences',
    category: 'ui',
  },
  {
    id: 'empty-states',
    name: 'Empty States',
    category: 'ui',
  },
  {
    id: 'feature-onboarding',
    name: 'Feature Onboarding',
    category: 'ui',
  },
  {
    id: 'forms',
    name: 'Forms',
    category: 'ui',
  },
  {
    id: 'loading',
    name: 'Loading',
    category: 'ui',
  },
  {
    id: 'navigation',
    name: 'Navigation',
    category: 'ui',
  },
  {
    id: 'notification-messaging',
    name: 'Notification message',
    category: 'ui',
  },
  {
    id: 'progressive-disclosure',
    name: 'Progressive disclosure',
    category: 'ui',
  },
  {
    id: 'saving',
    name: 'Saving',
    category: 'ui',
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
