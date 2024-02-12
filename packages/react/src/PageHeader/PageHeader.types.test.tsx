import React from 'react'
import {PageHeader} from '../PageHeader'

// PageHeader
export function acceptsAsProp() {
  return <PageHeader as="header"></PageHeader>
}

export function shouldOnlyAllowValidValuesForAsProp() {
  //    @ts-expect-error as prop should have one of the valid values
  return <PageHeader as="something"></PageHeader>
}

export function acceptsAriaLabelProp() {
  return <PageHeader aria-label="Page Header"></PageHeader>
}

export function childrenShouldAcceptHiddenProp() {
  return (
    <PageHeader>
      <PageHeader.ContextArea
        hidden={{
          narrow: true,
        }}
      >
        Context Area
      </PageHeader.ContextArea>
    </PageHeader>
  )
}

export function hiddenPropAcceptsBooleanValues() {
  return (
    <PageHeader>
      <PageHeader.ContextArea hidden={true}>Context Area</PageHeader.ContextArea>
    </PageHeader>
  )
}

export function hiddenPropShouldNotAcceptStringValues() {
  return (
    // @ts-expect-error hidden prop shouldn't accept string
    <PageHeader.ContextArea hidden="true">Context Area</PageHeader.ContextArea>
  )
}

export function hiddenPropShouldNotAcceptInvalidKeys() {
  //   @ts-expect-error hidden prop shouldn't accept invalid keys cdw
  return <PageHeader.ContextArea hidden={{somethinginValid: true}}>Context Area</PageHeader.ContextArea>
}
