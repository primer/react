import type {Meta} from '@storybook/react-vite'
import React, {useEffect} from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import {PageLayout} from '../PageLayout'
import {NavList} from './NavList'
import {ArrowRightIcon, ArrowLeftIcon, BookIcon, FileDirectoryIcon} from '@primer/octicons-react'

const meta: Meta = {
  title: 'Components/NavList/Dev',
  component: NavList,
  parameters: {
    layout: 'fullscreen',
  },
}

export const WithBadExampleOfSubNavAndTrailingAction = () => {
  return (
    <PageLayout>
      <PageLayout.Pane position="start">
        <NavList>
          <NavList.Item>
            <NavList.LeadingVisual>
              <FileDirectoryIcon />
            </NavList.LeadingVisual>
            Item 1
            <NavList.TrailingAction label="Expand sidebar" icon={ArrowLeftIcon} />
          </NavList.Item>
          <NavList.Item>
            Item 2
            <NavList.TrailingAction as="a" href="#" label="Some action" icon={ArrowRightIcon} />
          </NavList.Item>
          <NavList.Item>
            Item 3
            <NavList.TrailingAction label="This is not supported and should not render!!!!!" icon={BookIcon} />
            <NavList.SubNav>
              <NavList.Item href="#">
                Sub item 1
                <NavList.TrailingAction label="Another action" icon={BookIcon} />
              </NavList.Item>
            </NavList.SubNav>
          </NavList.Item>
        </NavList>
      </PageLayout.Pane>
    </PageLayout>
  )
}

WithBadExampleOfSubNavAndTrailingAction.storyName = 'With SubNav and Trailing Action (Bad example, do not copy)'

export default meta

export const WithGroupTitleAndHeading = () => (
  <PageLayout>
    <PageLayout.Pane position="start">
      <NavList>
        <NavList.Group title="Group 1">
          <NavList.GroupHeading>Hello</NavList.GroupHeading>
          <NavList.Item aria-current="true" href="#">
            Item 1A
          </NavList.Item>
          <NavList.Item href="#">Item 1B</NavList.Item>
          <NavList.Item href="#">Item 1C</NavList.Item>
        </NavList.Group>
        <NavList.Group title="Group 2">
          <NavList.Item href="#">Item 2A</NavList.Item>
          <NavList.Item href="#">Item 2B</NavList.Item>
          <NavList.Item href="#">Item 2C</NavList.Item>
        </NavList.Group>
      </NavList>
    </PageLayout.Pane>
    <PageLayout.Content></PageLayout.Content>
  </PageLayout>
)

type NavigationItem = 'item1' | 'subitem1' | 'subitem2' | 'item3'

const NAVIGATION_FALLBACK_ITEM: NavigationItem = 'subitem1'

function getNavigationItemFromHash(): NavigationItem {
  const hash = window.location.hash.replace('#', '')
  if (hash === 'item1' || hash === 'subitem1' || hash === 'subitem2' || hash === 'item3') {
    return hash
  }
  return NAVIGATION_FALLBACK_ITEM
}

function StaticTransitionNav({currentItem}: {currentItem: NavigationItem}) {
  return (
    <PageLayout>
      <PageLayout.Pane position="start">
        <NavList>
          <NavList.Item href="#item1" aria-current={currentItem === 'item1' ? 'page' : 'false'}>
            Item 1
          </NavList.Item>
          <NavList.Item>
            Item 2
            <NavList.SubNav>
              <NavList.Item href="#subitem1" aria-current={currentItem === 'subitem1' ? 'page' : 'false'}>
                Sub item 1
              </NavList.Item>
              <NavList.Item href="#subitem2" aria-current={currentItem === 'subitem2' ? 'page' : 'false'}>
                Sub item 2
              </NavList.Item>
            </NavList.SubNav>
          </NavList.Item>
          <NavList.Item href="#item3" aria-current={currentItem === 'item3' ? 'page' : 'false'}>
            Item 3
          </NavList.Item>
        </NavList>
      </PageLayout.Pane>
      <PageLayout.Content></PageLayout.Content>
    </PageLayout>
  )
}

export const SubNavStaticToInteractiveTransition = () => {
  const [currentItem, setCurrentItem] = React.useState<NavigationItem>(() => getNavigationItemFromHash())
  const [renderMode, setRenderMode] = React.useState<'static' | 'interactive'>('static')

  const staticMarkup = React.useMemo(() => {
    return renderToStaticMarkup(<StaticTransitionNav currentItem={currentItem} />)
  }, [currentItem])

  useEffect(() => {
    const abortController = new AbortController()
    let transitionTimer: number | null = null

    const showStaticThenInteractive = () => {
      setCurrentItem(getNavigationItemFromHash())
      setRenderMode('static')

      if (transitionTimer) {
        window.clearTimeout(transitionTimer)
      }

      // Keep static markup visible long enough to make the collapsed frame obvious.
      transitionTimer = window.setTimeout(() => {
        setRenderMode('interactive')
      }, 180)
    }

    showStaticThenInteractive()
    window.addEventListener('hashchange', showStaticThenInteractive, {signal: abortController.signal})

    return () => {
      abortController.abort()
      if (transitionTimer) {
        window.clearTimeout(transitionTimer)
      }
    }
  }, [])

  if (renderMode === 'static') return <div dangerouslySetInnerHTML={{__html: staticMarkup}} />
  return <StaticTransitionNav currentItem={currentItem} />
}

SubNavStaticToInteractiveTransition.storyName = 'SubNav static-to-interactive transition'
