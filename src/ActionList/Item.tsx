import type {IconProps} from '@primer/octicons-react'
import type {SystemStyleObject} from '@styled-system/css'
import React from 'react'
import {StyledDiv} from './private/StyledDiv'
import {StyledSpan} from './private/StyledSpan'
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
} from './private/variables'

interface ItemPropsBase extends React.ComponentPropsWithoutRef<'div'> {
  text: string
  description?: string
  descriptionVariant?: 'inline' | 'block'
  leadingVisual?: React.FunctionComponent<IconProps>
  leadingVisualSize?: 16 | 20
  size?: 'small' | 'medium' | 'large'
  variant?: 'default' | 'singleSelection' | 'multiSelection' | 'danger' | 'static'
}
interface ItemPropsWithRenderItem extends Partial<ItemPropsBase> {
  renderItem: (props: ItemProps) => JSX.Element
}
export type ItemProps = ItemPropsBase | ItemPropsWithRenderItem

function baseStyles({variant}: {variant: ItemProps['variant']}): SystemStyleObject {
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
  descriptionVariant: ItemProps['descriptionVariant']
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

export function Item({
  text,
  description,
  descriptionVariant = 'inline',
  leadingVisual: LeadingVisual,
  size: _size = 'small',
  variant = 'default',
  ...props
}: ItemProps): JSX.Element {
  return (
    <StyledDiv data-component="ActionList.Item" sx={baseStyles({variant})} {...props}>
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
