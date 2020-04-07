import styled from 'styled-components';
import { typography } from 'styled-system';

import BaseHeading from '../../../src/Heading';

export const Title = styled(BaseHeading)`
  
  font-family: 'SF Pro Text';
  font-size: 24px;
  font-weight: 600;
  line-height: 24px;
`;

// Title.defaultProps = {
//   fontFamily: 'SF Pro Text',
//   fontSize: 24,
//   fontWeight: 600,
//   lineHeight: 24,
// };

export const Subtitle = styled(Title)`
  font-weight: 500;
  font-size: 18;
  line-height: 20;
`;

// Subtitle.defaultProps = {
//   fontWeight: 500,
//   fontSize: 20,
//   lineHeight: 20,
// };
