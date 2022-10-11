import styled from 'styled-components';
import { variant } from 'styled-system';
import { get } from './constants.js';
import sx from './sx.js';

const variants = variant({
  variants: {
    default: {
      color: 'fg.default',
      backgroundColor: 'accent.subtle',
      borderColor: 'accent.muted',
      svg: {
        color: 'accent.fg'
      }
    },
    success: {
      color: 'fg.default',
      backgroundColor: 'success.subtle',
      borderColor: 'success.muted',
      svg: {
        color: 'success.fg'
      }
    },
    danger: {
      color: 'fg.default',
      backgroundColor: 'danger.subtle',
      borderColor: 'danger.muted',
      svg: {
        color: 'danger.fg'
      }
    },
    warning: {
      color: 'fg.default',
      backgroundColor: 'attention.subtle',
      borderColor: 'attention.muted',
      svg: {
        color: 'attention.fg'
      }
    }
  }
});
const Flash = styled.div.withConfig({
  displayName: "Flash",
  componentId: "sc-1jd8n2z-0"
})(["position:relative;color:", ";padding:", ";border-style:solid;border-width:", ";border-radius:", ";margin-top:", ";p:last-child{margin-bottom:0;}svg{margin-right:", ";}", ";", ";"], get('colors.fg.default'), get('space.3'), props => props.full ? '1px 0px' : '1px', props => props.full ? '0' : get('radii.2'), props => props.full ? '-1px' : '0', get('space.2'), variants, sx);
Flash.defaultProps = {
  variant: 'default'
};
var Flash$1 = Flash;

export { Flash$1 as default };
