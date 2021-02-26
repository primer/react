import type {IconProps} from '@primer/octicons-react'
import type {SystemStyleObject} from '@styled-system/css'
import React from 'react'
import {StyledDiv} from './StyledDiv'
import {borderRadius2} from './variables'

export interface ActionListItemProps extends React.ComponentPropsWithoutRef<'div'> {
  text: string
  description?: string
  descriptionVariant?: 'inline' | 'block'
  leadingVisual?: React.FunctionComponent<IconProps>
  leadingVisualSize?: 16 | 20
  size?: 'small' | 'medium' | 'large'
  variant?: 'default' | 'singleSelection' | 'multiSelection' | 'danger' | 'static'
}

const baseStyles: SystemStyleObject = {
  position: 'relative',
  display: 'flex',
  alignItems: 'start',
  borderRadius: borderRadius2,
  fontWeight: 'normal',
  color: 'inherit',
  textDecoration: 'none',
  border: 'none',
  background: 'none',
  textAlign: 'start',
  margin: 0
}

const inlineDescriptionStyles: SystemStyleObject = {
  flexDirection: 'row'
}

const blockDescriptionStyles: SystemStyleObject = {
  flexDirection: 'column'
}

export function ActionListItem({
  text,
  description,
  descriptionVariant = 'inline',
  size: _size = 'small',
  ...props
}: ActionListItemProps): JSX.Element {
  return (
    <StyledDiv
      sx={{
        ...baseStyles,
        ...(descriptionVariant === 'inline' ? inlineDescriptionStyles : blockDescriptionStyles)
      }}
      {...props}
    >
      <div>{text}</div>
      {description && <div>{description}</div>}
    </StyledDiv>
  )
}
