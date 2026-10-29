export interface NoodlesPageFixture {
  id: string
  title: string
  count?: number
  parentId?: string
}

export interface NoodlesSectionFixture {
  heading: string
  paragraph?: string
  items?: readonly string[]
}

export const noodlesProjectCover: NoodlesPageFixture = {
  id: 'project-cover',
  title: 'Octoinvaders \u00b7 Ink Shield',
}

export const noodlesProjectPages: readonly NoodlesPageFixture[] = [
  {id: 'onboarding', title: 'First-use onboarding', parentId: 'project-cover'},
  {id: 'redirect', title: 'Redirect timing', parentId: 'project-cover'},
  {id: 'pacing', title: 'Wave-two pacing', parentId: 'project-cover'},
  {id: 'accessible-feedback', title: 'Accessible shield feedback', parentId: 'project-cover'},
  {id: 'guardrails', title: 'Rollout guardrails', parentId: 'project-cover'},
]

export const noodlesPages: readonly NoodlesPageFixture[] = [
  {id: 'status-updates', title: 'Status updates', count: 12},
  {id: 'standups', title: 'Standups', count: 60},
  {id: 'prototype', title: 'Ink Shield interactive prototype'},
  {id: 'visual-direction', title: 'Octoinvaders visual direction'},
  {id: 'inspiration', title: 'Arcade inspiration'},
  {id: 'feature-brief', title: 'Feature brief'},
  {id: 'mechanics', title: 'Mechanics specification'},
  {id: 'waves', title: 'Wave and character design'},
  {id: 'art-audio', title: 'Art and audio direction'},
  {id: 'dashboard', title: 'Kusto playtest dashboard'},
  {id: 'delivery', title: 'Ink Shield delivery board'},
  {id: 'telemetry', title: 'Telemetry and experiment plan'},
  {id: 'checklist', title: 'Playtest and launch checklist'},
]

export const noodlesReports = [
  'October 2, 2026',
  'September 25, 2026',
  'September 18, 2026',
  'September 11, 2026',
  'September 4, 2026',
  'August 28, 2026',
  'August 21, 2026',
  'August 14, 2026',
  'August 7, 2026',
  'July 31, 2026',
  'July 24, 2026',
  'July 17, 2026',
] as const

// Original demo copy, not content copied from the authenticated reference.
export const noodlesStatusSections: readonly NoodlesSectionFixture[] = [
  {
    heading: '1/ What got done this week? What was the outcome?',
    items: [
      'Finished the last input and reporting improvements, then practiced switching the shield off without stopping a session.',
      'Prepared the delivery board, owner rotation, and the small-cohort release checklist.',
      'The fictional playtest suggests clearer shield guidance and steadier pacing. We will verify these observations with a new cohort.',
    ],
  },
  {
    heading: '2/ What is the plan for next week?',
    items: [
      'Invite the next internal group and review the experience together each day.',
      'Expand the audience only after the team reviews the results and signs off on the release.',
    ],
  },
  {
    heading: '3/ What risks, decisions, or blockers need attention?',
    paragraph:
      'These are fictional planning notes, not production measurements. A wider release needs a fresh playtest and an accessibility review.',
  },
  {
    heading: '4/ What help do you need?',
    items: [
      'A second reviewer for the keyboard and controller flows.',
      'A release partner to confirm ownership of the monitoring checklist.',
    ],
  },
]
