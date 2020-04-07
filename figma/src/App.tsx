import * as React from 'react';
import { Page, Frame } from 'react-figma';

// @ts-ignore
import styled, { ThemeProvider } from 'styled-components';
import { layout } from 'styled-system';

import Button from '../../src/Button';
import ButtonPrimary from '../../src/ButtonPrimary';
import ButtonDanger from '../../src/ButtonDanger';
import ButtonOutline from '../../src/ButtonOutline';

// import Text from '../../src/Text';
import theme from '../../src/theme';

const Artboard = styled(Frame)`
  padding-top: 40px;
  padding-bottom: 40px;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  ${layout}
`;

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Page isCurrent name="Buttons">
        <Artboard width={800}>
          <Button>Button</Button>
          <ButtonDanger>Button Danger</ButtonDanger>
          <ButtonOutline>Button Outline</ButtonOutline>
          <ButtonPrimary>Button Primary</ButtonPrimary>
        </Artboard>
      </Page>
    </ThemeProvider>
  );
};
