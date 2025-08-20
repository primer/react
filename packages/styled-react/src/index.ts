import {Truncate as PrimerTruncate} from '@primer/react'
import {createStyledComponent} from './utils/createStyledComponent'

const Truncate: ReturnType<typeof createStyledComponent> = /*#__PURE__*/ createStyledComponent(PrimerTruncate)
export {Truncate}

export {
  ActionList,
  ActionMenu,
  Box,
  type BoxProps,
  Breadcrumbs,
  Button,
  Flash,
  FormControl,
  Heading,
  IconButton,
  Label,
  Link,
  LinkButton,
  PageLayout,
  Text,
  TextInput,

  // Utilities for working with the `sx` prop
  sx,
  type SxProp,
  type BetterSystemStyleObject,
} from '@primer/react'
