/* eslint-disable import/first */
/* eslint-disable import/no-mutable-exports */
/* eslint-disable prettier/prettier */
import { Platform } from 'react-primitives';

let styled, ThemeProvider, css;

import styledW, { css as cssW, ThemeProvider as ThemeProviderW } from '../node_modules/styled-components';
import styledP, { css as cssP, ThemeProvider as ThemeProviderP } from '../node_modules/styled-components/primitives';

if (Platform.OS === 'figma') {
  styled = styledP;
  ThemeProvider = ThemeProviderP;
  css = cssP;

  styled.div = styled.View;
  styled.button = styled.View;
  styled.span = styled.Text;
} else {
  styled = styledW;
  ThemeProvider = ThemeProviderW;
  css = cssW;

  styled.View = styled.div;
  styled.Text = styled.span;
}

export { ThemeProvider, css };

export default styled;
