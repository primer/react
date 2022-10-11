import styled from 'styled-components';
import { get } from './constants.js';
import sx from './sx.js';

const colorStyles = ({
  scheme,
  ...props
}) => {
  return {
    color: scheme === 'secondary' ? get('colors.fg.default')(props) : scheme === 'primary' ? get('colors.fg.onEmphasis')(props) : get('colors.fg.default')(props)
  };
};

const bgStyles = ({
  scheme,
  ...props
}) => {
  return {
    backgroundColor: scheme === 'secondary' ? get('colors.neutral.muted')(props) : scheme === 'primary' ? get('colors.neutral.emphasis')(props) : get('colors.neutral.muted')(props)
  };
};

const CounterLabel = styled.span.withConfig({
  displayName: "CounterLabel",
  componentId: "sc-13ceqbg-0"
})(["display:inline-block;padding:2px 5px;font-size:", ";font-weight:", ";line-height:", ";border-radius:20px;", ";", ";&:empty{display:none;}", ";"], get('fontSizes.0'), get('fontWeights.bold'), get('lineHeights.condensedUltra'), colorStyles, bgStyles, sx);

export { CounterLabel as default };
