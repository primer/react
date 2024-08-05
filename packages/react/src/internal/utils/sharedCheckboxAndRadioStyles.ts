import {css} from 'styled-components'
import {get} from '../../constants'

export const sharedCheckboxAndRadioStyles = css`
  appearance: none;
  border-color: var(--control-borderColor-emphasis, ${get('colors.neutral.emphasis')});
  border-style: solid;
  border-width: ${get('borderWidths.1')};
  cursor: pointer;
  display: grid;
  height: var(--base-size-16, 16px);
  margin: 0;
  margin-top: 0.125rem; /* 2px to center align with label (20px line-height) */
  place-content: center;
  position: relative;
  width: var(--base-size-16, 16px);
  background-color: ${get('colors.canvas.default')};

  &:disabled {
    background-color: ${get('colors.input.disabledBg')};
    border-color: var(--control-borderColor-disabled, ${get('colors.border.default')});
  }
`
