import {fireEvent, render, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

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
    const hierarchyBeforeTaskListNoItemsChecked = `
text before list

\`\`\`[tasklist]
- [ ] item A
- [ ] item B
\`\`\`

- [ ] item 1
- [ ] item 2

text after list`
    const hierarchyBeforeTaskListOneItemChecked = `
text before list

\`\`\`[tasklist]
- [ ] item A
- [ ] item B
\`\`\`

- [x] item 1
- [ ] item 2

text after list`
    const hierarchyBeforeTaskListNoItemsCheckedTildes = `
text before list

~~~[tasklist]
- [ ] item A
- [ ] item B
\`\`\`
~~~~~~

- [ ] item 1
- [ ] item 2

text after list`
    const hierarchyBeforeTaskListOneItemCheckedTildes = `
text before list

~~~[tasklist]
- [ ] item A
- [ ] item B
\`\`\`
~~~~~~

- [x] item 1
- [ ] item 2

text after list`

    it('enables checklists by default', () => {
      const {getAllByRole} = render(
        <MarkdownViewer
          dangerousRenderedHTML={htmlObject}
          markdownValue={noItemsCheckedMarkdown}
          onChange={jest.fn()}
        />,
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
        />,
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
        />,
      )
      const items = getAllByRole('checkbox')
      fireEvent.change(items[0])
      await waitFor(() => expect(onChangeMock).toHaveBeenCalledWith(firstItemCheckedMarkdown))
    })

    it('calls `onChange` with the updated Markdown when a task is checked and hierarchy is present', async () => {
      const onChangeMock = jest.fn()
      const {getAllByRole} = render(
        <MarkdownViewer
          dangerousRenderedHTML={htmlObject}
          markdownValue={hierarchyBeforeTaskListNoItemsChecked}
          onChange={onChangeMock}
          disabled
        />,
      )
      const items = getAllByRole('checkbox')
      fireEvent.change(items[0])
      await waitFor(() => expect(onChangeMock).toHaveBeenCalledWith(hierarchyBeforeTaskListOneItemChecked))
    })

    it('calls `onChange` with the updated Markdown when a task is checked and hierarchy is present with tildes', async () => {
      const onChangeMock = jest.fn()
      const {getAllByRole} = render(
        <MarkdownViewer
          dangerousRenderedHTML={htmlObject}
          markdownValue={hierarchyBeforeTaskListNoItemsCheckedTildes}
          onChange={onChangeMock}
          disabled
        />,
      )
      const items = getAllByRole('checkbox')
      fireEvent.change(items[0])
      await waitFor(() => expect(onChangeMock).toHaveBeenCalledWith(hierarchyBeforeTaskListOneItemCheckedTildes))
    })

    it('calls `onChange` with the updated Markdown when a task is unchecked', async () => {
      const onChangeMock = jest.fn()
      const {getAllByRole} = render(
        <MarkdownViewer
          dangerousRenderedHTML={htmlObject}
          markdownValue={firstItemCheckedMarkdown}
          onChange={onChangeMock}
          disabled
        />,
      )
      const items = getAllByRole('checkbox')
      fireEvent.change(items[0])
      await waitFor(() => expect(onChangeMock).toHaveBeenCalledWith(noItemsCheckedMarkdown))
    })

    it('attaches event handlers to new tasks', async () => {
      const onChangeMock = jest.fn()
      const TestComponent = () => {
        const [html, setHtml] = React.useState(taskListHtml)
        const [markdown, setMarkdown] = React.useState(noItemsCheckedMarkdown)
        return (
          <>
            <button
              onClick={() => {
                setMarkdown(`${markdown}
- [ ] item 3
`)
                setHtml(`${html}
<ul class='contains-task-list'>
  <li class='task-list-item'><input type='checkbox' class='task-list-item-checkbox' disabled/> item 3</li>
</ul>
`)
              }}
            >
              Add markdown
            </button>
            <MarkdownViewer dangerousRenderedHTML={{__html: html}} markdownValue={markdown} onChange={onChangeMock} />
          </>
        )
      }
      const {getByRole, getAllByRole} = render(<TestComponent />)

      // Change markdown and html content
      const button = getByRole('button', {name: 'Add markdown'})
      fireEvent.click(button)

      const items = getAllByRole('checkbox')
      fireEvent.change(items[2])
      await waitFor(() => expect(onChangeMock).toHaveBeenCalledWith(`${noItemsCheckedMarkdown}\n- [x] item 3\n`))
    })
  })

  describe('link interception', () => {
    it('makes all links open in a new tab when enabled', async () => {
      const user = userEvent.setup()
      const windowOpenSpy = jest.spyOn(window, 'open')
      windowOpenSpy.mockImplementation(jest.fn())

      const {getByRole} = render(
        // eslint-disable-next-line github/unescaped-html-literal
        <MarkdownViewer dangerousRenderedHTML={{__html: '<a href="https://example.com">link</a>'}} openLinksInNewTab />,
      )
      const link = getByRole('link') as HTMLAnchorElement
      await user.click(link)
      expect(windowOpenSpy).toHaveBeenCalledWith('https://example.com/', '_blank', 'noopener noreferrer')
    })

    it('calls onLinkClick on link click', async () => {
      const spy = jest.spyOn(console, 'error').mockImplementationOnce(() => {})
      const user = userEvent.setup()
      const onLinkClick = jest.fn()
      const {getByRole} = render(
        <MarkdownViewer
          // eslint-disable-next-line github/unescaped-html-literal
          dangerousRenderedHTML={{__html: '<a href="https://example.com">link</a>'}}
          onLinkClick={onLinkClick}
        />,
      )
      const link = getByRole('link') as HTMLAnchorElement
      await user.click(link)

      expect(onLinkClick).toHaveBeenCalled()
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Not implemented: navigation (except hash changes)',
        }),
      )
      spy.mockRestore()
    })
  })
})
