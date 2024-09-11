import React from 'react'
import type {Meta, StoryFn} from '@storybook/react'
import {PageLayout} from './PageLayout'
import {Placeholder} from '../Placeholder'
import {Box, BranchName, Heading, Link, StateLabel, TabNav, Text} from '..'

export default {
  title: 'Components/PageLayout/Features',
  component: PageLayout,
} as Meta<typeof PageLayout>

export const PullRequestPage = () => (
  <PageLayout>
    <PageLayout.Header>
      <Box sx={{display: 'flex', flexDirection: 'column', gap: 3}}>
        <Box>
          <Heading as="h1" sx={{fontWeight: 'normal'}}>
            Input validation styles <Text sx={{color: 'fg.muted', fontWeight: 'light'}}>#1831</Text>
          </Heading>
          <Box sx={{display: 'flex', gap: 2, alignItems: 'center'}}>
            <StateLabel status="pullOpened">Open</StateLabel>
            <Text sx={{fontSize: 1, color: 'fg.muted'}}>
              <Link href="#" muted sx={{fontWeight: 'bold'}}>
                mperrotti
              </Link>{' '}
              wants to merge 3 commits into <BranchName href="#">main</BranchName> from{' '}
              <BranchName href="#">mp/validation-styles</BranchName>
            </Text>
          </Box>
        </Box>
        <TabNav>
          <TabNav.Link href="#" selected>
            Conversation
          </TabNav.Link>
          <TabNav.Link href="#">Commits</TabNav.Link>
          <TabNav.Link href="#">Checks</TabNav.Link>
          <TabNav.Link href="#">Files changed</TabNav.Link>
        </TabNav>
      </Box>
    </PageLayout.Header>
    <PageLayout.Content>
      <Box sx={{border: '1px solid', borderRadius: 2, borderColor: 'border.default', height: 200}}></Box>
      <Box
        sx={{
          maxWidth: '100%',
          overflowX: 'auto',
          border: '1px solid',
          whiteSpace: 'nowrap',
          borderColor: 'border.default',
          mt: 3,
          p: 3,
          borderRadius: 2,
        }}
        tabIndex={0}
      >
        This box has really long content. If it is too long, it will cause x overflow and should show a scrollbar. When
        this overflows, it should not break to overall page layout!
      </Box>
    </PageLayout.Content>
    <PageLayout.Pane>
      <Box sx={{display: 'flex', flexDirection: 'column', gap: 3}}>
        <Box>
          <Text sx={{fontSize: 0, fontWeight: 'bold', display: 'block', color: 'fg.muted'}}>Assignees</Text>
          <Text sx={{fontSize: 0, color: 'fg.muted', lineHeight: 'condensed'}}>
            No one –{' '}
            <Link href="#" muted>
              assign yourself
            </Link>
          </Text>
        </Box>
        <Box role="separator" sx={{width: '100%', height: 1, backgroundColor: 'border.default'}}></Box>
        <Box>
          <Text sx={{fontSize: 0, fontWeight: 'bold', display: 'block', color: 'fg.muted'}}>Labels</Text>
          <Text sx={{fontSize: 0, color: 'fg.muted', lineHeight: 'condensed'}}>None yet</Text>
        </Box>
      </Box>
    </PageLayout.Pane>
  </PageLayout>
)

export const StickyPane: StoryFn = args => (
  <PageLayout rowGap="none" columnGap="none" padding="none" containerWidth="full">
    <PageLayout.Header padding="normal" divider="line">
      <Placeholder label="Header" height={64} />
    </PageLayout.Header>
    <PageLayout.Content padding="normal" width="large">
      <Box sx={{display: 'grid', gap: 3}}>
        {Array.from({length: args.numParagraphsInContent}).map((_, i) => {
          const testId = `content${i}`
          return (
            <Box key={i} as="p" sx={{margin: 0}}>
              <span data-testid={testId}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam at enim id lorem tempus egestas a non
                ipsum. Maecenas imperdiet ante quam, at varius lorem molestie vel. Sed at eros consequat, varius tellus
                et, auctor felis. Donec pulvinar lacinia urna nec commodo. Phasellus at imperdiet risus. Donec sit amet
                massa purus. Nunc sem lectus, bibendum a sapien nec, tristique tempus felis. Ut porttitor auctor tellus
                in imperdiet. Ut blandit tincidunt augue, quis fringilla nunc tincidunt sed. Vestibulum auctor euismod
                nisi. Nullam tincidunt est in mi tincidunt dictum. Sed consectetur aliquet velit ut ornare.
              </span>
            </Box>
          )
        })}
      </Box>
    </PageLayout.Content>
    <PageLayout.Pane
      position="start"
      resizable
      padding="normal"
      divider="line"
      sticky={args.sticky}
      aria-label="Side pane"
    >
      <Box sx={{display: 'grid', gap: 3}}>
        {Array.from({length: args.numParagraphsInPane}).map((_, i) => {
          const testId = `paragraph${i}`
          return (
            <Box key={i} as="p" sx={{margin: 0}}>
              <span data-testid={testId}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam at enim id lorem tempus egestas a non
                ipsum. Maecenas imperdiet ante quam, at varius lorem molestie vel. Sed at eros consequat, varius tellus
                et, auctor felis. Donec pulvinar lacinia urna nec commodo. Phasellus at imperdiet risus. Donec sit amet
                massa purus.
              </span>
            </Box>
          )
        })}
        <Box as="p">
          Donec sit amet massa purus. <a href="#foo">Plura de lorem Ispum.</a>
        </Box>
      </Box>
    </PageLayout.Pane>
    <PageLayout.Footer padding="normal" divider="line">
      <Placeholder label="Footer" height={64} />
    </PageLayout.Footer>
  </PageLayout>
)

StickyPane.args = {
  sticky: true,
  numParagraphsInPane: 10,
  numParagraphsInContent: 30,
}

StickyPane.argTypes = {
  sticky: {
    type: 'boolean',
  },
  numParagraphsInPane: {
    type: 'number',
  },
  numParagraphsInContent: {
    type: 'number',
  },
}

export const NestedScrollContainer: StoryFn = args => (
  <Box sx={{display: 'grid', gridTemplateRows: 'auto 1fr auto', height: '100vh'}}>
    <Placeholder label="Above scroll container" height={120} />
    <Box sx={{overflow: 'auto'}}>
      <PageLayout rowGap="none" columnGap="none" padding="none" containerWidth="full">
        <PageLayout.Header padding="normal" divider="line">
          <Placeholder label="Header" height={64} />
        </PageLayout.Header>
        <PageLayout.Content padding="normal" width="large">
          <Box sx={{display: 'grid', gap: 3}} tabIndex={0} role="region" aria-label="Page content">
            {Array.from({length: args.numParagraphsInContent}).map((_, i) => (
              <Box key={i} as="p" sx={{margin: 0}}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam at enim id lorem tempus egestas a non
                ipsum. Maecenas imperdiet ante quam, at varius lorem molestie vel. Sed at eros consequat, varius tellus
                et, auctor felis. Donec pulvinar lacinia urna nec commodo. Phasellus at imperdiet risus. Donec sit amet
                massa purus. Nunc sem lectus, bibendum a sapien nec, tristique tempus felis. Ut porttitor auctor tellus
                in imperdiet. Ut blandit tincidunt augue, quis fringilla nunc tincidunt sed. Vestibulum auctor euismod
                nisi. Nullam tincidunt est in mi tincidunt dictum. Sed consectetur aliquet velit ut ornare.
              </Box>
            ))}
          </Box>
        </PageLayout.Content>
        <PageLayout.Pane position="start" padding="normal" divider="line" sticky aria-label="Side pane">
          <Box sx={{display: 'grid', gap: 3}}>
            {Array.from({length: args.numParagraphsInPane}).map((_, i) => (
              <Box key={i} as="p" sx={{margin: 0}}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam at enim id lorem tempus egestas a non
                ipsum. Maecenas imperdiet ante quam, at varius lorem molestie vel. Sed at eros consequat, varius tellus
                et, auctor felis. Donec pulvinar lacinia urna nec commodo. Phasellus at imperdiet risus. Donec sit amet
                massa purus.
              </Box>
            ))}
          </Box>
        </PageLayout.Pane>
        <PageLayout.Footer padding="normal" divider="line">
          <Placeholder label="Footer" height={64} />
        </PageLayout.Footer>
      </PageLayout>
    </Box>
    <Placeholder label="Below scroll container" height={120} />
  </Box>
)

NestedScrollContainer.args = {
  numParagraphsInPane: 10,
  numParagraphsInContent: 30,
}

NestedScrollContainer.argTypes = {
  numParagraphsInPane: {
    type: 'number',
  },
  numParagraphsInContent: {
    type: 'number',
  },
}

export const CustomStickyHeader: StoryFn = args => (
  // a box to create a sticky top element that will be on the consumer side and outside of the PageLayout component
  <Box data-testid="story-window">
    <Box
      as="header"
      data-testid="sticky-header"
      sx={{
        position: 'sticky',
        top: 0,
        height: args.offsetHeader,
        display: 'grid',
        placeItems: 'center',
        backgroundColor: 'canvas.subtle',
        borderBottom: '1px solid',
        borderColor: 'border.default',
        zIndex: 100,
      }}
    >
      Custom sticky header
    </Box>
    <PageLayout rowGap="none" columnGap="none" padding="none" containerWidth="full">
      <PageLayout.Content padding="normal" width="large">
        <Box sx={{display: 'grid', gap: 3}} data-testid="scrollContainer">
          {Array.from({length: args.numParagraphsInContent}).map((_, i) => {
            const testId = `content${i}`
            return (
              <Box key={i} as="p" sx={{margin: 0}}>
                <span data-testid={testId}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vitae orci et magna consectetur
                  ullamcorper eget ac purus. Nam at enim id lorem tempus egestas a non ipsum. Maecenas imperdiet ante
                  quam, at varius lorem molestie vel. Sed at eros consequat, varius tellus et, auctor felis. Donec
                  pulvinar lacinia urna nec commodo. Phasellus at imperdiet risus. Donec sit amet massa purus. Nunc sem
                  lectus, bibendum a sapien nec, tristique tempus felis. Ut porttitor auctor tellus in imperdiet. Ut
                  blandit tincidunt augue, quis fringilla nunc tincidunt sed. Vestibulum auctor euismod nisi. Nullam
                  tincidunt est in mi tincidunt dictum. Sed consectetur aliquet velit ut ornare.
                </span>
              </Box>
            )
          })}
        </Box>
      </PageLayout.Content>
      <PageLayout.Pane
        position="start"
        padding="normal"
        divider="line"
        aria-label="Aside pane"
        sticky
        offsetHeader={args.offsetHeader}
      >
        <Box sx={{display: 'grid', gap: 3}}>
          {Array.from({length: args.numParagraphsInPane}).map((_, i) => {
            const testId = `paragraph${i}`
            return (
              <Box key={i} as="p" sx={{margin: 0}}>
                <span data-testid={testId}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam at enim id lorem tempus egestas a non
                  ipsum. Maecenas imperdiet ante quam, at varius lorem molestie vel. Sed at eros consequat, varius
                  tellus et, auctor felis. Donec pulvinar lacinia urna nec commodo. Phasellus at imperdiet risus. Donec
                  sit amet massa purus.
                </span>
              </Box>
            )
          })}
        </Box>
      </PageLayout.Pane>
      <PageLayout.Footer padding="normal" divider="line">
        <Placeholder label="Footer" height={64} />
      </PageLayout.Footer>
    </PageLayout>
  </Box>
)

CustomStickyHeader.args = {
  sticky: true,
  offsetHeader: '8rem',
  numParagraphsInPane: 10,
  numParagraphsInContent: 30,
}

CustomStickyHeader.argTypes = {
  sticky: {
    type: 'boolean',
  },
  offsetHeader: {
    type: 'string',
  },
  numParagraphsInPane: {
    type: 'number',
  },
  numParagraphsInContent: {
    type: 'number',
  },
}

export const ResizablePane: StoryFn = () => (
  <PageLayout containerWidth="full">
    <PageLayout.Header>
      <Placeholder height={64} label="Header" />
    </PageLayout.Header>
    <PageLayout.Pane resizable position="start">
      <Placeholder height={320} label="Pane" />
    </PageLayout.Pane>
    <PageLayout.Content>
      <Placeholder height={640} label="Content" />
    </PageLayout.Content>
    <PageLayout.Footer>
      <Placeholder height={64} label="Footer" />
    </PageLayout.Footer>
  </PageLayout>
)

export const ScrollContainerWithinPageLayoutPane: StoryFn = () => (
  <Box sx={{display: 'grid', gridTemplateRows: 'auto 1fr auto', height: '100vh'}}>
    <Box sx={{overflow: 'auto'}}>
      <Placeholder label="Above inner scroll container" height={120} />
      <PageLayout rowGap="none" columnGap="none" padding="none" containerWidth="full">
        <PageLayout.Pane position="start" padding="normal" divider="line" sticky aria-label="Sticky pane">
          <Box sx={{overflow: 'auto'}}>
            <PageLayout.Pane padding="normal">
              <Placeholder label="Inner scroll container" height={800} />
            </PageLayout.Pane>
          </Box>
        </PageLayout.Pane>
        <PageLayout.Content padding="normal" width="large">
          <Box sx={{display: 'grid'}} tabIndex={0} role="region" aria-label="Page content">
            <Placeholder label="Page content" height={1600} />
          </Box>
        </PageLayout.Content>
      </PageLayout>
      <Placeholder label="Beneath inner scroll container" height={120} />
    </Box>
  </Box>
)

export const CustomPaneWidths: StoryFn = () => (
  <PageLayout containerWidth="full">
    <PageLayout.Header>
      <Placeholder height={64} label="Header" />
    </PageLayout.Header>
    <PageLayout.Pane resizable width={{min: '200px', default: '300px', max: '400px'}}>
      <Placeholder height={320} label="Pane" />
    </PageLayout.Pane>
    <PageLayout.Content>
      <Placeholder height={640} label="Content" />
    </PageLayout.Content>
    <PageLayout.Footer>
      <Placeholder height={64} label="Footer" />
    </PageLayout.Footer>
  </PageLayout>
)

export const WithCustomPaneHeading: StoryFn = () => (
  <PageLayout containerWidth="full">
    <PageLayout.Header>
      <Placeholder height={64} label="Header" />
    </PageLayout.Header>
    <PageLayout.Pane resizable position="start">
      <Heading as="h2" sx={{fontSize: 3}} id="pane-heading">
        Pane Heading
      </Heading>
      <Placeholder height={320} label="Pane" />
    </PageLayout.Pane>
    <PageLayout.Content>
      <Placeholder height={640} label="Content" />
    </PageLayout.Content>
    <PageLayout.Footer>
      <Placeholder height={64} label="Footer" />
    </PageLayout.Footer>
  </PageLayout>
)
