import type {Meta, Story} from '@storybook/react'
import React from 'react'
import {PageLayout} from '../PageLayout'
import {NavList} from './NavList'

const meta: Meta = {
  title: 'Components/NavList',
  component: NavList,
  parameters: {
    layout: 'fullscreen',
  },
}

export const Simple: Story = () => (
  <PageLayout>
    <PageLayout.Pane position="start">
      <NavList>
        <NavList.Item href="#" aria-current="page">
          Item 1
        </NavList.Item>
        <NavList.Item href="#">Item 2</NavList.Item>
        <NavList.Item href="#">Item 3</NavList.Item>
      </NavList>
    </PageLayout.Pane>
    <PageLayout.Content></PageLayout.Content>
  </PageLayout>
)

export const WithSubItems: Story = () => (
  <PageLayout>
    <PageLayout.Pane position="start">
      <NavList>
        <NavList.Item href="#">Item 1</NavList.Item>
        <NavList.Item>
          Item 2
          <NavList.SubNav>
            <NavList.Item href="#" aria-current="page">
              Sub item 1
            </NavList.Item>
            <NavList.Item href="#">Sub item 2</NavList.Item>
          </NavList.SubNav>
        </NavList.Item>
        <NavList.Item href="#">Item 3</NavList.Item>
      </NavList>
    </PageLayout.Pane>
    <PageLayout.Content></PageLayout.Content>
  </PageLayout>
)

export const WithNestedSubItems: Story = () => (
  <PageLayout>
    <PageLayout.Pane position="start">
      <NavList>
        <NavList.Item defaultOpen={true} href="#">
          Item 1
          <NavList.SubNav>
            <NavList.Item href="#">Sub item 1</NavList.Item>
          </NavList.SubNav>
        </NavList.Item>
        <NavList.Item href="#">
          Item 2{/* NOTE: Don't nest SubNavs. For testing purposes only */}
          <NavList.SubNav>
            <NavList.Item href="#">
              Sub item 1
              <NavList.SubNav>
                <NavList.Item href="#">
                  Sub item 1.1
                  <NavList.SubNav>
                    <NavList.Item href="#">Sub item 1.1.1</NavList.Item>
                    <NavList.Item href="#">
                      Sub item 1.1.2
                      <NavList.SubNav>
                        <NavList.Item href="#">Sub item 1.1.2.1</NavList.Item>
                        <NavList.Item href="#" aria-current="page">
                          Sub item 1.1.2.2
                        </NavList.Item>
                      </NavList.SubNav>
                    </NavList.Item>
                  </NavList.SubNav>
                </NavList.Item>
                <NavList.Item href="#">Sub item 1.2</NavList.Item>
              </NavList.SubNav>
            </NavList.Item>
            <NavList.Item href="#">Sub item 2</NavList.Item>
          </NavList.SubNav>
        </NavList.Item>
        <NavList.Item href="#">Item 3</NavList.Item>
      </NavList>
    </PageLayout.Pane>
    <PageLayout.Content></PageLayout.Content>
  </PageLayout>
)

type ReactRouterLikeLinkProps = {to: string; children: React.ReactNode}
const ReactRouterLikeLink = React.forwardRef<HTMLAnchorElement, ReactRouterLikeLinkProps>(
  ({to, children, ...props}, ref) => {
    return (
      <a ref={ref} href={to} {...props}>
        {children}
      </a>
    )
  },
)

export const WithReactRouterLink = () => (
  <PageLayout>
    <PageLayout.Pane position="start">
      <NavList>
        <NavList.Item as={ReactRouterLikeLink} to="#" aria-current="page">
          Item 1
        </NavList.Item>
        <NavList.Item as={ReactRouterLikeLink} to="#">
          Item 2
        </NavList.Item>
        <NavList.Item as={ReactRouterLikeLink} to="#">
          Item 3
        </NavList.Item>
      </NavList>
    </PageLayout.Pane>
    <PageLayout.Content></PageLayout.Content>
  </PageLayout>
)

type NextJSLinkProps = {href: string; children: React.ReactNode}

const NextJSLikeLink = React.forwardRef<HTMLAnchorElement, NextJSLinkProps>(
  ({href, children}, ref): React.ReactElement => {
    const child = React.Children.only(children)
    const childProps = {
      ref,
      href,
    }
    return <>{React.isValidElement(child) ? React.cloneElement(child, childProps) : null}</>
  },
)

export const WithNextJSLink = () => (
  <PageLayout>
    <PageLayout.Pane position="start">
      <NavList>
        <NextJSLikeLink href="#">
          <NavList.Item aria-current="page">Item 1</NavList.Item>
        </NextJSLikeLink>
        <NextJSLikeLink href="#">
          <NavList.Item>Item 2</NavList.Item>
        </NextJSLikeLink>
        <NextJSLikeLink href="#">
          <NavList.Item>Item 3</NavList.Item>
        </NextJSLikeLink>
      </NavList>
    </PageLayout.Pane>
    <PageLayout.Content></PageLayout.Content>
  </PageLayout>
)

export const WithReloads: Story = () => {
  // eslint-disable-next-line ssr-friendly/no-dom-globals-in-react-fc
  const location = window.location

  const storyId = new URLSearchParams(location.search).get('id')
  const urlBase = `${location.origin + location.pathname}?id=${storyId}`
  const itemId = new URLSearchParams(location.search).get('itemId')

  return (
    <>
      <PageLayout>
        <PageLayout.Pane position="start">
          <NavList>
            <NavList.Item href={`${urlBase}&itemId=1`} aria-current={itemId === '1' ? 'page' : 'false'}>
              Item 1
            </NavList.Item>
            <NavList.Item>
              Item 2
              <NavList.SubNav>
                <NavList.Item href={`${urlBase}&itemId=2.1`} aria-current={itemId === '2.1' ? 'page' : 'false'}>
                  Sub item 2.1
                </NavList.Item>
                <NavList.Item href={`${urlBase}&itemId=2.2`} aria-current={itemId === '2.2' ? 'page' : 'false'}>
                  Sub item 2.2
                </NavList.Item>
              </NavList.SubNav>
            </NavList.Item>
            <NavList.Item>
              Item 3
              <NavList.SubNav>
                <NavList.Item href={`${urlBase}&itemId=3.1`} aria-current={itemId === '3.1' ? 'page' : 'false'}>
                  Sub item 3.1
                </NavList.Item>
                <NavList.Item href={`${urlBase}&itemId=3.2`} aria-current={itemId === '3.2' ? 'page' : 'false'}>
                  Sub item 3.2
                </NavList.Item>
              </NavList.SubNav>
            </NavList.Item>
          </NavList>
        </PageLayout.Pane>
        <PageLayout.Content></PageLayout.Content>
      </PageLayout>
    </>
  )
}

export const WithInactiveItems: Story = () => (
  <PageLayout>
    <PageLayout.Pane position="start">
      <NavList>
        <NavList.Item href="#" inactiveText="Unavailable due to an outage">
          Item 1
        </NavList.Item>
        <NavList.Item>
          Item 2
          <NavList.SubNav>
            <NavList.Item href="#" aria-current="page">
              Sub item 1
            </NavList.Item>
            <NavList.Item href="#" inactiveText="Unavailable due to an outage">
              Sub item 2
            </NavList.Item>
          </NavList.SubNav>
        </NavList.Item>
        <NavList.Item href="#">Item 3</NavList.Item>
      </NavList>
    </PageLayout.Pane>
    <PageLayout.Content></PageLayout.Content>
  </PageLayout>
)

export default meta
