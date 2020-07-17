import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {COMMON, get} from './constants'
import theme from './theme'
import sx from './sx'

const FormGroupHeader = ({variant}) => {
  let labelValue = ''
  let textValue = ''
  if (variant === 'input') {
    labelValue = 'example-text'
    textValue = 'Text'
  } else if (variant === 'select') {
    labelValue = 'example-select'
    textValue = 'Select'
  } else {
    labelValue = 'example-textarea'
    textValue = 'Textarea'
  }

  return (
    <StyledFormGroupHeader>
      <label For={labelValue}>Example {textValue}</label>
    </StyledFormGroupHeader>
  )
}

const FORM_GROUP_BODY_STATES = {
  input: <input className="form-control" type="text" value="Example Value" id="example-text" />,
  select: (
    <select className="form-select" id="example-select">
      <option>Choose an option</option>
      <option>Git</option>
      <option>Subversion</option>
      <option>Social Coding</option>
      <option>Beets</option>
      <option>Bears</option>
      <option>Battlestar Galactica</option>
    </select>
  ),
  textarea: <textarea className="form-control" id="example-textarea" />
}

const FormGroupBody = ({variant}) => {
  return <StyledFormGroupBody>{FORM_GROUP_BODY_STATES[variant]}</StyledFormGroupBody>
}

const FormGroup = ({variant, ...props}) => {
  return (
    <StyledFormGroup {...props}>
      <FormGroupHeader variant={variant} />
      <FormGroupBody variant={variant} />
    </StyledFormGroup>
  )
}

const StyledFormGroupHeader = styled.div`
  margin: 0 0 6px;

  & > label {
    position: static;
    font-weight: ${get('fontWeights.bold')};
  }
`

const StyledFormGroupBody = styled.div`
  & > .form-control,
  .form-select {
    padding: 5px 12px;
    font-size: ${get('fontSizes.1')};
    line-height: ${get('lineHeights.default')};
    color: ${get('colors.bodytext')};
    vertical-align: middle;
    background-color: #fff;
    background-repeat: no-repeat;
    background-position: right 8px center;
    border: ${get('borderWidths.1')} solid ${get('colors.gray.2')};
    border-radius: ${get('radii.2')};
    outline: none;
    box-shadow: ${get('shadows.formControl')};
  }
`

const StyledFormGroup = styled.div`
  margin: 15px 0;
  font-weight: ${get('fontWeights.normal')};
  & .form-control {
    width: 440px;
    max-width: 100%;
    margin-right: 5px;
    background-color: ${get('colors.gray.0')};
  }
  & .form-select {
    display: inline-block;
    max-width: 100%;
    height: 32px;
    padding-right: 24px;
    background-color: #fff;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAUCAMAAACzvE1FAAAADFBMVEUzMzMzMzMzMzMzMzMKAG/3AAAAA3RSTlMAf4C/aSLHAAAAPElEQVR42q3NMQ4AIAgEQTn//2cLdRKppSGzBYwzVXvznNWs8C58CiussPJj8h6NwgorrKRdTvuV9v16Afn0AYFOB7aYAAAAAElFTkSuQmCC);
    background-repeat: no-repeat;
    background-position: right 8px center;
    background-size: 8px 10px;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }
  & textarea.form-control {
    width: 100%;
    height: 200px;
    min-height: 200px;
  }
  ${COMMON};
  ${sx};
`

FormGroup.defaultProps = {
  theme,
  variant: 'default'
}

FormGroup.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['input', 'select', 'textarea']),
  ...COMMON.propTypes,
  ...sx.propTypes
}

export default FormGroup
