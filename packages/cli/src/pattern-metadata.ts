export interface Pattern {
  id: string
  name: string
}

export const patterns: readonly Pattern[] = [
  {id: 'data-visualization', name: 'Data Visualization'},
  {id: 'degraded-experiences', name: 'Degraded Experiences'},
  {id: 'empty-states', name: 'Empty States'},
  {id: 'feature-onboarding', name: 'Feature Onboarding'},
  {id: 'forms', name: 'Forms'},
  {id: 'loading', name: 'Loading'},
  {id: 'navigation', name: 'Navigation'},
  {id: 'notification-messaging', name: 'Notification message'},
  {id: 'progressive-disclosure', name: 'Progressive disclosure'},
  {id: 'saving', name: 'Saving'},
].toSorted((a, b) => {
  return a.name.localeCompare(b.name)
})

export const scenarios: readonly Pattern[] = [
  {id: 'copy', name: 'Copy'},
  {id: 'create', name: 'Create'},
  {id: 'customize', name: 'Customize'},
  {id: 'delegate', name: 'Delegate'},
  {id: 'delete', name: 'Delete'},
  {id: 'edit', name: 'Edit'},
  {id: 'filter', name: 'Filter'},
  {id: 'search', name: 'Search'},
  {id: 'view', name: 'View'},
].toSorted((a, b) => {
  return a.name.localeCompare(b.name)
})

export function getPattern(identifier: string, kind: 'patterns' | 'scenarios'): Pattern {
  const entries = kind === 'patterns' ? patterns : scenarios
  const normalized = identifier.toLowerCase()
  const match = entries.find(pattern => {
    return pattern.id.toLowerCase() === normalized || pattern.name.toLowerCase() === normalized
  })
  if (!match) {
    const label = kind === 'patterns' ? 'pattern' : 'scenario'
    throw new Error(`No ${label} found for "${identifier}". Use "primer ${kind} list" to see available ${kind}.`)
  }

  return match
}
