import Octicon from '@githubprimer/octicons-react'
import styled from 'styled-components'
import {COMMON} from './constants'
import theme from './theme'

const StyledOcticon = styled(Octicon)(COMMON)

StyledOcticon.defaultProps = {
  theme
}

StyledOcticon.propTypes = {
  ...COMMON.propTypes
}

export default StyledOcticon
