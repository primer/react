export const SELECT_PANEL_PLAYGROUND_STORY_ID = 'components-selectpanel-playground--preview-surface'

export function getStorybookPreviewUrl(baseUrl: string, storyId = SELECT_PANEL_PLAYGROUND_STORY_ID): string {
  const url = new URL('iframe.html', baseUrl)
  url.searchParams.set('id', storyId)
  url.searchParams.set('viewMode', 'story')
  return url.href
}
