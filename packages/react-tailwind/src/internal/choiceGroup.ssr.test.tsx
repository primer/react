// @vitest-environment node
import {renderToString} from 'react-dom/server'
import {describe, expect, it} from 'vitest'
import {Checkbox} from '../components/Checkbox'
import {CheckboxGroup} from '../components/CheckboxGroup'
import {Radio} from '../components/Radio'
import {RadioGroup} from '../components/RadioGroup'

describe('choice groups on the server', () => {
  it('render their name and description wiring', () => {
    const checkboxes = renderToString(
      <CheckboxGroup id="topics" required>
        <CheckboxGroup.Label>Topics</CheckboxGroup.Label>
        <CheckboxGroup.Caption>Pick any</CheckboxGroup.Caption>
        <Checkbox value="one" aria-label="One" />
      </CheckboxGroup>,
    )
    expect(checkboxes).toContain('aria-labelledby="topics-label"')
    expect(checkboxes).toContain('aria-describedby="topics-caption topics-required"')
    expect(checkboxes).toContain('id="topics-label"')

    const radios = renderToString(
      <RadioGroup id="view" name="view">
        <RadioGroup.Label>View</RadioGroup.Label>
        <RadioGroup.Validation variant="error">Pick one</RadioGroup.Validation>
        <Radio value="list" aria-label="List" />
      </RadioGroup>,
    )
    expect(radios).toContain('aria-labelledby="view-label"')
    expect(radios).toContain('aria-describedby="view-validation"')
  })
})
