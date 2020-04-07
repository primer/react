import * as React from 'react';
import styled from 'styled-components';

import Box from '../../../src/Box';
import Flex from '../../../src/Flex';
import Text from '../../../src/Text';

import { Title } from './Heading';

const Line = styled(Box)``;
Line.defaultProps = {
  width: 64,
  height: 1,
  bg: 'black',
  borderWidth: 0,
}



interface SectionProps {
  title: string,
  description?: string,
  children: React.ReactNode,
};

// TODO: Investigate why the maxWidth={520} is needed to prevent overlap, seems flex={1} isn't working?

const Section = ({ title, description, children }: SectionProps) => (
  <Flex flex={1} maxWidth={520}>
    <Box mb={40}>
      <Title mb={1}>
        {title}
      </Title>
      <Line bg="#ddd" width={520} />
      {Boolean(description) && (
        <Text fontSize={14} mt={20} style={{ maxWidth: 520 }}>
          {description}
        </Text>
      )}
    </Box>
    {children}
  </Flex>
);

export default Section;
