'use client'

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

export const PAGE_LAYOUT_HEADER = Symbol('PageLayout.Header')
export const PAGE_LAYOUT_SIDEBAR = Symbol('PageLayout.Sidebar')
export const PAGE_LAYOUT_FOOTER = Symbol('PageLayout.Footer')

type PageLayoutPartComponent = React.ElementType & {
  [PAGE_LAYOUT_HEADER]?: true
  [PAGE_LAYOUT_SIDEBAR]?: true
  [PAGE_LAYOUT_FOOTER]?: true
}

export type PageLayoutHeaderComponent = PageLayoutPartComponent
export type PageLayoutSidebarComponent = PageLayoutPartComponent
export type PageLayoutFooterComponent = PageLayoutPartComponent

export const markPageLayoutHeader = <T extends React.ElementType>(component: T): T =>
  Object.assign(component, {[PAGE_LAYOUT_HEADER]: true})

export const markPageLayoutSidebar = <T extends React.ElementType>(component: T): T =>
  Object.assign(component, {[PAGE_LAYOUT_SIDEBAR]: true})

export const markPageLayoutFooter = <T extends React.ElementType>(component: T): T =>
  Object.assign(component, {[PAGE_LAYOUT_FOOTER]: true})
