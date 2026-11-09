import {AlertFillIcon, CheckCircleFillIcon} from '@primer/octicons-react'
import type React from 'react'
import {cn} from './cn'

export type ValidationVariant = 'error' | 'success'

function getClassName(variant: ValidationVariant, className?: string) {
  return cn(
    'primer:flex primer:text-xs primer:font-semibold primer:leading-4',
    variant === 'error' ? 'primer:text-danger' : 'primer:text-success',
    className,
  )
}

function ValidationMessageContent({children, variant}: {children: React.ReactNode; variant: ValidationVariant}) {
  const ValidationIcon = variant === 'error' ? AlertFillIcon : CheckCircleFillIcon

  return (
    <>
      <span aria-hidden="true" className="primer:mr-1 primer:mt-0.5 primer:flex">
        <ValidationIcon size={12} fill="currentColor" />
      </span>
      <span>{children}</span>
    </>
  )
}

export const ValidationMessage = Object.assign(ValidationMessageContent, {getClassName})
