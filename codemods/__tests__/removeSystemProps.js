import {defineInlineTest} from 'jscodeshift/dist/testUtils'
import removeSystemProps from '../removeSystemProps'

defineInlineTest(
  removeSystemProps,
  {},
  `
import {Label} from '@primer/components'
const leftMargin = 2
export default () => (
  <Label mr={1} ml={leftMargin}>
    <Text>hi</Text>
  </Label>
)
`.trim(),
  `
import {Label} from '@primer/components'
const leftMargin = 2
export default () => (
  <Label sx={{mr: 1, ml: leftMargin}}>
    <Text>hi</Text>
  </Label>
)
`.trim(),
  'removeSystemProps',
)

defineInlineTest(
  removeSystemProps,
  {},
  `
import {Button, StyledOcticon} from '@primer/components'
import {CheckIcon, ClippyIcon} from '@primer/octicons-react'

const ClipboardCopy = ({value}) => <Button px={2}>
  {copied ? (
    <StyledOcticon icon={CheckIcon} color="green.5" />
  ) : (
    <StyledOcticon icon={ClippyIcon} color="gray.5" />
  )}
</Button>

`.trim(),
  `
import {Button, StyledOcticon} from '@primer/components'
import {CheckIcon, ClippyIcon} from '@primer/octicons-react'

const ClipboardCopy = ({value}) => (
  <Button sx={{px: 2}}>
    {copied ? (
      <StyledOcticon icon={CheckIcon} sx={{color: 'green.5'}} />
    ) : (
      <StyledOcticon icon={ClippyIcon} sx={{color: 'gray.5'}} />
    )}
  </Button>
)`.trim(),
  'removeSystemProps',
)

defineInlineTest(
  removeSystemProps,
  {},
  `
import {Link} from '@primer/components'
const siteMetadata = {shortName: 'inline-block'}

const link = <Link
  display={[
    // We only hide "Primer" on small viewports if a shortName is defined.
    siteMetadata.shortName ? 'none' : 'inline-block',
    null,
    null,
    'inline-block',
  ]}
  href="https://primer.style"
  color="blue.4"
  fontFamily="mono"
>
  Primer
</Link>
`.trim(),
  `
import {Link} from '@primer/components'
const siteMetadata = {shortName: 'inline-block'}

const link = (
  <Link
    href="https://primer.style"
    sx={{
      display: [siteMetadata.shortName ? 'none' : 'inline-block', null, null, 'inline-block'],
      color: 'blue.4',
      fontFamily: 'mono'
    }}
  >
    Primer
  </Link>
)`.trim(),
  'removeSystemProps',
)

defineInlineTest(
  removeSystemProps,
  {},
  `
import {Label} from '@primer/components'
const leftMargin = 2
export default () => (
  <Label mr={1} ml={leftMargin} sx={{p: 1}}>
    <Text>hi</Text>
  </Label>
)
`.trim(),
  `
import {Label} from '@primer/components'
const leftMargin = 2
export default () => (
  <Label sx={{p: 1, mr: 1, ml: leftMargin}}>
    <Text>hi</Text>
  </Label>
)
`.trim(),
  'removeSystemProps',
)

defineInlineTest(
  removeSystemProps,
  {},
  `
import {Label} from '@primer/components'
const leftMargin = 2
export default () => (
  <Label mr={1} ml={leftMargin} sx={{p:3}}>
    <Text>hi</Text>
  </Label>
)
`.trim(),
  `
import {Label} from '@primer/components'
const leftMargin = 2
export default () => (
  <Label sx={{p: 3, mr: 1, ml: leftMargin}}>
    <Text>hi</Text>
  </Label>
)
`.trim(),
  'removeSystemProps',
)

defineInlineTest(
  removeSystemProps,
  {},
  `
import {Label} from '@primer/components'
const leftMargin = 2
const colorProps = {backgroundColor: 'red'}
const borderProps = {borderColor: 'red'}
export default () => (
  <Label mr={1} ml={leftMargin} sx={{...colorProps, ...borderProps, p:3}}>
    <Text>hi</Text>
  </Label>
)
`.trim(),
  `
import {Label} from '@primer/components'
const leftMargin = 2
const colorProps = {backgroundColor: 'red'}
const borderProps = {borderColor: 'red'}
export default () => (
  <Label sx={{...colorProps, ...borderProps, p: 3, mr: 1, ml: leftMargin}}>
    <Text>hi</Text>
  </Label>
)
`.trim(),
  'removeSystemProps',
)

defineInlineTest(
  removeSystemProps,
  {},
  `
import {Label} from '@primer/components'
const leftMargin = 2
export default () => (
  <Label mr={1} sx={{'&:hover': {textDecoration: 'none'}}}>
    <Text>hi</Text>
  </Label>
)
`.trim(),
  `
import {Label} from '@primer/components'
const leftMargin = 2
export default () => (
  <Label sx={{'&:hover': {textDecoration: 'none'}, mr: 1}}>
    <Text>hi</Text>
  </Label>
)
`.trim(),
  'removeSystemProps',
)

defineInlineTest(
  removeSystemProps,
  {},
  `
import {Label} from '@primer/components'
const leftMargin = 2
const colorProps = {dark: {backgroundColor: 'red'}}
export default () => (
  <Label mr={1} ml={leftMargin} sx={{...colorProps.dark, p:3}}>
    <Text>hi</Text>
  </Label>
)
`.trim(),
  `
import {Label} from '@primer/components'
const leftMargin = 2
const colorProps = {dark: {backgroundColor: 'red'}}
export default () => (
  <Label sx={{...colorProps.dark, p: 3, mr: 1, ml: leftMargin}}>
    <Text>hi</Text>
  </Label>
)
`.trim(),
  'removeSystemProps',
)
