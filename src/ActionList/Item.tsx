import type {IconProps} from '@primer/octicons-react'
import React from 'react'
import styled from 'styled-components'
import {get} from '../constants'

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
    border-radius: ${get('radii.2')};
    font-weight: normal;
    color: ${({variant}) => (variant === 'danger' ? get('colors.text.danger') : 'inherit')};
    text-decoration: none;
    border: 0;
    background: none;
    text-align: start;
    margin: 0;
    padding: calc((${get('space.3')} - ${get('space.1')}) / 2) ${get('space.2')};

    @media (hover: hover) and (pointer: fine) {
      :hover {
        background: ${props =>
          props.variant === 'danger' ? get('colors.bg.danger') : get('colors.selectMenu.tapHighlight')};
        cursor: pointer;
      }
    }
  }
`

const StyledTextContainer = styled.div<{descriptionVariant: ItemProps['descriptionVariant']}>`
  flex-direction: ${({descriptionVariant}) => (descriptionVariant === 'inline' ? 'row' : 'column')};
`

const LeadingVisualContainer = styled.div`
  width: ${get('space.3')};
  height: calc(${get('space.4')} - ${get('space.1')});
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: ${get('space.2')};

  svg {
    fill: ${get('colors.text.secondary')};
    font-size: ${get('fontSizes.0')};
  }
`

const DescriptionContainer = styled.div`
  color: ${get('colors.text.secondary')};
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
    <StyledItem variant={variant} {...props}>
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
