import sass from 'sass.macro'
import {injectGlobal} from 'emotion'

injectGlobal(sass`
  * { box-sizing: border-box; }
  body { margin: 0; }
  table { border-collapse: collapse; }
`)

export {default as theme} from './theme'
export {default as BaseStyles} from './BaseStyles'

// Layout
export {default as BorderBox} from './BorderBox'
export {default as Box} from './Box'
export {Position, Absolute, Fixed, Relative, Sticky} from './Position'

// Components
export {default as Avatar} from './Avatar'

export {default as Button} from './Button'
export {default as ButtonDanger} from './ButtonDanger'
export {default as ButtonPrimary} from './ButtonPrimary'
export {default as ButtonOutline} from './ButtonOutline'
export {default as ButtonLink} from './ButtonLink'
export {default as OcticonButton} from './OcticonButton'

export {default as Caret} from './Caret'
export {default as PointerBox} from './PointerBox'
export {default as CircleOcticon} from './CircleOcticon'
export {default as CircleBadge} from './CircleBadge'

export {default as Details} from './Details'
export {default as Dropdown} from './Dropdown'

export {default as Donut} from './Donut'
export {default as FilterList} from './FilterList'
export {default as FilterListItem} from './FilterListItem'
export {default as FlexContainer} from './FlexContainer'
export {default as FlexItem} from './FlexItem'

export {default as TextInput} from './TextInput'

export {default as Heading} from './Heading'
export {default as Label} from './Label'
export {default as BranchName} from './BranchName'
export {default as Link} from './Link'
export {default as MergeStatus} from './MergeStatus'
export {default as Text} from './Text'
export {default as Tooltip} from './Tooltip'
export {default as CounterLabel} from './CounterLabel'
export {default as Flash} from './Flash'
export {default as StateLabel} from './StateLabel'

export {default as UnderlineNav} from './UnderlineNav'
export {default as UnderlineNavLink} from './UnderlineNavLink'
