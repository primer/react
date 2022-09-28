import React from 'react'
import {Meta, Story} from '@storybook/react'
import {Box, BranchName, Heading, Link, StateLabel, TabNav, Text} from '..'
import {Placeholder} from '../Placeholder'
import {PageLayout} from './PageLayout'

const meta: Meta = {
  title: 'Layout/PageLayout',
  parameters: {
    layout: 'fullscreen',
    controls: {expanded: true}
  },
  argTypes: {
    // Debug controls
    'Render header?': {
      type: 'boolean',
      defaultValue: true,
      table: {category: 'Debug'}
    },
    'Render pane?': {
      type: 'boolean',
      defaultValue: true,
      table: {category: 'Debug'}
    },
    'Render footer?': {
      type: 'boolean',
      defaultValue: true,
      table: {category: 'Debug'}
    },
    'Header placeholder height': {
      type: 'number',
      defaultValue: 64,
      table: {category: 'Debug'}
    },
    'Pane placeholder height': {
      type: 'number',
      defaultValue: 200,
      table: {category: 'Debug'}
    },
    'Content placeholder height': {
      type: 'number',
      defaultValue: 400,
      table: {category: 'Debug'}
    },
    'Footer placeholder height': {
      type: 'number',
      defaultValue: 64,
      table: {category: 'Debug'}
    },

    // PageLayout prop controls
    containerWidth: {
      type: {
        name: 'enum',
        value: ['full', 'medium', 'large', 'xlarge']
      },
      defaultValue: 'xlarge',
      control: {type: 'radio'},
      table: {category: 'PageLayout props'}
    },
    padding: {
      type: {
        name: 'enum',
        value: ['none', 'condensed', 'normal']
      },
      defaultValue: 'normal',
      control: {type: 'radio'},
      table: {category: 'PageLayout props'}
    },
    rowGap: {
      type: {
        name: 'enum',
        value: ['none', 'condensed', 'normal']
      },
      defaultValue: 'normal',
      control: {type: 'radio'},
      table: {category: 'PageLayout props'}
    },
    columnGap: {
      type: {
        name: 'enum',
        value: ['none', 'condensed', 'normal']
      },
      defaultValue: 'normal',
      control: {type: 'radio'},
      table: {category: 'PageLayout props'}
    },

    // Header prop controls
    'Header.divider.regular': {
      type: {
        name: 'enum',
        value: ['none', 'line']
      },
      defaultValue: 'none',
      control: {
        type: 'radio'
      },
      table: {
        category: 'Header props'
      }
    },
    'Header.divider.narrow': {
      type: {
        name: 'enum',
        value: ['none', 'line', 'filled']
      },
      defaultValue: 'none',
      control: {
        type: 'radio'
      },
      table: {
        category: 'Header props'
      }
    },
    'Header.divider.wide': {
      type: {
        name: 'enum',
        value: ['none', 'line']
      },
      defaultValue: 'none',
      control: {
        type: 'radio'
      },
      table: {
        category: 'Header props'
      }
    },
    'Header.padding': {
      type: {
        name: 'enum',
        value: ['none', 'condensed', 'normal']
      },
      defaultValue: 'none',
      control: {type: 'radio'},
      table: {category: 'Header props'}
    },
    'Header.hidden.regular': {
      type: 'boolean',
      defaultValue: false,
      table: {category: 'Header props'}
    },
    'Header.hidden.narrow': {
      type: 'boolean',
      defaultValue: false,
      table: {category: 'Header props'}
    },
    'Header.hidden.wide': {
      type: 'boolean',
      defaultValue: false,
      table: {category: 'Header props'}
    },

    // Content prop controls
    'Content.width': {
      type: {
        name: 'enum',
        value: ['full', 'medium', 'large', 'xlarge']
      },
      defaultValue: 'full',
      control: {type: 'radio'},
      table: {category: 'Content props'}
    },
    'Content.padding': {
      type: {
        name: 'enum',
        value: ['none', 'condensed', 'normal']
      },
      defaultValue: 'none',
      control: {type: 'radio'},
      table: {category: 'Content props'}
    },
    'Content.hidden.regular': {
      type: 'boolean',
      defaultValue: false,
      table: {category: 'Content props'}
    },
    'Content.hidden.narrow': {
      type: 'boolean',
      defaultValue: false,
      table: {category: 'Content props'}
    },
    'Content.hidden.wide': {
      type: 'boolean',
      defaultValue: false,
      table: {category: 'Content props'}
    },

    // Pane prop controls
    'Pane.position.regular': {
      type: {
        name: 'enum',
        value: ['start', 'end']
      },
      defaultValue: 'end',
      control: {type: 'radio'},
      table: {category: 'Pane props'}
    },
    'Pane.position.narrow': {
      type: {
        name: 'enum',
        value: ['start', 'end']
      },
      defaultValue: 'end',
      control: {type: 'radio'},
      table: {category: 'Pane props'}
    },
    'Pane.position.wide': {
      type: {
        name: 'enum',
        value: ['start', 'end']
      },
      defaultValue: 'end',
      control: {type: 'radio'},
      table: {category: 'Pane props'}
    },
    'Pane.width': {
      type: {
        name: 'enum',
        value: ['small', 'medium', 'large']
      },
      defaultValue: 'medium',
      control: {type: 'radio'},
      table: {category: 'Pane props'}
    },
    'Pane.sticky': {
      type: 'boolean',
      defaultValue: false,
      table: {category: 'Pane props'}
    },
    'Pane.padding': {
      type: {
        name: 'enum',
        value: ['none', 'condensed', 'normal']
      },
      defaultValue: 'none',
      control: {type: 'radio'},
      table: {category: 'Pane props'}
    },
    'Pane.divider.regular': {
      type: {
        name: 'enum',
        value: ['none', 'line']
      },
      defaultValue: 'none',
      control: {type: 'radio'},
      table: {category: 'Pane props'}
    },
    'Pane.divider.narrow': {
      type: {
        name: 'enum',
        value: ['none', 'line', 'filled']
      },
      defaultValue: 'none',
      control: {type: 'radio'},
      table: {category: 'Pane props'}
    },
    'Pane.divider.wide': {
      type: {
        name: 'enum',
        value: ['none', 'line']
      },
      defaultValue: 'none',
      control: {type: 'radio'},
      table: {category: 'Pane props'}
    },

    // Footer prop controls
    'Footer.divider.regular': {
      type: {
        name: 'enum',
        value: ['none', 'line']
      },
      defaultValue: 'none',
      control: {
        type: 'radio'
      },
      table: {
        category: 'Footer props'
      }
    },
    'Footer.divider.narrow': {
      type: {
        name: 'enum',
        value: ['none', 'line', 'filled']
      },
      defaultValue: 'none',
      control: {
        type: 'radio'
      },
      table: {
        category: 'Footer props'
      }
    },
    'Footer.divider.wide': {
      type: {
        name: 'enum',
        value: ['none', 'line']
      },
      defaultValue: 'none',
      control: {
        type: 'radio'
      },
      table: {
        category: 'Footer props'
      }
    },
    'Footer.padding': {
      type: {
        name: 'enum',
        value: ['none', 'condensed', 'normal']
      },
      defaultValue: 'none',
      control: {type: 'radio'},
      table: {category: 'Footer props'}
    },
    'Footer.hidden.regular': {
      type: 'boolean',
      defaultValue: false,
      table: {category: 'Footer props'}
    },
    'Footer.hidden.narrow': {
      type: 'boolean',
      defaultValue: false,
      table: {category: 'Footer props'}
    },
    'Footer.hidden.wide': {
      type: 'boolean',
      defaultValue: false,
      table: {category: 'Footer props'}
    }
  }
}

const Template: Story = args => (
  <PageLayout
    containerWidth={args.containerWidth}
    padding={args.padding}
    rowGap={args.rowGap}
    columnGap={args.columnGap}
    sx={args.sx}
  >
    {args['Render header?'] ? (
      <PageLayout.Header
        padding={args['Header.padding']}
        divider={{
          narrow: args['Header.divider.narrow'],
          regular: args['Header.divider.regular'],
          wide: args['Header.divider.wide']
        }}
        hidden={{
          narrow: args['Header.hidden.narrow'],
          regular: args['Header.hidden.regular'],
          wide: args['Header.hidden.wide']
        }}
      >
        <Placeholder height={args['Header placeholder height']} label="Header" />
      </PageLayout.Header>
    ) : null}
    <PageLayout.Content
      width={args['Content.width']}
      padding={args['Content.padding']}
      hidden={{
        narrow: args['Content.hidden.narrow'],
        regular: args['Content.hidden.regular'],
        wide: args['Content.hidden.wide']
      }}
    >
      <Placeholder height={args['Content placeholder height']} label="Content" />
    </PageLayout.Content>
    {args['Render pane?'] ? (
      <PageLayout.Pane
        position={{
          narrow: args['Pane.position.narrow'],
          regular: args['Pane.position.regular'],
          wide: args['Pane.position.wide']
        }}
        width={args['Pane.width']}
        sticky={args['Pane.sticky']}
        padding={args['Pane.padding']}
        divider={{
          narrow: args['Pane.divider.narrow'],
          regular: args['Pane.divider.regular'],
          wide: args['Pane.divider.wide']
        }}
        hidden={{
          narrow: args['Pane.hidden.narrow'],
          regular: args['Pane.hidden.regular'],
          wide: args['Pane.hidden.wide']
        }}
      >
        <Placeholder height={args['Pane placeholder height']} label="Pane" />
      </PageLayout.Pane>
    ) : null}
    {args['Render footer?'] ? (
      <PageLayout.Footer
        padding={args['Footer.padding']}
        divider={{
          narrow: args['Footer.divider.narrow'],
          regular: args['Footer.divider.regular'],
          wide: args['Footer.divider.wide']
        }}
        hidden={{
          narrow: args['Footer.hidden.narrow'],
          regular: args['Footer.hidden.regular'],
          wide: args['Footer.hidden.wide']
        }}
      >
        <Placeholder height={args['Footer placeholder height']} label="Footer" />
      </PageLayout.Footer>
    ) : null}
  </PageLayout>
)

export const Default = Template.bind({})

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
          borderRadius: 2
        }}
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

export const StickyPane: Story = args => (
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
    <PageLayout.Pane position="start" padding="normal" divider="line" sticky={args.sticky}>
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
      </Box>
    </PageLayout.Pane>
    <PageLayout.Footer padding="normal" divider="line">
      <Placeholder label="Footer" height={64} />
    </PageLayout.Footer>
  </PageLayout>
)

StickyPane.argTypes = {
  sticky: {
    type: 'boolean',
    defaultValue: true
  },
  numParagraphsInPane: {
    type: 'number',
    defaultValue: 10
  },
  numParagraphsInContent: {
    type: 'number',
    defaultValue: 30
  }
}

export const NestedScrollContainer: Story = args => (
  <Box sx={{display: 'grid', gridTemplateRows: 'auto 1fr auto', height: '100vh'}}>
    <Placeholder label="Above scroll container" height={120} />
    <Box sx={{overflow: 'auto'}}>
      <PageLayout rowGap="none" columnGap="none" padding="none" containerWidth="full">
        <PageLayout.Header padding="normal" divider="line">
          <Placeholder label="Header" height={64} />
        </PageLayout.Header>
        <PageLayout.Content padding="normal" width="large">
          <Box sx={{display: 'grid', gap: 3}}>
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
        <PageLayout.Pane position="start" padding="normal" divider="line" sticky>
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

NestedScrollContainer.argTypes = {
  numParagraphsInPane: {
    type: 'number',
    defaultValue: 10
  },
  numParagraphsInContent: {
    type: 'number',
    defaultValue: 30
  }
}

export const CustomStickyHeader: Story = args => (
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
        borderColor: 'border.default'
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
      <PageLayout.Pane position="start" padding="normal" divider="line" sticky offsetHeader={args.offsetHeader}>
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

CustomStickyHeader.argTypes = {
  sticky: {
    type: 'boolean',
    defaultValue: true
  },
  offsetHeader: {
    type: 'string',
    defaultValue: '8rem'
  },
  numParagraphsInPane: {
    type: 'number',
    defaultValue: 10
  },
  numParagraphsInContent: {
    type: 'number',
    defaultValue: 30
  }
}

export default meta
