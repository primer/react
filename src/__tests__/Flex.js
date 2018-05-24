import React from 'react'
import Flex, {FlexItem} from '../Flex'
import renderer from 'react-test-renderer'

const render = component => renderer.create(component).toJSON()

it('Flex obeys direction', () => {
  expect(render(<Flex direction='row' />))
    .toEqual(render(<div className='d-flex flex-direction-row' />))
  expect(render(<Flex direction='column' />))
    .toEqual(render(<div className='d-flex flex-direction-column' />))
  expect(render(<Flex direction='row-reverse' />))
    .toEqual(render(<div className='d-flex flex-direction-row-reverse' />))
  expect(render(<Flex direction='invalid' />))
    .toEqual(render(<div className='d-flex' />))
})

it('Flex obeys responsive direction', () => {
  expect(render(<Flex direction={['column', null, null, 'row']} />))
    .toEqual(render(<div className='d-flex flex-direction-column flex-lg-direction-row' />))
  expect(render(<Flex direction={['column', 'row', null, null, 'row-reverse']} />))
    .toEqual(render(<div className='d-flex flex-direction-column flex-sm-direction-row flex-xl-direction-row-reverse' />))
})

it('Flex obeys wrap', () => {
  expect(render(<Flex wrap={true} />))
    .toEqual(render(<div className='d-flex flex-wrap' />))
  expect(render(<Flex wrap={false} />))
    .toEqual(render(<div className='d-flex flex-nowrap' />))
})

it('Flex obeys justify', () => {
  expect(render(<Flex justify='start' />))
    .toEqual(render(<div className='d-flex flex-justify-start' />))
  expect(render(<Flex justify='end' />))
    .toEqual(render(<div className='d-flex flex-justify-end' />))
})

it('FlexItem supports auto', () => {
  expect(render(<FlexItem auto />))
    .toEqual(render(<div className='flex-auto' />))
  expect(render(<FlexItem auto={false} />))
    .toEqual(render(<div />))
})
