import system, {FLEX_CONTAINER, withDefaultTheme} from './system-props'

const FlexContainer = system({is: 'div', display: 'flex'}, ...FLEX_CONTAINER)

export default withDefaultTheme(FlexContainer)
