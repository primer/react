import type {Meta, StoryFn} from '@storybook/react-vite'
import React from 'react'
import {PageLayout} from './PageLayout'
import {Placeholder} from '../Placeholder'
import {BranchName, Heading, Link, StateLabel, Text, useIsomorphicLayoutEffect} from '..'
import TabNav from '../TabNav'
import classes from './PageLayout.features.stories.module.css'
import type {CustomWidthOptions} from './usePaneWidth'
import {defaultPaneWidth} from './usePaneWidth'

export default {
  title: 'Components/PageLayout/Features',
  component: PageLayout,
} as Meta<typeof PageLayout>

export const PullRequestPage = () => (
  <PageLayout>
    <PageLayout.Header>
      <div className={classes.HeaderStack}>
        <div>
          <Heading as="h1" className={classes.TitleHeading}>
            Input validation styles <Text className={classes.TitleSubdued}>#1831</Text>
          </Heading>
          <div className={classes.StatusRow}>
            <StateLabel status="pullOpened">Open</StateLabel>
            <Text className={classes.StatusMeta}>
              <Link href="#" muted className={classes.BoldMetaLink}>
                mperrotti
              </Link>{' '}
              wants to merge 3 commits into <BranchName href="#">main</BranchName> from{' '}
              <BranchName href="#">mp/validation-styles</BranchName>
            </Text>
          </div>
        </div>
        <TabNav>
          <TabNav.Link href="#" selected>
            Conversation
          </TabNav.Link>
          <TabNav.Link href="#">Commits</TabNav.Link>
          <TabNav.Link href="#">Checks</TabNav.Link>
          <TabNav.Link href="#">Files changed</TabNav.Link>
        </TabNav>
      </div>
    </PageLayout.Header>
    <PageLayout.Content>
      <div className={classes.ContentBox}></div>
      <div className={classes.ScrollBox} tabIndex={0}>
        This box has really long content. If it is too long, it will cause x overflow and should show a scrollbar. When
        this overflows, it should not break to overall page layout!
      </div>
    </PageLayout.Content>
    <PageLayout.Pane aria-label="Side pane">
      <div className={classes.PaneStack}>
        <div>
          <Text className={classes.PaneSectionHeading}>Assignees</Text>
          <Text className={classes.PaneMetaText}>
            No one –{' '}
            <Link href="#" muted>
              assign yourself
            </Link>
          </Text>
        </div>
        <div role="separator" className={classes.PaneSeparator}></div>
        <div>
          <Text className={classes.PaneSectionHeading}>Labels</Text>
          <Text className={classes.PaneMetaText}>None yet</Text>
        </div>
      </div>
    </PageLayout.Pane>
  </PageLayout>
)

export const StickyPane: StoryFn = args => (
  <PageLayout rowGap="none" columnGap="none" padding="none" containerWidth="full">
    <PageLayout.Header padding="normal" divider="line">
      <Placeholder label="Header" height={64} />
    </PageLayout.Header>
    <PageLayout.Content padding="normal" width="large">
      <div className={classes.ContentGrid}>
        {Array.from({length: args.numParagraphsInContent}).map((_, i) => {
          const testId = `content${i}`
          return (
            <p key={i} className={classes.Paragraph}>
              <span data-testid={testId}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam at enim id lorem tempus egestas a non
                ipsum. Maecenas imperdiet ante quam, at varius lorem molestie vel. Sed at eros consequat, varius tellus
                et, auctor felis. Donec pulvinar lacinia urna nec commodo. Phasellus at imperdiet risus. Donec sit amet
                massa purus. Nunc sem lectus, bibendum a sapien nec, tristique tempus felis. Ut porttitor auctor tellus
                in imperdiet. Ut blandit tincidunt augue, quis fringilla nunc tincidunt sed. Vestibulum auctor euismod
                nisi. Nullam tincidunt est in mi tincidunt dictum. Sed consectetur aliquet velit ut ornare.
              </span>
            </p>
          )
        })}
      </div>
    </PageLayout.Content>
    <PageLayout.Pane
      position="start"
      resizable
      padding="normal"
      divider="line"
      sticky={args.sticky}
      aria-label="Side pane"
    >
      <div className={classes.ContentGrid}>
        {Array.from({length: args.numParagraphsInPane}).map((_, i) => {
          const testId = `paragraph${i}`
          return (
            <p key={i} className={classes.Paragraph}>
              <span data-testid={testId}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam at enim id lorem tempus egestas a non
                ipsum. Maecenas imperdiet ante quam, at varius lorem molestie vel. Sed at eros consequat, varius tellus
                et, auctor felis. Donec pulvinar lacinia urna nec commodo. Phasellus at imperdiet risus. Donec sit amet
                massa purus.
              </span>
            </p>
          )
        })}
        <p>
          Donec sit amet massa purus.{' '}
          <Link inline href="#foo">
            Plura de lorem Ispum.
          </Link>
        </p>
      </div>
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
  <div className={classes.NestedScrollContainer}>
    <Placeholder label="Above scroll container" height={120} />
    <div className={classes.OverflowAuto}>
      <PageLayout rowGap="none" columnGap="none" padding="none" containerWidth="full">
        <PageLayout.Header padding="normal" divider="line">
          <Placeholder label="Header" height={64} />
        </PageLayout.Header>
        <PageLayout.Content padding="normal" width="large">
          <div className={classes.ContentGrid} tabIndex={0} role="region" aria-label="Page content">
            {Array.from({length: args.numParagraphsInContent}).map((_, i) => (
              <p key={i} className={classes.Paragraph}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam at enim id lorem tempus egestas a non
                ipsum. Maecenas imperdiet ante quam, at varius lorem molestie vel. Sed at eros consequat, varius tellus
                et, auctor felis. Donec pulvinar lacinia urna nec commodo. Phasellus at imperdiet risus. Donec sit amet
                massa purus. Nunc sem lectus, bibendum a sapien nec, tristique tempus felis. Ut porttitor auctor tellus
                in imperdiet. Ut blandit tincidunt augue, quis fringilla nunc tincidunt sed. Vestibulum auctor euismod
                nisi. Nullam tincidunt est in mi tincidunt dictum. Sed consectetur aliquet velit ut ornare.
              </p>
            ))}
          </div>
        </PageLayout.Content>
        <PageLayout.Pane position="start" padding="normal" divider="line" sticky aria-label="Side pane">
          <div className={classes.ContentGrid}>
            {Array.from({length: args.numParagraphsInPane}).map((_, i) => (
              <p key={i} className={classes.Paragraph}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam at enim id lorem tempus egestas a non
                ipsum. Maecenas imperdiet ante quam, at varius lorem molestie vel. Sed at eros consequat, varius tellus
                et, auctor felis. Donec pulvinar lacinia urna nec commodo. Phasellus at imperdiet risus. Donec sit amet
                massa purus.
              </p>
            ))}
          </div>
        </PageLayout.Pane>
        <PageLayout.Footer padding="normal" divider="line">
          <Placeholder label="Footer" height={64} />
        </PageLayout.Footer>
      </PageLayout>
    </div>
    <Placeholder label="Below scroll container" height={120} />
  </div>
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
  <div data-testid="story-window">
    <header data-testid="sticky-header" className={classes.StickyHeader} style={{height: args.offsetHeader}}>
      Custom sticky header
    </header>
    <PageLayout rowGap="none" columnGap="none" padding="none" containerWidth="full">
      <PageLayout.Content padding="normal" width="large">
        <div className={classes.ContentGrid} data-testid="scrollContainer">
          {Array.from({length: args.numParagraphsInContent}).map((_, i) => {
            const testId = `content${i}`
            return (
              <p key={i} className={classes.Paragraph}>
                <span data-testid={testId}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vitae orci et magna consectetur
                  ullamcorper eget ac purus. Nam at enim id lorem tempus egestas a non ipsum. Maecenas imperdiet ante
                  quam, at varius lorem molestie vel. Sed at eros consequat, varius tellus et, auctor felis. Donec
                  pulvinar lacinia urna nec commodo. Phasellus at imperdiet risus. Donec sit amet massa purus. Nunc sem
                  lectus, bibendum a sapien nec, tristique tempus felis. Ut porttitor auctor tellus in imperdiet. Ut
                  blandit tincidunt augue, quis fringilla nunc tincidunt sed. Vestibulum auctor euismod nisi. Nullam
                  tincidunt est in mi tincidunt dictum. Sed consectetur aliquet velit ut ornare.
                </span>
              </p>
            )
          })}
        </div>
      </PageLayout.Content>
      <PageLayout.Pane
        position="start"
        padding="normal"
        divider="line"
        aria-label="Aside pane"
        sticky
        offsetHeader={args.offsetHeader}
      >
        <div className={classes.ContentGrid}>
          {Array.from({length: args.numParagraphsInPane}).map((_, i) => {
            const testId = `paragraph${i}`
            return (
              <p key={i} className={classes.Paragraph}>
                <span data-testid={testId}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam at enim id lorem tempus egestas a non
                  ipsum. Maecenas imperdiet ante quam, at varius lorem molestie vel. Sed at eros consequat, varius
                  tellus et, auctor felis. Donec pulvinar lacinia urna nec commodo. Phasellus at imperdiet risus. Donec
                  sit amet massa purus.
                </span>
              </p>
            )
          })}
        </div>
      </PageLayout.Pane>
      <PageLayout.Footer padding="normal" divider="line">
        <Placeholder label="Footer" height={64} />
      </PageLayout.Footer>
    </PageLayout>
  </div>
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
    <PageLayout.Pane resizable position="start" aria-label="Side pane">
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
  <div className={classes.NestedScrollContainer}>
    <div className={classes.OverflowAuto}>
      <Placeholder label="Above inner scroll container" height={120} />
      <PageLayout rowGap="none" columnGap="none" padding="none" containerWidth="full">
        <PageLayout.Pane position="start" padding="normal" divider="line" sticky aria-label="Sticky pane">
          <div className={classes.OverflowAuto}>
            <PageLayout.Pane padding="normal" aria-label="Side pane">
              <Placeholder label="Inner scroll container" height={800} />
            </PageLayout.Pane>
          </div>
        </PageLayout.Pane>
        <PageLayout.Content padding="normal" width="large">
          <div className={classes.ContentGrid} tabIndex={0} role="region" aria-label="Page content">
            <Placeholder label="Page content" height={1600} />
          </div>
        </PageLayout.Content>
      </PageLayout>
      <Placeholder label="Beneath inner scroll container" height={120} />
    </div>
  </div>
)

export const CustomPaneWidths: StoryFn = () => (
  <PageLayout containerWidth="full">
    <PageLayout.Header>
      <Placeholder height={64} label="Header" />
    </PageLayout.Header>
    <PageLayout.Pane resizable width={{min: '200px', default: '300px', max: '400px'}} aria-label="Side pane">
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
    <PageLayout.Pane resizable position="start" aria-label="Side pane">
      <Heading as="h2" className={classes.PaneHeading} id="pane-heading">
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

export const ResizablePaneWithoutPersistence: StoryFn = () => (
  <PageLayout>
    <PageLayout.Header>
      <Placeholder height={64} label="Header" />
    </PageLayout.Header>
    <PageLayout.Pane resizable={{persist: false}} aria-label="Side pane">
      <Placeholder height={320} label="Pane (resizable, not persisted)" />
    </PageLayout.Pane>
    <PageLayout.Content>
      <Placeholder height={640} label="Content" />
    </PageLayout.Content>
    <PageLayout.Footer>
      <Placeholder height={64} label="Footer" />
    </PageLayout.Footer>
  </PageLayout>
)
ResizablePaneWithoutPersistence.storyName = 'Resizable pane without persistence'

export const ResizablePaneWithCustomPersistence: StoryFn = () => {
  const key = 'page-layout-features-stories-custom-persistence-pane-width'

  // Read initial width from localStorage (CSR only), falling back to medium preset
  const getInitialWidth = (): number => {
    if (typeof window !== 'undefined') {
      const storedWidth = localStorage.getItem(key)
      if (storedWidth !== null) {
        const parsed = parseFloat(storedWidth)
        if (!isNaN(parsed) && parsed > 0) {
          return parsed
        }
      }
    }
    return defaultPaneWidth.medium
  }

  const [currentWidth, setCurrentWidth] = React.useState<number>(getInitialWidth)
  useIsomorphicLayoutEffect(() => {
    setCurrentWidth(getInitialWidth())
  }, [])
  return (
    <PageLayout>
      <PageLayout.Header>
        <Placeholder height={64} label="Header" />
      </PageLayout.Header>
      <PageLayout.Pane
        width={{min: '256px', default: `${defaultPaneWidth.medium}px`, max: '600px'}}
        resizable={{
          width: currentWidth,
          persist: width => {
            setCurrentWidth(width)
            localStorage.setItem(key, width.toString())
          },
        }}
        aria-label="Side pane"
      >
        <Placeholder height={320} label={`Pane (width: ${currentWidth}px)`} />
      </PageLayout.Pane>
      <PageLayout.Content>
        <Placeholder height={640} label="Content" />
      </PageLayout.Content>
      <PageLayout.Footer>
        <Placeholder height={64} label="Footer" />
      </PageLayout.Footer>
    </PageLayout>
  )
}
ResizablePaneWithCustomPersistence.storyName = 'Resizable pane with custom persistence'

export const ResizablePaneWithNumberWidth: StoryFn = () => {
  const key = 'page-layout-features-stories-number-width'

  // Read initial width from localStorage (CSR only), falling back to medium preset
  const getInitialWidth = (): number => {
    if (typeof window !== 'undefined') {
      const storedWidth = localStorage.getItem(key)
      if (storedWidth !== null) {
        const parsed = parseInt(storedWidth, 10)
        if (!isNaN(parsed) && parsed > 0) {
          return parsed
        }
      }
    }
    return defaultPaneWidth.medium
  }

  const [currentWidth, setCurrentWidth] = React.useState<number>(getInitialWidth)

  return (
    <PageLayout>
      <PageLayout.Header>
        <Placeholder height={64} label="Header" />
      </PageLayout.Header>
      <PageLayout.Pane
        width="medium"
        resizable={{
          width: currentWidth,
          persist: newWidth => {
            setCurrentWidth(newWidth)
            localStorage.setItem(key, newWidth.toString())
          },
        }}
        aria-label="Side pane"
      >
        <Placeholder height={320} label={`Pane (width: ${currentWidth}px)`} />
      </PageLayout.Pane>
      <PageLayout.Content>
        <Placeholder height={640} label="Content" />
      </PageLayout.Content>
      <PageLayout.Footer>
        <Placeholder height={64} label="Footer" />
      </PageLayout.Footer>
    </PageLayout>
  )
}
ResizablePaneWithNumberWidth.storyName = 'Resizable pane with number width'

export const ResizablePaneWithControlledWidth: StoryFn = () => {
  const key = 'page-layout-features-stories-controlled-width'

  // Read initial width from localStorage (CSR only), falling back to medium preset
  const getInitialWidth = (): number => {
    if (typeof window !== 'undefined') {
      const storedWidth = localStorage.getItem(key)
      if (storedWidth !== null) {
        const parsed = parseInt(storedWidth, 10)
        if (!isNaN(parsed) && parsed > 0) {
          return parsed
        }
      }
    }
    return defaultPaneWidth.medium
  }

  const [currentWidth, setCurrentWidth] = React.useState<number>(getInitialWidth)

  return (
    <PageLayout>
      <PageLayout.Header>
        <Placeholder height={64} label="Header" />
      </PageLayout.Header>
      <PageLayout.Pane
        width={{min: '256px', default: '296px', max: '600px'}}
        resizable={{
          width: currentWidth,
          persist: newWidth => {
            setCurrentWidth(newWidth)
            localStorage.setItem(key, newWidth.toString())
          },
        }}
        aria-label="Side pane"
      >
        <Placeholder height={320} label={`Pane (current: ${currentWidth}px)`} />
      </PageLayout.Pane>
      <PageLayout.Content>
        <Placeholder height={640} label="Content" />
      </PageLayout.Content>
      <PageLayout.Footer>
        <Placeholder height={64} label="Footer" />
      </PageLayout.Footer>
    </PageLayout>
  )
}
ResizablePaneWithControlledWidth.storyName = 'Resizable pane with controlled width (new API)'
