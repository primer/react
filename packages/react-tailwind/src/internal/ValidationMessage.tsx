import {AlertFillIcon, CheckCircleFillIcon} from '@primer/octicons-react'
import type React from 'react'
import {cn} from './cn'

export type ValidationVariant = 'error' | 'success'

function getClassName(variant: ValidationVariant, className?: string) {
  return cn('flex text-xs font-semibold leading-4', variant === 'error' ? 'text-danger' : 'text-success', className)
}

function ValidationMessageContent({children, variant}: {children: React.ReactNode; variant: ValidationVariant}) {
  const ValidationIcon = variant === 'error' ? AlertFillIcon : CheckCircleFillIcon

  return (
    <>
      <span aria-hidden="true" className="mr-1 mt-0.5 flex">
        <ValidationIcon size={12} fill="currentColor" />
      </span>
      <span>{children}</span>
    </>
  )
}

export const ValidationMessage = Object.assign(ValidationMessageContent, {getClassName})
