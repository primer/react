import type React from 'react'
import {hydrateRoot} from 'react-dom/client'
import {renderToString} from 'react-dom/server'
import {GearIcon} from '@primer/octicons-react'
import {ActionMenu} from '../src/components/ActionMenu'
import {IconButton} from '../src/components/IconButton'
import {IconLinkButton} from '../src/components/IconLinkButton'
import {Tooltip} from '../src/components/Tooltip'

const modes = [
  'own-id',
  'own-id-fallback',
  'own-id-fallback-hint',
  'aria-label',
  'aria-labelledby',
  'content-hint',
  'content-hint-element',
  'content-hint-callback',
  'description-hint',
  'description-reference-hint',
  'description-own-id',
  'description-own-id-fallback',
  'description-own-id-hint',
  'description-mixed-ids',
  'description-mixed-ids-reversed',
  'description-missing-ids',
  'render-callback',
  'render-callback-reference',
  'component-trigger',
  'component-trigger-callback',
  'component-trigger-explicit',
  'component-content',
  'component-content-hint',
  'component-content-callback',
  'component-content-explicit',
  'component-description',
  'component-description-hint',
  'component-description-explicit',
  'empty-label',
  'space-label',
  'empty-labelledby',
  'space-labelledby',
  'blank-content',
  'blank-content-hint',
  'menu-icon',
  'link-icon',
] as const
type Mode = (typeof modes)[number]

function NamedTrigger(props: React.ComponentProps<'button'>) {
  return <button type="button" {...props} aria-label="Component trigger name" />
}

function NamedContent(props: React.ComponentProps<'div'>) {
  return <div {...props} aria-label="Component content name" />
}

export function Fixture({mode}: {mode: Mode}) {
  if (mode === 'menu-icon') {
    return (
      <ActionMenu>
        <Tooltip id="tooltip-text" type="label">
          <Tooltip.Trigger
            aria-labelledby="tooltip-text"
            render={<ActionMenu.Trigger render={<IconButton aria-labelledby="tooltip-text" icon={<GearIcon />} />} />}
          />
          <Tooltip.Content>Repository actions</Tooltip.Content>
        </Tooltip>
        <ActionMenu.Content aria-labelledby="tooltip-text">
          <ActionMenu.Item>Copy</ActionMenu.Item>
        </ActionMenu.Content>
      </ActionMenu>
    )
  }
  if (mode === 'link-icon') {
    return (
      <Tooltip id="tooltip-text" type="label">
        <Tooltip.Trigger
          aria-labelledby="tooltip-text"
          render={<IconLinkButton aria-labelledby="tooltip-text" href="/repository" icon={<GearIcon />} />}
        />
        <Tooltip.Content>View repository</Tooltip.Content>
      </Tooltip>
    )
  }
  const isDescription =
    mode === 'description-hint' ||
    mode === 'description-reference-hint' ||
    mode === 'description-own-id' ||
    mode === 'description-own-id-fallback' ||
    mode === 'description-own-id-hint' ||
    mode === 'description-mixed-ids' ||
    mode === 'description-mixed-ids-reversed' ||
    mode === 'description-missing-ids' ||
    mode === 'component-description' ||
    mode === 'component-description-hint' ||
    mode === 'component-description-explicit'
  const trigger =
    mode === 'own-id' ? (
      <Tooltip.Trigger aria-labelledby="tooltip-text">
        <svg aria-hidden="true" />
      </Tooltip.Trigger>
    ) : mode === 'own-id-fallback' || mode === 'own-id-fallback-hint' ? (
      <Tooltip.Trigger aria-label="Fallback name" aria-labelledby="tooltip-text">
        <svg aria-hidden="true" />
      </Tooltip.Trigger>
    ) : mode === 'aria-label' ? (
      <Tooltip.Trigger aria-label="Caller-owned name">
        <svg aria-hidden="true" />
      </Tooltip.Trigger>
    ) : mode === 'aria-labelledby' ? (
      <Tooltip.Trigger aria-label="Fallback name" aria-labelledby="independent-name">
        <svg aria-hidden="true" />
      </Tooltip.Trigger>
    ) : mode === 'render-callback' ? (
      <Tooltip.Trigger render={props => <button {...props} aria-label="Caller-owned name" type="button" />}>
        <svg aria-hidden="true" />
      </Tooltip.Trigger>
    ) : mode === 'render-callback-reference' ? (
      <Tooltip.Trigger
        render={props => (
          <button {...props} aria-label="Fallback name" aria-labelledby="independent-name" type="button" />
        )}
      >
        <svg aria-hidden="true" />
      </Tooltip.Trigger>
    ) : mode === 'description-own-id' || mode === 'description-own-id-hint' ? (
      <Tooltip.Trigger aria-labelledby="tooltip-text">
        <svg aria-hidden="true" />
      </Tooltip.Trigger>
    ) : mode === 'description-own-id-fallback' ? (
      <Tooltip.Trigger aria-label="Fallback name" aria-labelledby="tooltip-text">
        <svg aria-hidden="true" />
      </Tooltip.Trigger>
    ) : mode === 'description-mixed-ids' || mode === 'description-mixed-ids-reversed' ? (
      <Tooltip.Trigger
        aria-label="Fallback name"
        aria-labelledby={
          mode === 'description-mixed-ids' ? 'independent-name tooltip-text' : 'tooltip-text independent-name'
        }
      >
        <svg aria-hidden="true" />
      </Tooltip.Trigger>
    ) : mode === 'description-missing-ids' ? (
      <Tooltip.Trigger aria-label="Fallback name" aria-labelledby="missing-name tooltip-text">
        <svg aria-hidden="true" />
      </Tooltip.Trigger>
    ) : mode === 'component-trigger' ||
      mode === 'component-trigger-callback' ||
      mode === 'component-trigger-explicit' ? (
      <Tooltip.Trigger
        aria-label={mode === 'component-trigger-explicit' ? 'Component trigger name' : undefined}
        render={mode === 'component-trigger-callback' ? props => <NamedTrigger {...props} /> : <NamedTrigger />}
      >
        <svg aria-hidden="true" />
      </Tooltip.Trigger>
    ) : mode === 'empty-label' || mode === 'space-label' ? (
      <Tooltip.Trigger aria-label={mode === 'empty-label' ? '' : '   '}>
        <svg aria-hidden="true" />
      </Tooltip.Trigger>
    ) : mode === 'empty-labelledby' || mode === 'space-labelledby' ? (
      <Tooltip.Trigger aria-labelledby={mode === 'empty-labelledby' ? '' : '   '}>
        <svg aria-hidden="true" />
      </Tooltip.Trigger>
    ) : mode === 'description-hint' ||
      mode === 'description-reference-hint' ||
      mode === 'component-description' ||
      mode === 'component-description-hint' ||
      mode === 'component-description-explicit' ? (
      <Tooltip.Trigger>Search</Tooltip.Trigger>
    ) : (
      <Tooltip.Trigger>
        <svg aria-hidden="true" />
      </Tooltip.Trigger>
    )
  const hasHint =
    mode === 'content-hint' ||
    mode === 'content-hint-element' ||
    mode === 'content-hint-callback' ||
    mode === 'description-hint' ||
    mode === 'description-reference-hint' ||
    mode === 'description-own-id-hint' ||
    mode === 'own-id-fallback-hint' ||
    mode === 'blank-content-hint' ||
    mode === 'component-content-hint' ||
    mode === 'component-content-callback' ||
    mode === 'component-content-explicit' ||
    mode === 'component-description-hint' ||
    mode === 'component-description-explicit'
  const contentLabel =
    mode === 'blank-content' || mode === 'blank-content-hint'
      ? '   '
      : mode === 'component-content' ||
          mode === 'component-content-hint' ||
          mode === 'component-content-callback' ||
          mode === 'component-description' ||
          mode === 'component-description-hint'
        ? undefined
        : mode === 'component-content-explicit' || mode === 'component-description-explicit'
          ? 'Component content name'
          : 'Close feedback form and return to the list'
  const contentRender =
    mode === 'component-content-callback' ? (
      (props: React.ComponentProps<'div'>) => <NamedContent {...props} />
    ) : mode === 'component-content' ||
      mode === 'component-content-hint' ||
      mode === 'component-content-explicit' ||
      mode === 'component-description' ||
      mode === 'component-description-hint' ||
      mode === 'component-description-explicit' ? (
      <NamedContent />
    ) : mode === 'content-hint-element' ? (
      <div aria-label="Element contextual label" role="group" />
    ) : mode === 'content-hint-callback' ? (
      (props: React.HTMLAttributes<HTMLElement>) => (
        <div {...props} aria-label="Callback contextual label" role="group" />
      )
    ) : undefined
  return (
    <>
      <span id="independent-name">Independent name</span>
      <Tooltip
        id="tooltip-text"
        keybindingHint={hasHint ? 'Control+K' : undefined}
        type={isDescription ? 'description' : 'label'}
      >
        {trigger}
        <Tooltip.Content
          aria-label={contentLabel}
          aria-labelledby={mode === 'description-reference-hint' ? 'independent-name' : undefined}
          render={contentRender}
        >
          Close feedback form
        </Tooltip.Content>
      </Tooltip>
    </>
  )
}

function mountFixture() {
  const root = document.getElementById('root')
  if (!root) throw new Error('Missing fixture root')
  const requestedMode = new URLSearchParams(document.location.search).get('mode')
  const mode = modes.find(value => value === requestedMode)
  if (!mode) throw new Error('Unknown Tooltip hydration fixture mode')
  root.innerHTML = renderToString(<Fixture mode={mode} />)
  document.addEventListener('hydrate-tooltip', () => hydrateRoot(root, <Fixture mode={mode} />), {once: true})
}

mountFixture()
