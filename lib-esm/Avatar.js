import styled from 'styled-components';
import { get } from './constants.js';
import sx from './sx.js';

function getBorderRadius({
  size,
  square
}) {
  if (square) {
    return size && size <= 24 ? '4px' : '6px';
  } else {
    return '50%';
  }
}

const Avatar = styled.img.attrs(props => ({
  height: props.size,
  width: props.size
})).withConfig({
  displayName: "Avatar",
  componentId: "sc-oifmh0-0"
})(["display:inline-block;overflow:hidden;line-height:", ";vertical-align:middle;border-radius:", ";box-shadow:0 0 0 1px ", ";", ""], get('lineHeights.condensedUltra'), props => getBorderRadius(props), get('colors.avatar.border'), sx);
Avatar.defaultProps = {
  size: 20,
  alt: '',
  square: false
};

export { Avatar as default };
