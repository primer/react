import React from 'react'
import {
  Library,
  Example,
  Detail
} from '@compositor/kit'
import {
  Page,
  Box,
  Button,
  ButtonDanger,
  ButtonPrimary,
  ButtonOutline,
  ButtonLink,
  CounterLabel,
  Heading,
  Label,
  Link,
  Text,
  Flash,
  StateLabel,
  Tooltip,
  theme
} from '../src'
import Octicon from '@github/octicons-react'

const Swatch = ({name, index, color, ...rest}) => (
  <div {...rest}>
    <div className='m-1 mt-3 p-6' style={{background: theme.colors[name][index]}} />
    <Heading.h3 fontSize={2} px={1}>
      {name}.{index}
    </Heading.h3>
    <Text px={1}>
      {color}
    </Text>
  </div>
)

const Index = props => (
  <Page>
    <Library title='Primer-react'>
      <Example name='Heading'>
        <Heading mb={2}>Heading</Heading>
        <Detail>
          {[0, 1, 2, 3, 4, 5, /* 6, 7, */ '00-light', '0-light', '1-light', '2-light', '3-light'].map((fontSize, i) => (
            <Heading key={i} fontSize={fontSize} mb={2}>With fontSize={fontSize}</Heading>
          ))}
        </Detail>
      </Example>
      <Example name='Label'>
        <Box mb={3}>
          <Label>Default label</Label>
          <Label scheme='gray-darker'>Darker gray label</Label>
          <Label scheme='orange'>Orange label</Label>
          <Label scheme='green'>Green label</Label>
        </Box>
        <Box mb={3}>
          <Label outline>Default outline label</Label>
          <Label outline scheme='green'>Green outline label</Label>
        </Box>
      </Example>
      <Example name='Link'>
        <Link href='https://github.com'>
          Link
        </Link>
      </Example>
      <Example name='Box'>
        <Box p={3} bg='gray.1'> Box </Box>
      </Example>
      <Example name='Button'>
        <Button> Button </Button>
      </Example>
      <Example name='Button - small'>
        <Button size='small'> Button </Button>
      </Example>
      <Example name='Button - large'>
        <Button size='large'> Button </Button>
      </Example>
      <Example name='ButtonDanger'>
        <ButtonDanger> Button </ButtonDanger>
      </Example>
      <Example name='ButtonPrimary'>
        <ButtonPrimary> Button </ButtonPrimary>
      </Example>
      <Example name='ButtonOutline'>
        <ButtonOutline> Button </ButtonOutline>
      </Example>
      <Example name='Button - full width'>
        <Button block> Button </Button>
      </Example>
      <Example name='Button - styled as link'>
        <Button linkStyle> Button </Button>
      </Example>
      <Example name='ButtonLink'>
        <ButtonLink href='https://www.goatslive.com/'>This is an {'<a>'} styled as a button</ButtonLink>
      </Example>
      <Example name='CounterLabel'>
        <CounterLabel>
          12
        </CounterLabel>
        <CounterLabel theme={'gray'}>
          13
        </CounterLabel>
        <CounterLabel theme={'gray-light'}>
          13
        </CounterLabel>
      </Example>
      <Example name='Flash themes'>
        <Box mb={3}>
          <Flash>
            Flash
          </Flash>
        </Box>
        <Box mb={3}>
          <Flash yellow>
            Flash yellow
          </Flash>
          </Box>
        <Box mb={3}>
          <Flash red>
            Flash red
          </Flash>
          </Box>
        <Box mb={3}>
          <Flash green>
            Flash green
          </Flash>
        </Box>
      </Example>
      <Example name='Flash full'>
        <Flash full>
          Flash full
        </Flash>
      </Example>
      <Example name='Font Sizes'>
        {[/* 7, 6, */ 5, 4, 3, 2, 1, 0].map((fontSize, i) => (
          <Text tag='div' key={i} fontSize={fontSize}>fontSize {fontSize}</Text>
        ))}
      </Example>
      <Example name='Text'>
        <Text tag='div'>Text</Text>
        <Text tag='div' fontWeight='bold'>Text bold</Text>
        <Text tag='div' color='green'>Text green</Text>
        <Text tag='div' lineHeight='condensed'>Text lineHeight "condensed"</Text>
        <Text tag='div' fontSize={4}>Text fontSize 4</Text>
        <Text tag='div' p={4}>Text padding 4</Text>
      </Example>
      <Example name='Colors'>
        <div className='d-flex'>
          <Box bg='blue' p={4} m={1} />
          <Box bg='green' p={4} m={1} />
          <Box bg='purple' p={4} m={1} />
          <Box bg='yellow' p={4} m={1} />
          <Box bg='red' p={4} m={1} />
          <Box bg='white' p={4} m={1} border />
          <Box bg='gray' p={4} m={1} />
          <Box bg='gray-light' p={4} m={1} />
          <Box bg='blue-light' p={4} m={1} />
          <Box bg='purple-light' p={4} m={1} />
          <Box bg='red-light' p={4} m={1} />
        </div>
        <Detail>
          {['gray', 'blue', 'green', 'purple', 'yellow', 'orange'].map((hue, i) => (
            <div className='d-flex' key={i}>
              {theme.colors[hue].map((color, j) => (
                <Swatch name={hue} index={j} key={j} color={color}/>
              ))}
            </div>
          ))}
        </Detail>
      </Example>
      <Example name='Tooltip'>
        <Box border p={3}>
          <Tooltip text='Hello, Tooltip!'>Text with a tooltip</Tooltip>
        </Box>
        <Detail>
          <Heading.h3>Directions</Heading.h3>
          {['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'].map((d, i) => (
            <Box border p={3}>
              <Tooltip text='Hello, Tooltip!' direction={d}>Tooltip direction={d}</Tooltip>
            </Box>
          ))}
          <Heading.h3>Alignment</Heading.h3>
          <Box border p={3}>
            <Tooltip text='Hello, Tooltip!' direction='ne' align='left'>Tooltip align left</Tooltip>
          </Box>
          <Heading.h3>Word wrap</Heading.h3>
          <Box border p={3}>
            <Tooltip text='Hello, Tooltip! This tooltip has a sentence that will wrap to a newline.' wrap  direction='ne' align='left'>Word wrapping tooltip</Tooltip>
          </Box>
          <Heading.h3>No Delay</Heading.h3>
          <Box border p={3}>
            <Tooltip noDelay text='Hello, Tooltip!'>Text with a tooltip</Tooltip>
          </Box>
        </Detail>
      </Example>
      <Example name='StateLabel'>
        <Box mb={2}>
          <StateLabel state='open'>Open</StateLabel>
        </Box>
        <Box mb={2}>
          <StateLabel state='closed'>Closed</StateLabel>
        </Box>
        <Box mb={4}>
          <StateLabel state='merged'>Merged</StateLabel>
        </Box>
        <Detail>
          <Box mb={4}>
            <Heading.h2 mb={1}>By state (Octicons built in)</Heading.h2>
            <Box mb={2}>
              <StateLabel>Unknown</StateLabel>
            </Box>
            <Box mb={2}>
              <StateLabel state='open'>Open</StateLabel>
            </Box>
            <Box mb={2}>
              <StateLabel state='closed'>Closed</StateLabel>
            </Box>
            <Box mb={2}>
              <StateLabel state='merged'>Merged</StateLabel>
            </Box>
            <Box mb={2}>
              <StateLabel state='reopened'>Reopened</StateLabel>
            </Box>
          </Box>
          <Box mb={4}>
            <Heading.h2 mb={1}>By color</Heading.h2>
            <Box mb={2}>
              <StateLabel scheme='invalid'>Invalid</StateLabel>
            </Box>
            <Box mb={2}>
              <StateLabel scheme='green'>Green</StateLabel>
            </Box>
            <Box mb={2}>
              <StateLabel scheme='red'>Red</StateLabel>
            </Box>
            <Box mb={2}>
              <StateLabel scheme='purple'>Purple</StateLabel>
            </Box>
          </Box>
          <Box mb={4}>
            <Heading.h2 mb={2}>Small, by state</Heading.h2>
            <Box mb={2}>
              <span className='mr-2'>
                <StateLabel small>Unknown</StateLabel>
              </span>
              <span className='mr-2'>
                <StateLabel small state='open'>Open</StateLabel>
              </span>
              <span className='mr-2'>
                <StateLabel small state='closed'>Closed</StateLabel>
              </span>
              <span className='mr-2'>
                <StateLabel small state='merged'>Merged</StateLabel>
              </span>
              <span className='mr-2'>
                <StateLabel small state='reopened'>Reopened</StateLabel>
              </span>
            </Box>
          </Box>
          <Box mb={4}>
            <Heading.h2 mb={1}>Small, by color</Heading.h2>
            <Box mb={2}>
              <span className='mr-2'>
                <StateLabel small scheme='invalid'>Invalid</StateLabel>
              </span>
              <span className='mr-2'>
                <StateLabel small scheme='green'>Green</StateLabel>
              </span>
              <span className='mr-2'>
                <StateLabel small scheme='red'>Red</StateLabel>
              </span>
              <span className='mr-2'>
                <StateLabel small scheme='purple'>Purple</StateLabel>
              </span>
              <span className='mr-2'>
                <StateLabel small scheme='green' icon={<Octicon name='git-branch'/>}>
                  Custom Octicon
                </StateLabel>
              </span>
            </Box>
          </Box>
        </Detail>
      </Example>
    </Library>
  </Page>
)

export default Index
