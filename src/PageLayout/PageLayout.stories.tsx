import {Meta, Story} from '@storybook/react'
import React from 'react'
import {Box, BranchName, Button, Heading, Link, StateLabel, TabNav, Text} from '..'
import {NavList} from '../NavList'
import {Placeholder} from '../Placeholder'
import {PageLayout} from './PageLayout'

const meta: Meta = {
  title: 'Layout/PageLayout',
  component: PageLayout,
  parameters: {
    layout: 'fullscreen',
    controls: {expanded: true}
  }
}

export const Playground: Story = args => (
  <PageLayout
    containerWidth={args.containerWidth}
    padding={args.padding}
    rowGap={args.rowGap}
    columnGap={args.columnGap}
    sx={args.sx}
  >
    {args['Show header?'] ? (
      <PageLayout.Header divider={args['Header.divider']} dividerWhenNarrow={args['Header.dividerWhenNarrow']}>
        <Placeholder height={64} label="Header" />
      </PageLayout.Header>
    ) : null}
    <PageLayout.Content width={args['Content.width']}>
      <Placeholder height={400} label="Content" />
    </PageLayout.Content>
    {args['Show pane?'] ? (
      <PageLayout.Pane
        position={args['Pane.position']}
        positionWhenNarrow={args['Pane.positionWhenNarrow']}
        width={args['Pane.width']}
        divider={args['Pane.divider']}
        dividerWhenNarrow={args['Pane.dividerWhenNarrow']}
      >
        <Placeholder height={200} label="Pane" />
      </PageLayout.Pane>
    ) : null}
    {args['Show footer?'] ? (
      <PageLayout.Footer divider={args['Footer.divider']} dividerWhenNarrow={args['Footer.dividerWhenNarrow']}>
        <Placeholder height={64} label="Footer" />
      </PageLayout.Footer>
    ) : null}
  </PageLayout>
)

Playground.argTypes = {
  'Show header?': {
    type: 'boolean',
    defaultValue: true,
    table: {
      category: 'Header'
    }
  },
  'Header.divider': {
    type: {
      name: 'enum',
      value: ['none', 'line']
    },
    defaultValue: 'none',
    control: {
      type: 'radio'
    },
    table: {
      category: 'Header',
      defaultValue: {
        summary: '"none"'
      }
    }
  },
  'Header.dividerWhenNarrow': {
    type: {
      name: 'enum',
      value: ['inherit', 'none', 'line', 'filled']
    },
    defaultValue: 'inherit',
    control: {
      type: 'radio'
    },
    table: {
      category: 'Header',
      defaultValue: {
        summary: '"inherit"'
      }
    }
  },
  'Content.width': {
    type: {
      name: 'enum',
      value: ['full', 'medium', 'large', 'xlarge']
    },
    defaultValue: 'full',
    control: {
      type: 'radio'
    },
    table: {
      category: 'Content',
      defaultValue: {
        summary: '"full"'
      }
    }
  },
  'Show pane?': {
    type: 'boolean',
    defaultValue: true,
    table: {
      category: 'Pane'
    }
  },
  'Pane.position': {
    type: {
      name: 'enum',
      value: ['start', 'end']
    },
    defaultValue: 'end',
    control: {
      type: 'radio'
    },
    table: {
      category: 'Pane',
      defaultValue: {
        summary: '"end"'
      }
    }
  },
  'Pane.positionWhenNarrow': {
    type: {
      name: 'enum',
      value: ['inherit', 'start', 'end']
    },
    defaultValue: 'inherit',
    control: {
      type: 'radio'
    },
    table: {
      category: 'Pane',
      defaultValue: {
        summary: '"inherit"'
      }
    }
  },
  'Pane.width': {
    type: {
      name: 'enum',
      value: ['small', 'medium', 'large']
    },
    defaultValue: 'medium',
    control: {
      type: 'radio'
    },
    table: {
      category: 'Pane',
      defaultValue: {
        summary: '"medium"'
      }
    }
  },
  'Pane.divider': {
    type: {
      name: 'enum',
      value: ['none', 'line']
    },
    defaultValue: 'none',
    control: {
      type: 'radio'
    },
    table: {
      category: 'Pane',
      defaultValue: {
        summary: '"none"'
      }
    }
  },
  'Pane.dividerWhenNarrow': {
    type: {
      name: 'enum',
      value: ['inherit', 'none', 'line', 'filled']
    },
    defaultValue: 'inherit',
    control: {
      type: 'radio'
    },
    table: {
      category: 'Pane',
      defaultValue: {
        summary: '"inherit"'
      }
    }
  },
  'Show footer?': {
    type: 'boolean',
    defaultValue: true,
    table: {
      category: 'Footer'
    }
  },
  'Footer.divider': {
    type: {
      name: 'enum',
      value: ['none', 'line']
    },
    defaultValue: 'none',
    control: {
      type: 'radio'
    },
    table: {
      category: 'Footer',
      defaultValue: {
        summary: '"none"'
      }
    }
  },
  'Footer.dividerWhenNarrow': {
    type: {
      name: 'enum',
      value: ['inherit', 'none', 'line', 'filled']
    },
    defaultValue: 'inherit',
    control: {
      type: 'radio'
    },
    table: {
      category: 'Footer',
      defaultValue: {
        summary: '"inherit"'
      }
    }
  }
}

Playground.args = {
  containerWidth: 'xlarge',
  padding: 'normal',
  rowGap: 'normal',
  columnGap: 'normal'
}

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

export const SettingsPage = () => (
  <PageLayout>
    <PageLayout.Pane position="start">
      <NavList aria-label="main">
        <NavList.Item href="#">Profile</NavList.Item>
        <NavList.Item href="#" aria-current="page">
          Account
        </NavList.Item>
        <NavList.Item href="#">Emails</NavList.Item>
        <NavList.Item href="#">Notifications</NavList.Item>
      </NavList>
    </PageLayout.Pane>
    <PageLayout.Content>
      <Heading as="h2" sx={{fontSize: 4, fontWeight: 'normal', color: 'danger.fg', mb: 2}}>
        Danger zone
      </Heading>
      <Box
        sx={{
          border: '1px solid',
          borderColor: 'danger.emphasis',
          borderRadius: 2,
          p: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 3
        }}
      >
        <Box sx={{display: 'grid', gap: 1}}>
          <Text sx={{fontSize: 1, fontWeight: 'bold', color: 'danger.fg'}}>Delete account</Text>
          <Text sx={{fontSize: 1, color: 'fg.muted'}}>
            Are you sure you don&apos;t want to just downgrade your account to a free account? We won&apos;t charge your
            credit card anymore.
          </Text>
        </Box>
        <Button variant="danger">Delete account</Button>
      </Box>
    </PageLayout.Content>
  </PageLayout>
)

// TODO: discussions page example

export default meta
