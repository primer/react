import componentsMetadata from '@primer/react/generated/components.json' with {type: 'json'}

type Component = {
  id: string
  name: string
  importPath: string
}

const components: Array<Component> = Object.entries(componentsMetadata.components).map(([id, component]) => {
  return {
    id,
    name: component.name,
    importPath: component.importPath,
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

export {listComponents, listPatterns}
