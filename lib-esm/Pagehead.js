import styled from 'styled-components';
import { get } from './constants.js';
import sx from './sx.js';

const Pagehead = styled.div.withConfig({
  displayName: "Pagehead",
  componentId: "sc-17d52hr-0"
})(["position:relative;padding-top:", ";padding-bottom:", ";margin-bottom:", ";border-bottom:1px solid ", ";", ";"], get('space.4'), get('space.4'), get('space.4'), get('colors.border.default'), sx);
var Pagehead$1 = Pagehead;

export { Pagehead$1 as default };
