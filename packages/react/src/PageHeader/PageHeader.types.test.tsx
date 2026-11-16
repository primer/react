import {PageHeader} from '../PageHeader'

export function titleAcceptsHeadingProps() {
  return (
    <PageHeader.Title
      id="project-title"
      aria-describedby="description"
      tabIndex={-1}
      onClick={event => event.currentTarget.focus()}
    >
      Project
    </PageHeader.Title>
  )
}

export function titleOnlyAcceptsHeadingElements() {
  // @ts-expect-error titles must render a heading
  return <PageHeader.Title as="div">Project</PageHeader.Title>
}

// PageHeader
export function acceptsAsProp() {
  return <PageHeader role="banner" as="header"></PageHeader>
}

export function shouldOnlyAllowValidValuesForAsProp() {
  //    @ts-expect-error as prop should have one of the valid values
  return <PageHeader role="banner" as="something"></PageHeader>
}

export function acceptsAriaLabelProp() {
  return <PageHeader role="banner" aria-label="Page Header"></PageHeader>
}

export function childrenShouldAcceptHiddenProp() {
  return (
    <PageHeader role="banner" aria-label="Context Area">
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
    <PageHeader role="banner" aria-label="Banner">
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
