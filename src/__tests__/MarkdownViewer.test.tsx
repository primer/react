import React from 'react'
import {render, waitFor, fireEvent} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import MarkdownViewer from '../MarkdownViewer'

describe('MarkdownViewer', () => {
  describe('task list interaction', () => {
    const taskListHtml = `
<p>text before list</p>
<ul class='contains-task-list'>
  <li class='task-list-item'><input type='checkbox' class='task-list-item-checkbox' disabled/> item 1</li>
  <li class='task-list-item'><input type='checkbox' class='task-list-item-checkbox' disabled/> item 2</li>
</ul>
<p>text after list</p>`
    const htmlObject = {__html: taskListHtml}
    const noItemsCheckedMarkdown = `
text before list

- [ ] item 1
- [ ] item 2

text after list`
    const firstItemCheckedMarkdown = `
text before list

- [x] item 1
- [ ] item 2

text after list`

    it('enables checklists by default', () => {
      const {getAllByRole} = render(
        <MarkdownViewer
          dangerousRenderedHTML={htmlObject}
          markdownValue={noItemsCheckedMarkdown}
          onChange={jest.fn()}
        />
      )
      const items = getAllByRole('checkbox')
      for (const item of items) expect(item).not.toBeDisabled()
    })

    it('does not enable checklists if task interaction is disabled', () => {
      const {getAllByRole} = render(
        <MarkdownViewer
          dangerousRenderedHTML={htmlObject}
          markdownValue={noItemsCheckedMarkdown}
          onChange={jest.fn()}
          disabled
        />
      )
      const items = getAllByRole('checkbox')
      for (const item of items) expect(item).toBeDisabled()
    })

    it('does not enable checklists if no onChange handler is provided', () => {
      const {getAllByRole} = render(<MarkdownViewer dangerousRenderedHTML={htmlObject} />)
      const items = getAllByRole('checkbox')
      for (const item of items) expect(item).toBeDisabled()
    })

    it('calls `onChange` with the updated Markdown when a task is checked', async () => {
      const onChangeMock = jest.fn()
      const {getAllByRole} = render(
        <MarkdownViewer
          dangerousRenderedHTML={htmlObject}
          markdownValue={noItemsCheckedMarkdown}
          onChange={onChangeMock}
          disabled
        />
      )
      const items = getAllByRole('checkbox')
      fireEvent.change(items[0])
      await waitFor(() => expect(onChangeMock).toHaveBeenCalledWith(firstItemCheckedMarkdown))
    })

    it('calls `onChange` with the updated Markdown when a task is unchecked', async () => {
      const onChangeMock = jest.fn()
      const {getAllByRole} = render(
        <MarkdownViewer
          dangerousRenderedHTML={htmlObject}
          markdownValue={firstItemCheckedMarkdown}
          onChange={onChangeMock}
          disabled
        />
      )
      const items = getAllByRole('checkbox')
      fireEvent.change(items[0])
      await waitFor(() => expect(onChangeMock).toHaveBeenCalledWith(noItemsCheckedMarkdown))
    })
  })

  describe('link interception', () => {
    it('makes all links open in a new tab when enabled', () => {
      const {getByRole} = render(
        // eslint-disable-next-line github/unescaped-html-literal
        <MarkdownViewer dangerousRenderedHTML={{__html: '<a href="https://example.com">link</a>'}} openLinksInNewTab />
      )
      const link = getByRole('link') as HTMLAnchorElement
      expect(link.target).toBe('_blank')
    })

    it('calls onLinkClick on link click', async () => {
      const onLinkClick = jest.fn()
      const {getByRole} = render(
        <MarkdownViewer
          // eslint-disable-next-line github/unescaped-html-literal
          dangerousRenderedHTML={{__html: '<a href="https://example.com">link</a>'}}
          onLinkClick={onLinkClick}
        />
      )
      const link = getByRole('link') as HTMLAnchorElement
      userEvent.click(link)
      expect(onLinkClick).toHaveBeenCalled()
    })
  })
})
