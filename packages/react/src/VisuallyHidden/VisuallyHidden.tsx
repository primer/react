import React from 'react'
import styled from 'styled-components'
import sx from '../sx'
import type {SxProp} from '../sx'

/**
 * Provides a component that implements the "visually hidden" technique. This is
 * analagous to the common `sr-only` class. Children that are rendered inside
 * this component will not be visible but will be available to screen readers.
 *
 * Note: if this component, or a descendant, has focus then this component will
 * no longer be visually hidden.
 *
 * @see https://www.scottohara.me/blog/2023/03/21/visually-hidden-hack.html
 */
const StyledVisuallyHidden = styled.span<SxProp>`
  &:not(:focus):not(:active):not(:focus-within) {
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  }

  ${sx}
`

type VisuallyHiddenProps = React.PropsWithChildren<React.ComponentPropsWithoutRef<'span'> & SxProp>

function VisuallyHidden(props: VisuallyHiddenProps) {
  return <StyledVisuallyHidden {...props} />
}

export {VisuallyHidden}
export type {VisuallyHiddenProps}
