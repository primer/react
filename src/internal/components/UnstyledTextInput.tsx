import styled from 'styled-components'
import sx from '../../sx'

const UnstyledTextInput = styled.input`
  border: 0;
  font-size: inherit;
  font-family: inherit;
  background-color: transparent;
  -webkit-appearance: none;
  color: inherit;
  width: 100%;
  &:focus {
    outline: 0;
  }

  ${sx};
`

export default UnstyledTextInput
