import {ButtonGroup} from './ButtonGroup'
import {Button} from '../Button'

export default {title: 'Display/ButtonGroup', component: ButtonGroup}
export const Default = {
  render: () => (
    <ButtonGroup>
      <Button>One</Button>
      <Button>Two</Button>
    </ButtonGroup>
  ),
}
export const Playground = {args: {orientation: 'vertical'}}
