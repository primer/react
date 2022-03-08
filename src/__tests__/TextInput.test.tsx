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
    expect(render(<TextInput name="zipcode" status="warning" />)).toMatchSnapshot()
  })

  it('renders error', () => {
    expect(render(<TextInput name="zipcode" status="error" />)).toMatchSnapshot()
  })

  it('renders contrast', () => {
    expect(render(<TextInput name="zipcode" status="contrast" />)).toMatchSnapshot()
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
          <TextInput isLoading />

          <TextInput isLoading loaderPosition="leading" />

          <TextInput isLoading loaderPosition="trailing" />

          <TextInput isLoading leadingVisual={SearchIcon} />

          <TextInput isLoading leadingVisual={SearchIcon} loaderPosition="leading" />

          <TextInput isLoading leadingVisual={SearchIcon} loaderPosition="trailing" />

          <TextInput isLoading trailingVisual={SearchIcon} />

          <TextInput isLoading trailingVisual={SearchIcon} loaderPosition="leading" />

          <TextInput isLoading trailingVisual={SearchIcon} loaderPosition="trailing" />

          <TextInput isLoading size="small" leadingVisual={SearchIcon} trailingVisual={SearchIcon} />

          <TextInput isLoading leadingVisual={SearchIcon} trailingVisual={SearchIcon} loaderPosition="leading" />

          <TextInput
            isLoading
            size="large"
            leadingVisual={SearchIcon}
            trailingVisual={SearchIcon}
            loaderPosition="trailing"
          />
        </>
      )
    ).toMatchSnapshot()
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
