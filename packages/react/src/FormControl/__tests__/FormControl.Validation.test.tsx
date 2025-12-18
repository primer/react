import {describe} from 'vitest'
import FormControl from '../FormControl'
import {implementsClassName} from '../../utils/testing'
import classes from '../../internal/components/InputValidation.module.css'

describe('FormControl.Validation', () => {
  implementsClassName(FormControl.Validation, classes.InputValidation)
})
