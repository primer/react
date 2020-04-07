import * as React from 'react';
import { Page, Frame } from 'react-figma';

// @ts-ignore
import styled, { ThemeProvider } from 'styled-components';
import { layout } from 'styled-system';

import Section from './components/Section';
import { Subtitle } from './components/Heading';

import Text from '../../src/Text';
import Flex from '../../src/Flex';
import Avatar from '../../src/Avatar';
import AvatarPair from '../../src/AvatarPair';
import Button from '../../src/Button';
import ButtonPrimary from '../../src/ButtonPrimary';
import ButtonDanger from '../../src/ButtonDanger';
import ButtonOutline from '../../src/ButtonOutline';

// import Text from '../../src/Text';
import theme from '../../src/theme';

const Artboard = styled(Frame)`
  padding: 40px;
  background-color: #ffffff;
  padding-top: 40px;
  padding-bottom: 40px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  ${layout}
`;

const Components = () => (
  <Flex justifyContent="flex-start" flex={1} flexDirection="column">
    <Text fontSize={40}>Components Style-guide</Text>
    <Text>TODO:</Text>
  </Flex>
)

// @ts-ignore
const GroupTitle = styled.Text`
  font-family: 'SF Pro Text';
  font-size: 24px;
  font-weight: 600;
  line-height: 24px;
  margin-bottom: 22px;
`;

const styleguide = [{
  name: 'Components',
  type: 'components',
  isCurrent: true,
  data: {},
  screens: [{
    name: 'Components',
    component: Components,
    data: {},
  }],
  pages: [{
    name: 'Avatar',
    data: {},
    sections: [{
      title: 'Avatars',
      description: 'Avatars are images used to represent users and organizations on GitHub. They typically are squares with rounded edges.',
      data: {},
      component: () => (
        <>
          <Subtitle mb={3}>Default example</Subtitle>
          <Flex flexDirection="row">
            <Avatar source="https://avatars.githubusercontent.com/primer" size={128} />
            {/* AvatarPair: parent Frame doesn't resolve the sizing properly, and box-shadow is applied to wrong layer */}
            {/* <AvatarPair my={4}>
              <Avatar source="https://avatars.githubusercontent.com/primer" />
              <Avatar source="https://avatars.githubusercontent.com/primer" />
            </AvatarPair> */}
            {/* AvatarStack: Need to replace <div className="AvatarItem-more AvatarItem" /> with an encapsulated component
              <AvatarStack>
                <img alt="Primer" src="https://avatars.githubusercontent.com/primer" />
                <img alt="GitHub" src="https://avatars.githubusercontent.com/github" />
                <img alt="Atom" src="https://avatars.githubusercontent.com/atom" />
                <img alt="Desktop" src="https://avatars.githubusercontent.com/desktop" />
              </AvatarStack>
              */}
          </Flex>
        </>
      )
    }]
  }, {
    name: 'Buttons',
    sections: [{
      title: 'Buttons',
      description: 'Button is used for actions, like in forms, while Link is used for destinations, or moving from one page to another.',
      data: {},
      component: () => (
        <>
          <Subtitle mb={3}>Default examples</Subtitle>
          <Flex flexDirection="row">
            <Button>Button</Button>
            <ButtonDanger>Button Danger</ButtonDanger>
            <ButtonOutline>Button Outline</ButtonOutline>
            <ButtonPrimary>Button Primary</ButtonPrimary>
          </Flex>
        </>
      ),
    }]
  }],
}]

const StyleGuide = () => (
  <>
    {styleguide.map(({
      type, name, screens, data, pages,
    }) => (
        <>
          <Page name={name} key={name}>
            {screens.map(({ name: screenName, component: Component, data: compData }) => (
              <Artboard width={600} name={screenName}>
                <Component {...{ [type]: Object.assign({}, data, compData) }} />
              </Artboard>
            ))}
          </Page>
          {pages && pages.map(page => (
            <Page name={`    ↳ ${page.name}`} key={`${name} / ${page.name}`}>
              {/*page.component ? (
                <Artboard width={600} name={page.name}>
                  <page.component {...{ [type]: Object.assign({}, data, page.data) }} />
                </Artboard>
              ) :*/ (page.sections || []).map(({ title, description, component: Component, data: compData }) => (
                <Artboard width={600} name={title}>
                  <Section title={title} description={description}>
                    <Component {...{ [type]: Object.assign({}, data, compData) }} />
                  </Section>
                </Artboard>
              ))}
            </Page>
          ))}
        </>
      ))}
  </>
);

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <StyleGuide />
    </ThemeProvider>
  );
};
