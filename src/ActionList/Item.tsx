import {CheckIcon, IconProps} from '@primer/octicons-react'
import React from 'react'
import {get} from '../constants'
import sx, {SxProp} from '../sx'
import {ItemInput} from './List'
import styled from 'styled-components'

/**
 * Contract for props passed to the `Item` component.
 */
export interface ItemProps extends React.ComponentPropsWithoutRef<'div'>, SxProp {
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
   * Icon (or similar) positioned after `Item` text.
   */
  trailingIcon?: React.FunctionComponent<IconProps>

  /**
   * Text positioned after `Item` text and optional trailing icon.
   */
  trailingText?: string

  /**
   * Style variations associated with various `Item` types.
   *
   * - `"default"` - An action `Item`.
   * - `"danger"` - A destructive action `Item`.
   */
  variant?: 'default' | 'danger'

  /**
   * For `Item`s which can be selected, whether the `Item` is currently selected.
   */
  selected?: boolean

  /**
   * Designates the group that an item belongs to.
   */
  groupId?: string
}

const StyledItem = styled.div<{variant: ItemProps['variant']} & SxProp>`
  /* 6px vertical padding + 20px line height = 32px total height
   *
   * TODO: When rem-based spacing on a 4px scale lands, replace
   * hardcoded '6px' with 'calc((${get('space.s32')} - ${get('space.20')}) / 2)'.
   */
  padding: 6px ${get('space.2')};
  display: flex;
  border-radius: ${get('radii.2')};
  color: ${({variant}) => (variant === 'danger' ? get('colors.text.danger') : 'inherit')};

  @media (hover: hover) and (pointer: fine) {
    :hover {
      background: ${props =>
        props.variant === 'danger' ? get('colors.bg.danger') : get('colors.selectMenu.tapHighlight')};
      cursor: pointer;
    }
  }

  ${sx}
`

const StyledTextContainer = styled.div<{descriptionVariant: ItemProps['descriptionVariant']}>`
  flex-direction: ${({descriptionVariant}) => (descriptionVariant === 'inline' ? 'row' : 'column')};
`

const BaseVisualContainer = styled.div`
  // Match visual height to adjacent text line height.
  // TODO: When rem-based spacing on a 4px scale lands, replace
  // hardcoded '20px' with '${get('space.s20')}'.
  height: 20px;
  width: ${get('space.3')};
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: ${get('space.2')};

  svg {
    fill: ${get('colors.text.secondary')};
    font-size: ${get('fontSizes.0')};
  }
`

const LeadingVisualContainer = styled(BaseVisualContainer)``

const TrailingVisualContainer = styled(BaseVisualContainer)`
  color: ${get('colors.icon.tertiary')};
  margin-left: auto;
  margin-right: 0;
  div:nth-child(2) {
    margin-left: ${get('space.2')};
  }
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
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
  selected,
  leadingVisual: LeadingVisual,
  trailingIcon: TrailingIcon,
  trailingText,
  variant = 'default',
  ...props
}: Partial<ItemProps> & {item?: ItemInput}): JSX.Element {
  return (
    <StyledItem tabIndex={-1} variant={variant} aria-selected={selected} {...props}>
      {!!selected === selected && <LeadingVisualContainer>{selected && <CheckIcon />}</LeadingVisualContainer>}
      {LeadingVisual && (
        <LeadingVisualContainer>
          <LeadingVisual />
        </LeadingVisualContainer>
      )}
      <StyledTextContainer descriptionVariant={descriptionVariant}>
        <div>{text}</div>
        {description && <DescriptionContainer>{description}</DescriptionContainer>}
      </StyledTextContainer>
      {(TrailingIcon || trailingText) && (
        <TrailingVisualContainer>
          {trailingText && <div>{trailingText}</div>}
          {TrailingIcon && (
            <div>
              <TrailingIcon />
            </div>
          )}
        </TrailingVisualContainer>
      )}
    </StyledItem>
  )
}
