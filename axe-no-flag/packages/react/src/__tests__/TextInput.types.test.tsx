import React from 'react'
import {TextInput} from '..'
import {SearchIcon} from '@primer/octicons-react'

export function shouldNotAcceptInvalidDomProps() {
  // @ts-expect-error invalid DOM props should not be accepted
  return <TextInput onKeyDown={true} />
}

export function shouldNotAcceptInvalidSize() {
  // @ts-expect-error invalid size value should not be accepted
  return <TextInput size="big" />
}

export function shouldAcceptLeadingAndTrailingVisualsOfVariousTypes() {
  return (
    <>
      <TextInput leadingVisual={SearchIcon} trailingVisual={SearchIcon} />
      <TextInput leadingVisual={<SearchIcon />} trailingVisual={<SearchIcon />} />
      <TextInput leadingVisual="Visual" trailingVisual="Visual" />
      <TextInput
        leadingVisual={React.memo(() => (
          <div />
        ))}
        trailingVisual={React.memo(() => (
          <div />
        ))}
      />
      <TextInput
        leadingVisual={React.lazy(() => Promise.resolve({default: () => <div />}))}
        trailingVisual={React.lazy(() => Promise.resolve({default: () => <div />}))}
      />
      <TextInput
        leadingVisual={React.forwardRef(() => (
          <div />
        ))}
        trailingVisual={React.forwardRef(() => (
          <div />
        ))}
      />
      <TextInput leadingVisual={() => <div />} trailingVisual={() => <div />} />
    </>
  )
}
