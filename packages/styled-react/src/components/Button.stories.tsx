import {ButtonComponent as Button} from './Button'

export default {
  title: 'Components/Button',
  component: Button,
}

export const WithColor = () => <Button sx={{color: 'rebeccapurple'}}>Click me</Button>

export const WithFontSize = () => <Button sx={{fontSize: '2rem'}}>Click me</Button>
