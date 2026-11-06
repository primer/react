'use client'

import {AlertFillIcon} from '@primer/octicons-react'
import React from 'react'
import {AriaStatus} from '../components/LiveRegion'
import {VisuallyHidden} from '../components/VisuallyHidden'
import type {CharacterCountState} from '../utils/characterCounter'
import {cn} from './cn'

interface CharacterCounterProps {
  characterLimit: number
  counter: CharacterCountState
  'data-component': string
  id: string
}

/** Visible remaining-count text plus the static and debounced live-region messages for a character limit. */
export function CharacterCounter({
  characterLimit,
  counter,
  'data-component': dataComponent,
  id,
}: CharacterCounterProps) {
  return (
    <>
      <AriaStatus announceOnShow={false} className="sr-only" delayMs={500}>
        {counter.message}
      </AriaStatus>
      <VisuallyHidden id={id}>
        You can enter up to {characterLimit} {characterLimit === 1 ? 'character' : 'characters'}
      </VisuallyHidden>
      <span
        aria-hidden="true"
        className={cn('flex items-center gap-1 text-xs text-muted', counter.isOverLimit && 'text-danger')}
        data-component={dataComponent}
      >
        {counter.isOverLimit ? <AlertFillIcon size={16} /> : null}
        {counter.message}
      </span>
    </>
  )
}
