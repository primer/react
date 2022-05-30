import React from 'react'
import {TextInput} from '..'
import {render, mount, behavesAsComponent, checkExports} from '../utils/testing'
import {render as HTMLRender, cleanup, fireEvent} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
import {SearchIcon} from '@primer/octicons-react'
expect.extend(toHaveNoViolations)

describe('TextInput', () => {
  behavesAsComponent({Component: TextInput, options: {skipAs: true}})

  checkExports('TextInput', {
    default: TextInput
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<TextInput aria-label="zipcode" name="zipcode" variant="small" />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  it('renders', () => {
    expect(render(<TextInput name="zipcode" />)).toMatchSnapshot()
  })

  it('renders small', () => {
    expect(render(<TextInput name="zipcode" size="small" />)).toMatchSnapshot()
  })

  it('renders large', () => {
    expect(render(<TextInput name="zipcode" size="large" />)).toMatchSnapshot()
  })

  it('renders block', () => {
    expect(render(<TextInput name="zipcode" block />)).toMatchSnapshot()
  })

  it('renders warning', () => {
    expect(render(<TextInput name="zipcode" validationStatus="warning" />)).toMatchSnapshot()
  })

  it('renders error', () => {
    expect(render(<TextInput name="zipcode" validationStatus="error" />)).toMatchSnapshot()
  })

  it('renders contrast', () => {
    expect(render(<TextInput name="zipcode" contrast />)).toMatchSnapshot()
  })
  it('renders monospace', () => {
    expect(render(<TextInput name="zipcode" monospace />)).toMatchSnapshot()
  })

  it('renders placeholder', () => {
    expect(render(<TextInput name="zipcode" placeholder={'560076'} />)).toMatchSnapshot()
  })

  it('renders leadingVisual', () => {
    expect(render(<TextInput name="search" placeholder={'Search'} leadingVisual={SearchIcon} />)).toMatchSnapshot()
  })

  it('renders trailingVisual', () => {
    expect(render(<TextInput name="search" placeholder={'Search'} trailingVisual={SearchIcon} />)).toMatchSnapshot()
  })

  it('renders trailingAction text button', () => {
    const handleAction = jest.fn()
    expect(
      render(
        <TextInput
          name="search"
          placeholder={'Search'}
          trailingAction={<TextInput.Action onClick={handleAction}>Clear</TextInput.Action>}
        />
      )
    ).toMatchSnapshot()
  })

  it('renders trailingAction text button with a tooltip', () => {
    const handleAction = jest.fn()
    expect(
      render(
        <TextInput
          name="search"
          placeholder={'Search'}
          trailingAction={
            <TextInput.Action onClick={handleAction} aria-label="Clear input">
              Clear
            </TextInput.Action>
          }
        />
      )
    ).toMatchSnapshot()
  })

  it('renders trailingAction icon button', () => {
    const handleAction = jest.fn()
    expect(
      render(
        <TextInput
          name="search"
          placeholder={'Search'}
          trailingAction={<TextInput.Action onClick={handleAction} icon={SearchIcon} aria-label="iconLabel" />}
        />
      )
    ).toMatchSnapshot()
  })

  it('focuses the text input if you do not click the input element', () => {
    const {container, getByLabelText} = HTMLRender(
      <>
        {/* eslint-disable-next-line jsx-a11y/label-has-for */}
        <label htmlFor="testInput">Search</label>
        <TextInput id="testInput" name="search" placeholder={'Search'} trailingVisual={SearchIcon} />
      </>
    )

    const icon = container.querySelector('svg')!

    expect(getByLabelText('Search')).not.toEqual(document.activeElement)
    fireEvent.click(icon)
    expect(getByLabelText('Search')).toEqual(document.activeElement)
  })

  it('renders with a loading indicator', () => {
    expect(
      render(
        <>
          <TextInput loading />

          <TextInput loading loaderPosition="leading" />

          <TextInput loading loaderPosition="trailing" />

          <TextInput loading leadingVisual={SearchIcon} />

          <TextInput loading leadingVisual={SearchIcon} loaderPosition="leading" />

          <TextInput loading leadingVisual={SearchIcon} loaderPosition="trailing" />

          <TextInput loading trailingVisual={SearchIcon} />

          <TextInput loading trailingVisual={SearchIcon} loaderPosition="leading" />

          <TextInput loading trailingVisual={SearchIcon} loaderPosition="trailing" />

          <TextInput loading size="small" leadingVisual={SearchIcon} trailingVisual={SearchIcon} />

          <TextInput loading leadingVisual={SearchIcon} trailingVisual={SearchIcon} loaderPosition="leading" />

          <TextInput
            loading
            size="large"
            leadingVisual={SearchIcon}
            trailingVisual={SearchIcon}
            loaderPosition="trailing"
          />
        </>
      )
    ).toMatchSnapshot()
  })

  it('indicates a busy status to assistive technology', () => {
    const {container} = HTMLRender(
      <>
        {/* eslint-disable-next-line jsx-a11y/label-has-for */}
        <label htmlFor="loadingInput">Search</label>
        <TextInput loading id="loadingInput" />
      </>
    )

    expect(container.querySelector('span[aria-busy=true]')).not.toBeNull()
  })

  it('should call onChange prop with input value', () => {
    const onChangeMock = jest.fn()
    const component = mount(<TextInput onChange={onChangeMock} value="test" />)
    component.find('input').simulate('change')
    expect(onChangeMock).toHaveBeenCalled()
  })

  it('should render a password input', () => {
    expect(render(<TextInput name="password" type="password" />)).toMatchSnapshot()
  })
})
