import {Overlay} from './Overlay'

export default {component: Overlay, title: 'Components/Overlay'}

export const Default = {render: () => <Overlay className="w-80 p-4">Floating content</Overlay>}
export const Playground = {render: () => <Overlay className="w-96 p-6">Adjust this surface with className.</Overlay>}
export const Surface = {
  render: () => <Overlay className="w-80 p-4">Overlay surfaces compose with positioning primitives.</Overlay>,
}
