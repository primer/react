import type {IconProps} from '@primer/octicons-react'
import React from 'react'
import styled from 'styled-components'
import {get} from '../constants'

/**
 * Contract for props passed to the `Item` component.
 */
interface ItemPropsBase extends React.ComponentPropsWithoutRef<'div'> {
  /**
   * Primary text which names an `Item`.
   */
  text: string

  /**
   * Secondary text which provides additional information about an `Item`.
   */
  description?: string

  /**
   * Secondary text style variations. Usage is discretionary.
   *
   * - `"inline"` - Secondary text is positioned beside primary text.
   * - `"block"` - Secondary text is positioned below primary text.
   */
  descriptionVariant?: 'inline' | 'block'

  /**
   * Icon (or similar) positioned before `Item` text.
   */
  leadingVisual?: React.FunctionComponent<IconProps>

  /**
   * Style variations associated with various `Item` types.
   *
   * - `"default"` - An action `Item`.
   * - `"danger"` - A destructive action `Item`.
   */
  variant?: 'default' | 'danger'
}

/**
 * Contract for props passed to the `Item` component, when an `Item`-level custom `Item` renderer is used.
 */
interface ItemPropsWithRenderItem extends Partial<ItemPropsBase> {
  /**
   * An `Item`-level custom `Item` renderer.
   */
  renderItem: (props: ItemProps) => JSX.Element
}

/**
 * Contract for props passed to the `Item` component.
 */
export type ItemProps = ItemPropsBase | ItemPropsWithRenderItem

const StyledItem = styled.div<{variant: ItemProps['variant']}>`
    display: flex;
    border-radius: ${get('radii.2')};
    color: ${({variant}) => (variant === 'danger' ? get('colors.text.danger') : 'inherit')};
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

const DescriptionContainer = styled.span`
  color: ${get('colors.text.secondary')};
`

/**
 * An actionable or selectable `Item` with an optional icon and description.
 */
export function Item({
  text,
  description,
  descriptionVariant = 'inline',
  leadingVisual: LeadingVisual,
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
