import {describe, it, expect} from 'vitest'
import {render as HTMLRender} from '@testing-library/react'
import BaseStyles from '../BaseStyles'
import {ActionList} from '.'
import {ActionMenu} from '../ActionMenu'
import {implementsClassName, withExpectedConsoleError} from '../utils/testing'
import classes from './Heading.module.css'
import visuallyHiddenClasses from '../_VisuallyHidden.module.css'

describe('ActionList.Heading', () => {
  implementsClassName(
    props => (
      <ActionList>
        <ActionList.Heading as="h1" {...props}>
          Heading
        </ActionList.Heading>
      </ActionList>
    ),
    classes.ActionListHeader,
  )

  it('should render the ActionList.Heading component as a heading with the given heading level', async () => {
    const container = HTMLRender(
      <ActionList>
        <ActionList.Heading as="h1">Heading</ActionList.Heading>
      </ActionList>,
    )
    const heading = container.getByRole('heading', {level: 1})
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent('Heading')
  })

  it('should not wrap the heading in a span', async () => {
    const {getByRole} = HTMLRender(
      <ActionList>
        <ActionList.Heading as="h1">Heading</ActionList.Heading>
      </ActionList>,
    )
    const heading = getByRole('heading', {level: 1})
    expect(heading.parentElement?.tagName).not.toBe('SPAN')
    expect(heading).toHaveClass(classes.ActionListHeader)
  })

  it('should apply the visually-hidden class to the heading when visuallyHidden is set', async () => {
    const {getByRole} = HTMLRender(
      <ActionList>
        <ActionList.Heading as="h1" visuallyHidden>
          Heading
        </ActionList.Heading>
      </ActionList>,
    )
    const heading = getByRole('heading', {level: 1})
    expect(heading).toHaveClass(visuallyHiddenClasses.InternalVisuallyHidden)
    expect(heading).toHaveClass(classes.ActionListHeader)
  })

  it('should not apply the visually-hidden class to the heading by default', async () => {
    const {getByRole} = HTMLRender(
      <ActionList>
        <ActionList.Heading as="h1">Heading</ActionList.Heading>
      </ActionList>,
    )
    const heading = getByRole('heading', {level: 1})
    expect(heading).not.toHaveClass(visuallyHiddenClasses.InternalVisuallyHidden)
    expect(heading).toHaveClass(classes.ActionListHeader)
  })

  it('should label the action list with the heading id', async () => {
    const {container, getByRole} = HTMLRender(
      <ActionList>
        <ActionList.Heading as="h1">Heading</ActionList.Heading>
        <ActionList.Item>Item</ActionList.Item>
      </ActionList>,
    )
    const list = container.querySelector('ul')
    const heading = getByRole('heading', {level: 1})
    expect(list).toHaveAttribute('aria-labelledby', heading.id)
  })

  it('should throw an error when ActionList.Heading is used within ActionMenu context', async () => {
    withExpectedConsoleError(() => {
      expect(() =>
        HTMLRender(
          <BaseStyles>
            <ActionMenu open={true}>
              <ActionMenu.Button>Trigger</ActionMenu.Button>
              <ActionMenu.Overlay>
                <ActionList>
                  <ActionList.Heading as="h1">Heading</ActionList.Heading>
                  <ActionList.Item>Item</ActionList.Item>
                </ActionList>
              </ActionMenu.Overlay>
            </ActionMenu>
          </BaseStyles>,
        ),
      ).toThrow(
        "ActionList.Heading shouldn't be used within an ActionMenu container. Menus are labelled by the menu button's name.",
      )
    })
  })
})
