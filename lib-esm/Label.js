import styled from 'styled-components';
import { variant } from 'styled-system';
import sx from './sx.js';
import { get } from './constants.js';

const variants = {
  default: {
    borderColor: 'border.default'
  },
  primary: {
    borderColor: 'fg.default'
  },
  secondary: {
    borderColor: 'border.muted',
    color: 'fg.muted'
  },
  accent: {
    borderColor: 'accent.emphasis',
    color: 'accent.fg'
  },
  success: {
    borderColor: 'success.emphasis',
    color: 'success.fg'
  },
  attention: {
    borderColor: 'attention.emphasis',
    color: 'attention.fg'
  },
  severe: {
    borderColor: 'severe.emphasis',
    color: 'severe.fg'
  },
  danger: {
    borderColor: 'danger.emphasis',
    color: 'danger.fg'
  },
  done: {
    borderColor: 'done.fg',
    color: 'done.emphasis'
  },
  sponsors: {
    borderColor: 'sponsors.fg',
    color: 'sponsors.emphasis'
  }
};
const sizes = {
  small: {
    height: '20px',
    padding: '0 7px' // hard-coded to align with Primer ViewComponents and Primer CSS

  },
  large: {
    height: '24px',
    padding: '0 10px' // hard-coded to align with Primer ViewComponents and Primer CSS

  }
};
const Label = styled.span.withConfig({
  displayName: "Label",
  componentId: "sc-6dyj7v-0"
})(["align-items:center;background-color:transparent;border-width:1px;border-radius:999px;border-style:solid;display:inline-flex;font-weight:", ";font-size:", ";line-height:1;white-space:nowrap;", ";", ";", ";"], get('fontWeights.bold'), get('fontSizes.0'), variant({
  variants
}), variant({
  prop: 'size',
  variants: sizes
}), sx);
Label.defaultProps = {
  size: 'small',
  variant: 'default'
};
var Label$1 = Label;

export { Label$1 as default, variants };
