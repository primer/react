import type {IconProps} from '@primer/octicons-react'
import React from 'react'
import styled from 'styled-components'
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

const StyledItem = styled.div<{variant: ItemProps['variant']}>`
    position: relative;
    display: flex;
    align-items: start;
    border-radius: ${borderRadius2};
    font-weight: normal;
    color: ${({variant}) => (variant === 'danger' ? textDanger : 'inherit')};
    text-decoration: none;
    border: 0;
    background: none;
    text-align: start;
    margin: 0;
    padding: ${s6}px ${s8}px;

    @media (hover: hover) and (pointer: fine) {
      :hover {
        background: ${props => (props.variant === 'danger' ? actionListItemDangerHoverBg : actionListItemHoverBg)};
        cursor: pointer;
      }
    }
  }
`

const StyledTextContainer = styled.div<{descriptionVariant: ItemProps['descriptionVariant']}>`
  flex-direction: ${({descriptionVariant}) => (descriptionVariant === 'inline' ? 'row' : 'column')};
`

const LeadingVisualContainer = styled.span`
  width: ${s16}px;
  height: ${s20}px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: ${s8}px;

  svg {
    fill: ${textSecondary};
    font-size: ${textSmall};
  }
`

const DescriptionContainer = styled.div`
  color: ${textSecondary};
`

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
    <StyledItem data-component="ActionList.Item" variant={variant} {...props}>
      {LeadingVisual && (
        <LeadingVisualContainer>
          <LeadingVisual />
        </LeadingVisualContainer>
      )}
      <StyledTextContainer descriptionVariant={descriptionVariant}>
        <div>{text}</div>
        {description && <DescriptionContainer>{description}</DescriptionContainer>}
      </StyledTextContainer>
    </StyledItem>
  )
}
