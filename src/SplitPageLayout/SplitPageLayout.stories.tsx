import React from 'react'
import {Meta, Story} from '@storybook/react'
import {Box, Button, Heading, Text} from '..'
import {NavList} from '../NavList'
import {Placeholder} from '../Placeholder'
import {SplitPageLayout} from '../SplitPageLayout'

const meta: Meta = {
  title: 'Layout/SplitPageLayout',
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

    // Header prop controls
    'Header.divider.regular': {
      type: {
        name: 'enum',
        value: ['none', 'line']
      },
      defaultValue: 'line',
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
      defaultValue: 'line',
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
      defaultValue: 'line',
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
      defaultValue: 'normal',
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
      defaultValue: 'xlarge',
      control: {type: 'radio'},
      table: {category: 'Content props'}
    },
    'Content.padding': {
      type: {
        name: 'enum',
        value: ['none', 'condensed', 'normal']
      },
      defaultValue: 'normal',
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
      defaultValue: 'start',
      control: {type: 'radio'},
      table: {category: 'Pane props'}
    },
    'Pane.position.narrow': {
      type: {
        name: 'enum',
        value: ['start', 'end']
      },
      defaultValue: 'start',
      control: {type: 'radio'},
      table: {category: 'Pane props'}
    },
    'Pane.position.wide': {
      type: {
        name: 'enum',
        value: ['start', 'end']
      },
      defaultValue: 'start',
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
      defaultValue: true,
      table: {category: 'Pane props'}
    },
    'Pane.padding': {
      type: {
        name: 'enum',
        value: ['none', 'condensed', 'normal']
      },
      defaultValue: 'normal',
      control: {type: 'radio'},
      table: {category: 'Pane props'}
    },
    'Pane.divider.regular': {
      type: {
        name: 'enum',
        value: ['none', 'line']
      },
      defaultValue: 'line',
      control: {type: 'radio'},
      table: {category: 'Pane props'}
    },
    'Pane.divider.narrow': {
      type: {
        name: 'enum',
        value: ['none', 'line', 'filled']
      },
      defaultValue: 'line',
      control: {type: 'radio'},
      table: {category: 'Pane props'}
    },
    'Pane.divider.wide': {
      type: {
        name: 'enum',
        value: ['none', 'line']
      },
      defaultValue: 'line',
      control: {type: 'radio'},
      table: {category: 'Pane props'}
    },

    // Footer prop controls
    'Footer.divider.regular': {
      type: {
        name: 'enum',
        value: ['none', 'line']
      },
      defaultValue: 'line',
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
      defaultValue: 'line',
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
      defaultValue: 'line',
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
      defaultValue: 'normal',
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
  <SplitPageLayout sx={args.sx}>
    {args['Render header?'] ? (
      <SplitPageLayout.Header
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
      </SplitPageLayout.Header>
    ) : null}
    <SplitPageLayout.Content
      width={args['Content.width']}
      padding={args['Content.padding']}
      hidden={{
        narrow: args['Content.hidden.narrow'],
        regular: args['Content.hidden.regular'],
        wide: args['Content.hidden.wide']
      }}
    >
      <Placeholder height={args['Content placeholder height']} label="Content" />
    </SplitPageLayout.Content>
    {args['Render pane?'] ? (
      <SplitPageLayout.Pane
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
      </SplitPageLayout.Pane>
    ) : null}
    {args['Render footer?'] ? (
      <SplitPageLayout.Footer
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
      </SplitPageLayout.Footer>
    ) : null}
  </SplitPageLayout>
)

export const Default = Template.bind({})

export const SettingsPage = () => (
  <SplitPageLayout>
    <SplitPageLayout.Pane position="start">
      <NavList aria-label="main">
        <NavList.Item href="#">Profile</NavList.Item>
        <NavList.Item href="#" aria-current="page">
          Account
        </NavList.Item>
        <NavList.Item href="#">Emails</NavList.Item>
        <NavList.Item href="#">Notifications</NavList.Item>
      </NavList>
    </SplitPageLayout.Pane>
    <SplitPageLayout.Content>
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
    </SplitPageLayout.Content>
  </SplitPageLayout>
)

export const Test: Story = () => {
  const [numParagraphs, setNumParagraphs] = React.useState(20)
  return (
    <>
      <Box sx={{height: '200px', border: '1px dashed black'}}>Header</Box>
      <SplitPageLayout>
        <SplitPageLayout.Pane>
          <Box sx={{display: 'grid', gap: 3}}>
            {Array.from({length: 10}).map((_, i) => (
              <Box key={i} as="p" sx={{margin: 0}}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam at enim id lorem tempus egestas a non
                ipsum. Maecenas imperdiet ante quam, at varius lorem molestie vel. Sed at eros consequat, varius tellus
                et, auctor felis. Donec pulvinar lacinia urna nec commodo. Phasellus at imperdiet risus. Donec sit amet
                massa purus. Nunc sem lectus, bibendum a sapien nec, tristique tempus felis. Ut porttitor auctor tellus
                in imperdiet. Ut blandit tincidunt augue, quis fringilla nunc tincidunt sed. Vestibulum auctor euismod
                nisi. Nullam tincidunt est in mi tincidunt dictum. Sed consectetur aliquet velit ut ornare.
              </Box>
            ))}
            <div>
              <button
                type="button"
                onClick={() => {
                  if (numParagraphs === 3) {
                    setNumParagraphs(20)
                  } else {
                    setNumParagraphs(3)
                  }
                }}
              >
                Toggle
              </button>
            </div>
            {Array.from({length: 10}).map((_, i) => (
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
        </SplitPageLayout.Pane>
        <SplitPageLayout.Content sx={{minHeight: '100vh'}}>
          <Box sx={{display: 'grid', gap: 3}}>
            {Array.from({length: numParagraphs}).map((_, i) => (
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
        </SplitPageLayout.Content>
      </SplitPageLayout>
      <Box sx={{height: '200px', border: '1px dashed black'}}>Footer</Box>
    </>
  )
}

export const Test2: Story = () => {
  const [numParagraphs, setNumParagraphs] = React.useState(10)
  return (
    <>
      <Box sx={{height: '200px', border: '1px dashed black'}}>Header</Box>
      <SplitPageLayout>
        <SplitPageLayout.Pane>
          <Box sx={{display: 'grid', gap: 3}}>
            {Array.from({length: 40}).map((_, i) => (
              <Box key={i} as="button" sx={{margin: 0}}>
                Item {i}
              </Box>
            ))}
          </Box>
        </SplitPageLayout.Pane>
        <SplitPageLayout.Content sx={{minHeight: '100vh'}}>
          <Box sx={{display: 'grid', gap: 3}}>
            {Array.from({length: numParagraphs}).map((_, i) => (
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
        </SplitPageLayout.Content>
      </SplitPageLayout>
      <Box sx={{height: '2000px', border: '1px dashed black'}}>Footer</Box>
    </>
  )
}

export default meta
