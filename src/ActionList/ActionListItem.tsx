import type {IconProps} from '@primer/octicons-react'
import type {SystemStyleObject} from '@styled-system/css'
import React from 'react'
import {StyledDiv} from './StyledDiv'
import {StyledSpan} from './StyledSpan'
import {
  borderRadius2,
  s6,
  s8,
  s16,
  s20,
  actionListItemHoverBg,
  actionListItemDangerHoverBg,
  textSecondary,
  textDanger,
  textSmall
} from './variables'

export interface ActionListItemProps extends React.ComponentPropsWithoutRef<'div'> {
  text: string
  description?: string
  descriptionVariant?: 'inline' | 'block'
  leadingVisual?: React.FunctionComponent<IconProps>
  leadingVisualSize?: 16 | 20
  size?: 'small' | 'medium' | 'large'
  variant?: 'default' | 'singleSelection' | 'multiSelection' | 'danger' | 'static'
}

function baseStyles({variant}: {variant: ActionListItemProps['variant']}): SystemStyleObject {
  return {
    position: 'relative',
    display: 'flex',
    alignItems: 'start',
    borderRadius: borderRadius2,
    fontWeight: 'normal',
    color: variant === 'danger' ? textDanger : 'inherit',
    textDecoration: 'none',
    border: 'none',
    background: 'none',
    textAlign: 'start',
    margin: 0,
    padding: `${s6}px ${s8}px`,

    '@media (hover: hover) and (pointer: fine)': {
      ':hover': {
        background: variant === 'danger' ? actionListItemDangerHoverBg : actionListItemHoverBg,
        cursor: 'pointer'
      }
    }
  }
}

function textContainerStyles({
  descriptionVariant
}: {
  descriptionVariant: ActionListItemProps['descriptionVariant']
}): SystemStyleObject {
  return {flexDirection: descriptionVariant === 'inline' ? 'row' : 'column'}
}

const leadingVisualStyles: SystemStyleObject = {
  width: `${s16}px`,
  height: `${s20}px`,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  marginRight: `${s8}px`,

  svg: {
    fill: textSecondary,
    fontSize: textSmall
  }
}

const descriptionStyles: SystemStyleObject = {
  color: textSecondary
}

export function ActionListItem({
  text,
  description,
  descriptionVariant = 'inline',
  leadingVisual: LeadingVisual,
  size: _size = 'small',
  variant = 'default',
  ...props
}: ActionListItemProps): JSX.Element {
  return (
    <StyledDiv data-component="ActionListItem" sx={baseStyles({variant})} {...props}>
      {LeadingVisual && (
        <StyledSpan sx={leadingVisualStyles}>
          <LeadingVisual />
        </StyledSpan>
      )}
      <StyledDiv sx={textContainerStyles({descriptionVariant})}>
        <div>{text}</div>
        {description && <StyledDiv sx={descriptionStyles}>{description}</StyledDiv>}
      </StyledDiv>
    </StyledDiv>
  )
}
