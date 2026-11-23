import {SHOWCASE_PLATFORM_DURATION} from './showcasePlayback'

export const filmRequestTiming = {
  delivery: 520,
  entrance: 350,
  readingPause: 1_200,
  approach: 300,
  drag: 900,
  interval: 4_250,
} as const
const requestDrag =
  filmRequestTiming.delivery + filmRequestTiming.entrance + filmRequestTiming.readingPause + filmRequestTiming.approach
const requestDrop = requestDrag + filmRequestTiming.drag
const draft = 14_320
const minimizeEnd = draft + 300
const draftSelect = minimizeEnd + 6_200
const draftScreenshot = draftSelect + 400
const draftScreenshotTaken = draftScreenshot + 800
const draftShare = draftScreenshotTaken + 500
const draftShareAttach = draftShare + 450
const draftShareTyping = draftShare + 700
const draftShared = draftShareTyping + 1_200
const draftFeedback = draftShared + 900
const build = draftFeedback + 400
const draftShareEnd = build + filmRequestTiming.delivery + filmRequestTiming.entrance + filmRequestTiming.readingPause
const groupRequest = build + filmRequestTiming.interval - 500
const mobile = groupRequest + 5 * filmRequestTiming.interval + 1_500
const mobileReveal = mobile + filmRequestTiming.delivery + filmRequestTiming.entrance + filmRequestTiming.readingPause
const mobileOpen = mobileReveal + 1_530
const teamReturn = mobileOpen + 1_800
const approval = teamReturn + 7_200
const platform = approval + filmRequestTiming.delivery + 1_500
const platformCapabilities = platform + 1_000
const closing = platformCapabilities + SHOWCASE_PLATFORM_DURATION
const multiple = groupRequest + 2 * filmRequestTiming.interval + requestDrop

export const filmDuration = closing + 3_000

export const filmTiming = {
  panelHighlight: 1_200,
  panelLabelCut: 2_200,
  anatomy: 3_000,
  split: 3_900,
  masonry: 4_980,
  stacking: 5_860,
  stacked: 7_540,
  conversation: 8_000,
  channelJoined: 8_700,
  replyTyping: 11_720,
  minimizePointer: draft - 900,
  draft,
  minimizeEnd,
  draftZoomEnd: minimizeEnd + 700,
  triggerDrag: minimizeEnd + 800,
  triggerPickup: minimizeEnd + 1_450,
  triggerDrop: minimizeEnd + 2_500,
  listDrag: minimizeEnd + 3_300,
  listPickup: minimizeEnd + 4_000,
  listDrop: minimizeEnd + 5_100,
  draftSelect,
  draftScreenshot,
  draftScreenshotTaken,
  draftShare,
  draftShareAttach,
  draftShareTyping,
  draftShared,
  draftFeedback,
  draftShareMinimize: draftShareEnd - 300,
  draftShareEnd,
  build,
  groupRequest,
  descriptions: build + requestDrop,
  groups: groupRequest + requestDrop,
  search: groupRequest + filmRequestTiming.interval + requestDrop,
  modeOpen: groupRequest + 2 * filmRequestTiming.interval + requestDrag,
  multiple,
  multipleSelectionStart: multiple + 200,
  developerSelect: multiple + 500,
  reviewerSelect: multiple + 800,
  footer: groupRequest + 3 * filmRequestTiming.interval + requestDrop,
  statuses: groupRequest + 4 * filmRequestTiming.interval + requestDrop,
  mobile,
  mobileReveal,
  mobileTap: mobileReveal + 1_350,
  mobileOpen,
  teamReturn,
  draftPrTyping: teamReturn,
  approvalTyping: teamReturn + 5_000,
  agentsFinished: platform,
  platform,
  platformCapabilities,
  closing,
} as const

export const filmScenes = [
  {time: 0, name: 'Labels → building blocks'},
  {time: filmTiming.conversation, name: 'The conversation'},
  {time: filmTiming.draft, name: 'A quick draft'},
  {time: filmTiming.draftScreenshot, name: 'Share the draft'},
  {time: filmTiming.build, name: 'Build with the team'},
  {time: filmTiming.mobile, name: 'Take it mobile'},
  {time: filmTiming.teamReturn, name: 'Back to the team'},
  {time: filmTiming.platform, name: 'Platform and performance'},
  {time: filmTiming.closing, name: 'SelectPanel'},
] as const

export const filmConversation = [
  {
    time: 8_800,
    author: 'Maya',
    initials: 'M',
    message: 'Hi! I have an idea, what if we could assign an issue to an agent, separate from human assignees?',
    reactions: [
      {emoji: '💡', label: 'Idea', count: 5},
      {emoji: '🔥', label: 'Fire', count: 3},
    ],
  },
  {
    time: 10_300,
    author: 'Leo',
    initials: 'L',
    message: 'Ooooh, I like that a lot!',
    reactions: [{emoji: '❤️', label: 'Heart', count: 2}],
  },
  {
    time: 12_300,
    author: 'You',
    initials: 'S',
    message: 'I can do a quick draft',
    reactions: [
      {emoji: '🚀', label: 'Rocket', count: 5},
      {emoji: '👍', label: 'Thumbs up', count: 3},
    ],
  },
] as const

export const filmRequests = [
  {
    time: filmTiming.draftFeedback,
    author: 'Maya',
    initials: 'M',
    message: 'I think we should add a short description for each agent',
    part: 'ActionList.Description',
    reactions: [{emoji: '➕', label: 'Plus', count: 1}],
  },
  {
    time: filmTiming.groupRequest,
    author: 'Leo',
    initials: 'L',
    message: 'Maybe we could group them into Plan, Build, and Review?',
    part: 'ActionList.GroupHeading',
    reactions: [
      {emoji: '👍', label: 'Thumbs up', count: 5},
      {emoji: '❤️', label: 'Heart', count: 3},
    ],
  },
  {
    time: filmTiming.groupRequest + filmRequestTiming.interval,
    author: 'Maya',
    initials: 'M',
    message: 'What about search for when this list gets longer?',
    part: 'SelectPanel.SearchInput',
    reactions: [
      {emoji: '👍', label: 'Thumbs up', count: 3},
      {emoji: '❤️', label: 'Heart', count: 1},
    ],
  },
  {
    time: filmTiming.groupRequest + 2 * filmRequestTiming.interval,
    author: 'Sam',
    initials: 'S',
    message: 'Could we assign multiple agents to one task?',
    part: 'selectionMode="multiple"',
    reactions: [
      {emoji: '👍', label: 'Thumbs up', count: 6},
      {emoji: '❤️', label: 'Heart', count: 4},
    ],
  },
  {
    time: filmTiming.groupRequest + 3 * filmRequestTiming.interval,
    author: 'Leo',
    initials: 'L',
    message: 'Should we add an Apply button when selecting multiple agents',
    part: 'SelectPanel.Footer',
    reactions: [
      {emoji: '👍', label: 'Thumbs up', count: 4},
      {emoji: '❤️', label: 'Heart', count: 2},
    ],
  },
  {
    time: filmTiming.groupRequest + 4 * filmRequestTiming.interval,
    author: 'Sam',
    initials: 'S',
    message: 'Any way to see the status of the agent?',
    part: 'ActionList.TrailingVisual',
    reactions: [
      {emoji: '👍', label: 'Thumbs up', count: 5},
      {emoji: '❤️', label: 'Heart', count: 3},
    ],
  },
  {
    time: filmTiming.mobile,
    author: 'Maya',
    initials: 'M',
    message: 'Oh, and it should be responsive for mobile',
    part: 'Responsive, by default',
    reactions: [
      {emoji: '👍', label: 'Thumbs up', count: 7},
      {emoji: '❤️', label: 'Heart', count: 4},
    ],
  },
] as const

export const filmScreenshotMessage = {
  time: draftShared - filmRequestTiming.delivery,
  author: 'You',
  initials: 'S',
  message: 'what do you think?',
  screenshot: true,
} as const

export const filmDraftConversation = [
  {
    time: teamReturn + 800,
    author: 'You',
    initials: 'S',
    message: "Here's a draft PR",
    href: 'https://github.com/github/github-ui/pull/45041',
    reactions: [
      {emoji: '🚀', label: 'Rocket', count: 8},
      {emoji: '🔥', label: 'Fire', count: 6},
      {emoji: '🤯', label: 'Mind blown', count: 4},
      {emoji: '❤️', label: 'Heart', count: 5},
    ],
  },
  {
    time: teamReturn + 2_400,
    author: 'Leo',
    initials: 'L',
    message: 'Wow, that was fast! 🤯 ⚡ I love how this came together!',
    reactions: [
      {emoji: '👍', label: 'Thumbs up', count: 4},
      {emoji: '🚀', label: 'Rocket', count: 3},
    ],
  },
  {
    time: teamReturn + 3_800,
    author: 'Maya',
    initials: 'M',
    message: '🤩 This looks incredible!! 🚀 🎉',
    reactions: [
      {emoji: '❤️', label: 'Heart', count: 5},
      {emoji: '🎉', label: 'Celebration', count: 3},
    ],
  },
  {
    time: teamReturn + 4_900,
    author: 'Sam',
    initials: 'S',
    message: 'wow, you are so talented!',
    reactions: [
      {emoji: '❤️', label: 'Heart', count: 4},
      {emoji: '🔥', label: 'Fire', count: 3},
    ],
  },
  {
    time: approval,
    author: 'You',
    initials: 'S',
    message: 'can someone approve it so we can deploy to preview 🙏',
  },
] as const

export const filmChannelMessages = [
  ...filmConversation,
  filmScreenshotMessage,
  ...filmRequests,
  ...filmDraftConversation,
]

export const filmNotifications = filmChannelMessages.map(message => message.time + filmRequestTiming.delivery)
