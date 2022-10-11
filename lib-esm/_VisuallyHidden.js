import styled from 'styled-components';
import sx from './sx.js';

const VisuallyHidden = styled.span.withConfig({
  displayName: "_VisuallyHidden__VisuallyHidden",
  componentId: "sc-11jhm7a-0"
})(["", ""], props => {
  if (props.isVisible) {
    return sx;
  }

  return `
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
    `;
});
VisuallyHidden.defaultProps = {
  isVisible: false
};

export { VisuallyHidden as default };
