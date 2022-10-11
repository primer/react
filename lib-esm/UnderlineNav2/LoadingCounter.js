import styled, { keyframes } from 'styled-components';
import { get } from '../constants.js';

const loading = keyframes(["from{opacity:0.4;}to{opacity:0.8;}"]);
const LoadingCounter = styled.span.withConfig({
  displayName: "LoadingCounter",
  componentId: "sc-ouonic-0"
})(["animation:", " 1.2s linear infinite alternate;background-color:", ";border-color:", ";width:1.5rem;height:1rem;display:inline-block;border-radius:20px;"], loading, get('colors.neutral.emphasis'), get('colors.border.default'));

export { LoadingCounter };
