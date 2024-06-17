import React from 'react'
import styled from 'styled-components'
import {get} from '../../constants'

type LabelColorVariant =
  | 'pink'
  | 'plum'
  | 'purple'
  | 'indigo'
  | 'blue'
  | 'cyan'
  | 'teal'
  | 'pine'
  | 'green'
  | 'lime'
  | 'olive'
  | 'lemon'
  | 'yellow'
  | 'orange'
  | 'red'
  | 'coral'
  | 'gray'
  | 'brown'
  | 'auburn'

// These colors should overlap with label

export interface IssueLabelProps extends React.PropsWithChildren {
  /**
   *
   */
  fillColor?: string

  /**
   *
   */
  size?: 'small' | 'large'

  /**
   *
   */
  variant?: LabelColorVariant
}

export function IssueLabel({children, fillColor, size = 'small', variant = 'gray', ...rest}: IssueLabelProps) {
  return (
    <StyledLabel {...rest} data-size={size} data-variant={fillColor ? undefined : variant}>
      {children}
    </StyledLabel>
  )
}

const StyledLabel = styled.div`
  background-color: var(--label-bgColor-rest);
  color: var(--label-fgColor);
  border: none;
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  font-size: ${get('fontSizes.0')};
  line-height: calc(20 / 12);
  font-weight: var(--base-text-weight-semibold, 600);

  // Size ----------------------------------------------------------------------
  &[data-size='small'] {
    min-height: var(--base-size-20, 1.25rem);
    padding-inline: var(--base-size-8, 0.5rem);
  }

  &[data-size='large'] {
    min-height: var(--base-size-24, 1.5rem);
    padding-inline: var(--base-size-12, 0.75rem);
  }

  // Variant--------------------------------------------------------------------
  &[data-variant='pink'] {
    --label-bgColor-rest: var(--label-pink-bgColor-rest);
    --label-bgColor-hover: var(--label-pink-bgColor-hover);
    --label-bgColor-active: var(--label-pink-bgColor-active);
    --label-fgColor: var(--label-pink-fgColor-rest);
    --label-fgColor-hover: var(--label-pink-fgColor-hover);
    --label-fgColor-active: var(--label-pink-fgColor-active);
  }

  &[data-variant='plum'] {
    --label-bgColor-rest: var(--label-plum-bgColor-rest);
    --label-bgColor-hover: var(--label-plum-bgColor-hover);
    --label-bgColor-active: var(--label-plum-bgColor-active);
    --label-fgColor: var(--label-plum-fgColor-rest);
    --label-fgColor-hover: var(--label-plum-fgColor-hover);
    --label-fgColor-active: var(--label-plum-fgColor-active);
  }

  &[data-variant='purple'] {
    --label-bgColor-rest: var(--label-purple-bgColor-rest);
    --label-bgColor-hover: var(--label-purple-bgColor-hover);
    --label-bgColor-active: var(--label-purple-bgColor-active);
    --label-fgColor: var(--label-purple-fgColor-rest);
    --label-fgColor-hover: var(--label-purple-fgColor-hover);
    --label-fgColor-active: var(--label-purple-fgColor-active);
  }

  &[data-variant='indigo'] {
    --label-bgColor-rest: var(--label-indigo-bgColor-rest);
    --label-bgColor-hover: var(--label-indigo-bgColor-hover);
    --label-bgColor-active: var(--label-indigo-bgColor-active);
    --label-fgColor: var(--label-indigo-fgColor-rest);
    --label-fgColor-hover: var(--label-indigo-fgColor-hover);
    --label-fgColor-active: var(--label-indigo-fgColor-active);
  }

  &[data-variant='blue'] {
    --label-bgColor-rest: var(--label-blue-bgColor-rest);
    --label-bgColor-hover: var(--label-blue-bgColor-hover);
    --label-bgColor-active: var(--label-blue-bgColor-active);
    --label-fgColor: var(--label-blue-fgColor-rest);
    --label-fgColor-hover: var(--label-blue-fgColor-hover);
    --label-fgColor-active: var(--label-blue-fgColor-active);
  }

  &[data-variant='cyan'] {
    --label-bgColor-rest: var(--label-cyan-bgColor-rest);
    --label-bgColor-hover: var(--label-cyan-bgColor-hover);
    --label-bgColor-active: var(--label-cyan-bgColor-active);
    --label-fgColor: var(--label-cyan-fgColor-rest);
    --label-fgColor-hover: var(--label-cyan-fgColor-hover);
    --label-fgColor-active: var(--label-cyan-fgColor-active);
  }

  &[data-variant='teal'] {
    --label-bgColor-rest: var(--label-teal-bgColor-rest);
    --label-bgColor-hover: var(--label-teal-bgColor-hover);
    --label-bgColor-active: var(--label-teal-bgColor-active);
    --label-fgColor: var(--label-teal-fgColor-rest);
    --label-fgColor-hover: var(--label-teal-fgColor-hover);
    --label-fgColor-active: var(--label-teal-fgColor-active);
  }

  &[data-variant='pine'] {
    --label-bgColor-rest: var(--label-pine-bgColor-rest);
    --label-bgColor-hover: var(--label-pine-bgColor-hover);
    --label-bgColor-active: var(--label-pine-bgColor-active);
    --label-fgColor: var(--label-pine-fgColor-rest);
    --label-fgColor-hover: var(--label-pine-fgColor-hover);
    --label-fgColor-active: var(--label-pine-fgColor-active);
  }

  &[data-variant='green'] {
    --label-bgColor-rest: var(--label-green-bgColor-rest);
    --label-bgColor-hover: var(--label-green-bgColor-hover);
    --label-bgColor-active: var(--label-green-bgColor-active);
    --label-fgColor: var(--label-green-fgColor-rest);
    --label-fgColor-hover: var(--label-green-fgColor-hover);
    --label-fgColor-active: var(--label-green-fgColor-active);
  }

  &[data-variant='lime'] {
    --label-bgColor-rest: var(--label-lime-bgColor-rest);
    --label-bgColor-hover: var(--label-lime-bgColor-hover);
    --label-bgColor-active: var(--label-lime-bgColor-active);
    --label-fgColor: var(--label-lime-fgColor-rest);
    --label-fgColor-hover: var(--label-lime-fgColor-hover);
    --label-fgColor-active: var(--label-lime-fgColor-active);
  }

  &[data-variant='olive'] {
    --label-bgColor-rest: var(--label-olive-bgColor-rest);
    --label-bgColor-hover: var(--label-olive-bgColor-hover);
    --label-bgColor-active: var(--label-olive-bgColor-active);
    --label-fgColor: var(--label-olive-fgColor-rest);
    --label-fgColor-hover: var(--label-olive-fgColor-hover);
    --label-fgColor-active: var(--label-olive-fgColor-active);
  }

  &[data-variant='lemon'] {
    --label-bgColor-rest: var(--label-lemon-bgColor-rest);
    --label-bgColor-hover: var(--label-lemon-bgColor-hover);
    --label-bgColor-active: var(--label-lemon-bgColor-active);
    --label-fgColor: var(--label-lemon-fgColor-rest);
    --label-fgColor-hover: var(--label-lemon-fgColor-hover);
    --label-fgColor-active: var(--label-lemon-fgColor-active);
  }

  &[data-variant='yellow'] {
    --label-bgColor-rest: var(--label-yellow-bgColor-rest);
    --label-bgColor-hover: var(--label-yellow-bgColor-hover);
    --label-bgColor-active: var(--label-yellow-bgColor-active);
    --label-fgColor: var(--label-yellow-fgColor-rest);
    --label-fgColor-hover: var(--label-yellow-fgColor-hover);
    --label-fgColor-active: var(--label-yellow-fgColor-active);
  }

  &[data-variant='orange'] {
    --label-bgColor-rest: var(--label-orange-bgColor-rest);
    --label-bgColor-hover: var(--label-orange-bgColor-hover);
    --label-bgColor-active: var(--label-orange-bgColor-active);
    --label-fgColor: var(--label-orange-fgColor-rest);
    --label-fgColor-hover: var(--label-orange-fgColor-hover);
    --label-fgColor-active: var(--label-orange-fgColor-active);
  }

  &[data-variant='red'] {
    --label-bgColor-rest: var(--label-red-bgColor-rest);
    --label-bgColor-hover: var(--label-red-bgColor-hover);
    --label-bgColor-active: var(--label-red-bgColor-active);
    --label-fgColor: var(--label-red-fgColor-rest);
    --label-fgColor-hover: var(--label-red-fgColor-hover);
    --label-fgColor-active: var(--label-red-fgColor-active);
  }

  &[data-variant='coral'] {
    --label-bgColor-rest: var(--label-coral-bgColor-rest);
    --label-bgColor-hover: var(--label-coral-bgColor-hover);
    --label-bgColor-active: var(--label-coral-bgColor-active);
    --label-fgColor: var(--label-coral-fgColor-rest);
    --label-fgColor-hover: var(--label-coral-fgColor-hover);
    --label-fgColor-active: var(--label-coral-fgColor-active);
  }

  &[data-variant='gray'] {
    --label-bgColor-rest: var(--label-gray-bgColor-rest);
    --label-bgColor-hover: var(--label-gray-bgColor-hover);
    --label-bgColor-active: var(--label-gray-bgColor-active);
    --label-fgColor: var(--label-gray-fgColor-rest);
    --label-fgColor-hover: var(--label-gray-fgColor-hover);
    --label-fgColor-active: var(--label-gray-fgColor-active);
  }

  &[data-variant='brown'] {
    --label-bgColor-rest: var(--label-brown-bgColor-rest);
    --label-bgColor-hover: var(--label-brown-bgColor-hover);
    --label-bgColor-active: var(--label-brown-bgColor-active);
    --label-fgColor: var(--label-brown-fgColor-rest);
    --label-fgColor-hover: var(--label-brown-fgColor-hover);
    --label-fgColor-active: var(--label-brown-fgColor-active);
  }

  &[data-variant='auburn'] {
    --label-bgColor-rest: var(--label-auburn-bgColor-rest);
    --label-bgColor-hover: var(--label-auburn-bgColor-hover);
    --label-bgColor-active: var(--label-auburn-bgColor-active);
    --label-fgColor: var(--label-auburn-fgColor-rest);
    --label-fgColor-hover: var(--label-auburn-fgColor-hover);
    --label-fgColor-active: var(--label-auburn-fgColor-active);
  }
`
