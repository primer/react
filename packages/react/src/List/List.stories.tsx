import {List, Item} from '../List'

export default {
  title: 'Components/List',
}

export const Default = () => {
  return (
    <>
      <List>
        <Item>Item 1</Item>
        <Item>Item 2</Item>
        <Item>Item 3</Item>
      </List>
    </>
  )
}
