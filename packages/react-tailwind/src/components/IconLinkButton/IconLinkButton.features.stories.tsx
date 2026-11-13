import {LinkExternalIcon} from '@primer/octicons-react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import React from 'react'
import {IconButton} from '../IconButton'
import {Tooltip} from '../Tooltip'
import {IconLinkButton} from './IconLinkButton'

const meta = {
  title: 'React Tailwind/Components/IconLinkButton/Features',
  component: IconLinkButton,
  args: {'aria-label': 'View documentation', href: '#documentation', icon: <LinkExternalIcon />},
} satisfies Meta<typeof IconLinkButton>
export default meta
type Story = StoryObj<typeof meta>

export const WithDescription: Story = {
  args: {description: 'Read the repository documentation', keybindingHint: 'G+D'},
}

export const ExternalTooltip: Story = {
  render: () => (
    <Tooltip>
      <Tooltip.Trigger
        render={<IconLinkButton aria-label="View documentation" href="#documentation" icon={<LinkExternalIcon />} />}
      />
      <Tooltip.Content>Read the repository documentation</Tooltip.Content>
    </Tooltip>
  ),
}

export const NativeNavigation: Story = {
  render: () => (
    <div style={{minHeight: '180vh'}}>
      <IconLinkButton aria-label="Go to destination" href="#icon-link-destination" icon={<LinkExternalIcon />} />
      <div id="icon-link-destination" style={{paddingTop: '130vh'}}>
        Destination
      </div>
    </div>
  ),
}

export const ButtonComparison: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      {(['default', 'primary', 'danger', 'invisible'] as const).map(variant => (
        <div className="flex gap-2" key={variant}>
          <IconButton aria-label={`${variant} button`} icon={<LinkExternalIcon />} variant={variant} />
          <IconLinkButton
            aria-label={`${variant} link`}
            href="#documentation"
            icon={<LinkExternalIcon />}
            variant={variant}
          />
        </div>
      ))}
    </div>
  ),
}

export const SizeVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {(['small', 'medium', 'large'] as const).map(size => (
        <div className="flex gap-2" key={size}>
          <IconButton aria-label={`${size} action`} icon={<LinkExternalIcon />} size={size} />
          <IconLinkButton
            aria-label={`${size} navigation`}
            href="#documentation"
            icon={<LinkExternalIcon />}
            size={size}
          />
        </div>
      ))}
      <div className="flex gap-2">
        <IconButton aria-label="Custom size action" className="size-10" icon={<LinkExternalIcon />} />
        <IconLinkButton
          aria-label="Custom size navigation"
          className="size-10"
          href="#documentation"
          icon={<LinkExternalIcon />}
        />
        <IconButton aria-label="Custom dimensions action" className="h-10 w-12" icon={<LinkExternalIcon />} />
        <IconLinkButton
          aria-label="Custom dimensions navigation"
          className="h-10 w-12"
          href="#documentation"
          icon={<LinkExternalIcon />}
        />
      </div>
    </div>
  ),
}

const RouterLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<'a'> & {onNavigate: (path: string) => void; to: string}
>(function RouterLink({children, onClick, onNavigate, to, ...props}, ref) {
  return (
    <a
      {...props}
      href={to}
      onClick={event => {
        onClick?.(event)
        if (
          !event.defaultPrevented &&
          event.button === 0 &&
          !event.metaKey &&
          !event.ctrlKey &&
          !event.shiftKey &&
          !event.altKey
        ) {
          event.preventDefault()
          onNavigate(to)
        }
      }}
      ref={ref}
    >
      {children}
    </a>
  )
})

export const RouterNavigation: Story = {
  render: function RouterNavigationExample() {
    const [path, setPath] = React.useState('/')
    return (
      <div style={{minHeight: '180vh'}}>
        <IconLinkButton
          aria-label="Open project"
          icon={<LinkExternalIcon />}
          render={<RouterLink data-router-link="" onNavigate={setPath} to="#project" />}
        />
        <p role="status">Current path: {path}</p>
        <div id="project" style={{paddingTop: '130vh'}}>
          Project
        </div>
      </div>
    )
  },
}

export const RenderedDescriptions: Story = {
  render: function RenderedDescriptionsExample() {
    const ownRef = React.useRef<HTMLAnchorElement>(null)
    const outerRef = React.useRef<HTMLAnchorElement>(null)
    const callbackRef = React.useRef<HTMLAnchorElement>(null)
    const outerCallbackRef = React.useRef<HTMLAnchorElement>(null)
    const [ownRefStatus, setOwnRefStatus] = React.useState('pending')
    const [outerRefStatus, setOuterRefStatus] = React.useState('pending')
    const [callbackRefStatus, setCallbackRefStatus] = React.useState('pending')
    const [outerCallbackRefStatus, setOuterCallbackRefStatus] = React.useState('pending')
    const [path, setPath] = React.useState('/')
    return (
      <>
        <p id="existing-settings-description">Existing context.</p>
        <IconLinkButton
          aria-label="Own tooltip settings"
          description="Opens account settings."
          icon={<LinkExternalIcon />}
          onFocus={event => setOwnRefStatus(ownRef.current === event.currentTarget ? 'forwarded' : 'mismatch')}
          ref={ownRef}
          render={
            <RouterLink
              aria-describedby="existing-settings-description"
              data-router-link=""
              onNavigate={setPath}
              to="#own-settings"
            />
          }
        />
        <Tooltip>
          <Tooltip.Trigger
            ref={outerRef}
            render={
              <IconLinkButton
                aria-label="Enclosing tooltip settings"
                icon={<LinkExternalIcon />}
                onFocus={event =>
                  setOuterRefStatus(outerRef.current === event.currentTarget ? 'forwarded' : 'mismatch')
                }
                render={
                  <RouterLink
                    aria-describedby="existing-settings-description"
                    data-router-link=""
                    onNavigate={setPath}
                    to="#outer-settings"
                  />
                }
              />
            }
          />
          <Tooltip.Content>Opens account settings.</Tooltip.Content>
        </Tooltip>
        <IconLinkButton
          aria-label="Callback tooltip settings"
          description="Opens account settings."
          icon={<LinkExternalIcon />}
          onFocus={event =>
            setCallbackRefStatus(callbackRef.current === event.currentTarget ? 'forwarded' : 'mismatch')
          }
          ref={callbackRef}
          render={props => (
            <RouterLink
              {...props}
              aria-describedby="existing-settings-description"
              data-router-link=""
              onNavigate={setPath}
              to="#callback-settings"
            />
          )}
        />
        <Tooltip.Root>
          <Tooltip.Trigger
            ref={outerCallbackRef}
            render={
              <IconLinkButton
                aria-label="Enclosing callback settings"
                icon={<LinkExternalIcon />}
                onFocus={event =>
                  setOuterCallbackRefStatus(outerCallbackRef.current === event.currentTarget ? 'forwarded' : 'mismatch')
                }
                render={props => (
                  <RouterLink
                    {...props}
                    aria-describedby="existing-settings-description"
                    data-router-link=""
                    onNavigate={setPath}
                    to="#outer-callback-settings"
                  />
                )}
              />
            }
          />
          <Tooltip.Content>Opens account settings.</Tooltip.Content>
        </Tooltip.Root>
        <p data-testid="own-ref">Own ref: {ownRefStatus}</p>
        <p data-testid="outer-ref">Outer ref: {outerRefStatus}</p>
        <p data-testid="callback-ref">Callback ref: {callbackRefStatus}</p>
        <p data-testid="outer-callback-ref">Outer callback ref: {outerCallbackRefStatus}</p>
        <p role="status">Current path: {path}</p>
      </>
    )
  },
}
