import {TriangleDownIcon} from '@primer/octicons-react'
import {ComponentMeta} from '@storybook/react'
import React, {useState} from 'react'

import Box from '../../Box'
import {Button} from '../../Button'
import {SelectPanel} from '.'
import {ItemInput} from '../../deprecated/ActionList/List'
import {ActionList} from '../../ActionList'
import Avatar from '../../Avatar'
import Select from '../../Select'
import Heading from '../../Heading'

export default {
  title: 'Drafts/Components/SelectPanel',
  component: SelectPanel,
} as ComponentMeta<typeof SelectPanel>

function getColorCircle(color: string) {
  return function () {
    return (
      <Box
        sx={{
          backgroundColor: color,
          borderColor: color,
          width: 14,
          height: 14,
          borderRadius: 10,
          margin: 'auto',
          borderWidth: '1px',
          borderStyle: 'solid',
        }}
      />
    )
  }
}

const items = [
  {leadingVisual: getColorCircle('#a2eeef'), text: 'enhancement', id: 1},
  {leadingVisual: getColorCircle('#d73a4a'), text: 'bug', id: 2},
  {leadingVisual: getColorCircle('#0cf478'), text: 'good first issue', id: 3},
  {leadingVisual: getColorCircle('#ffd78e'), text: 'design', id: 4},
  {leadingVisual: getColorCircle('#ff0000'), text: 'blocker', id: 5},
  {leadingVisual: getColorCircle('#a4f287'), text: 'backend', id: 6},
  {leadingVisual: getColorCircle('#8dc6fc'), text: 'frontend', id: 7},
]

/////

const SelectPanel2 = props => {
  return (
    <div>
      {props.children}
      <Button>Cancel</Button>
      <Button variant="primary">Submit</Button>
    </div>
  )
}
SelectPanel2.Title = props => {
  return <Heading {...props} />
}

// option 1:
SelectPanel2.SecondaryButton = props => {
  return <Button {...props} />
}
SelectPanel2.SecondaryLink = props => {
  return <a {...props} />
}

// option 2:
SelectPanel2.SecondaryActionSlot = props => {
  return <div id="left-layout">{props.children}</div>
}

export const Default = () => {
  const [selected, setSelected] = React.useState<ItemInput[]>([items[0], items[1]])
  const [filter, setFilter] = React.useState('')
  const filteredItems = items.filter(item => item.text.toLowerCase().startsWith(filter.toLowerCase()))
  const [open, setOpen] = useState(false)

  return (
    <>
      <h1>Multi Select Panel</h1>

      <button>open the panel</button>

      <SelectPanel2>
        <SelectPanel2.Title as="h3">Select authors</SelectPanel2.Title>

        <ActionList showDividers>
          <ActionList.Item>
            <ActionList.LeadingVisual>
              <Avatar src="https://github.com/mona.png" />
            </ActionList.LeadingVisual>
            mona
            <ActionList.Description>Monalisa Octocat</ActionList.Description>
          </ActionList.Item>
          <ActionList.Item>
            <ActionList.LeadingVisual>
              <Avatar src="https://github.com/hubot.png" />
            </ActionList.LeadingVisual>
            hubot
            <ActionList.Description>Hubot</ActionList.Description>
          </ActionList.Item>
          <ActionList.Item>
            <ActionList.LeadingVisual>
              <Avatar src="https://github.com/primer-css.png" />
            </ActionList.LeadingVisual>
            primer-css
            <ActionList.Description>GitHub Design Systems Bot</ActionList.Description>
          </ActionList.Item>
        </ActionList>

        <SelectPanel2.SecondaryButton as="a">View authors</SelectPanel2.SecondaryButton>
      </SelectPanel2>

      <hr />

      <div id="overlay">
        <div id="header">
          <h2>Select authors</h2>
          <Button>clear</Button>
          <Button>close</Button>
          <input type="search" />
        </div>
        <form>
          <div id="body">
            <ActionList showDividers>
              <ActionList.Item>
                <ActionList.LeadingVisual>
                  <Avatar src="https://github.com/mona.png" />
                </ActionList.LeadingVisual>
                mona
                <ActionList.Description>Monalisa Octocat</ActionList.Description>
              </ActionList.Item>
              <ActionList.Item>
                <ActionList.LeadingVisual>
                  <Avatar src="https://github.com/hubot.png" />
                </ActionList.LeadingVisual>
                hubot
                <ActionList.Description>Hubot</ActionList.Description>
              </ActionList.Item>
              <ActionList.Item>
                <ActionList.LeadingVisual>
                  <Avatar src="https://github.com/primer-css.png" />
                </ActionList.LeadingVisual>
                primer-css
                <ActionList.Description>GitHub Design Systems Bot</ActionList.Description>
              </ActionList.Item>
            </ActionList>
          </div>
          <div id="footer">
            <div id="form-actions">
              <Button type="button">Cancel</Button>
              <Button type="submit">Save</Button>
            </div>
            <div id="secondary-action">
              <Button type="button">View authors</Button>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}
