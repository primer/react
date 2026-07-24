import React from 'react'

export type PageLayoutMarkers = {
  root: string
  header: string
  content: string
  pane: string
  sidebar: string
  footer: string
}

const pageLayoutMarkers: PageLayoutMarkers = {
  root: 'PageLayout',
  header: 'PageLayout.Header',
  content: 'PageLayout.Content',
  pane: 'PageLayout.Pane',
  sidebar: 'PageLayout.Sidebar',
  footer: 'PageLayout.Footer',
}

/** Internal context shared by PageLayout and its SplitPageLayout config wrapper. */
export const PageLayoutMarkerContext = React.createContext<PageLayoutMarkers>(pageLayoutMarkers)
