import {page} from 'vitest/browser'
import {describe, it, expect} from 'vitest'
import {render as HTMLRender} from '@testing-library/react'
import {PlusIcon} from '@primer/octicons-react'
import BaseStyles from '../BaseStyles'
import {ActionList} from '.'
import {ActionMenu} from '../ActionMenu'
import {FeatureFlags} from '../FeatureFlags'
import {implementsClassName, withExpectedConsoleError} from '../utils/testing'
import classes from './Group.module.css'

describe('ActionList.Group', () => {
  implementsClassName(
    props => (
      <ActionList>
        <ActionList.Group {...props}>
          <ActionList.Item>item</ActionList.Item>
        </ActionList.Group>
      </ActionList>
    ),
    classes.Group,
  )
  implementsClassName(ActionList.GroupHeading, classes.GroupHeading)

  it('should throw an error when ActionList.GroupHeading has an `as` prop when it is used within ActionMenu context', async () => {
    withExpectedConsoleError(() => {
      expect(() =>
        HTMLRender(
          <BaseStyles>
            <ActionMenu open={true}>
              <ActionMenu.Button>Trigger</ActionMenu.Button>
              <ActionMenu.Overlay>
                <ActionList>
                  <ActionList.Group>
                    <ActionList.GroupHeading as="h2">Group Heading</ActionList.GroupHeading>
                  </ActionList.Group>
                </ActionList>
              </ActionMenu.Overlay>
            </ActionMenu>
          </BaseStyles>,
        ),
      ).toThrow(
        "Looks like you are trying to set a heading level to a menu role. Group headings for menu type action lists are for representational purposes, and rendered as divs. Therefore they don't need a heading level.",
      )
    })
  })

  it('should render the ActionList.GroupHeading component as a heading with the given heading level', async () => {
    HTMLRender(
      <ActionList>
        <ActionList.Heading as="h1">Heading</ActionList.Heading>
        <ActionList.Group>
          <ActionList.GroupHeading as="h2">Group Heading</ActionList.GroupHeading>
        </ActionList.Group>
      </ActionList>,
    )
    const heading = page.getByRole('heading', {level: 2})
    await expect.element(heading).toBeInTheDocument()
    await expect.element(heading).toHaveTextContent('Group Heading')
  })
  it('should throw an error if ActionList.GroupHeading is used without an `as` prop when no role is specified (for list role)', async () => {
    withExpectedConsoleError(() => {
      expect(() =>
        HTMLRender(
          <ActionList>
            <ActionList.Heading as="h1">Heading</ActionList.Heading>
            <ActionList.Group>
              <ActionList.GroupHeading>Group Heading</ActionList.GroupHeading>
              <ActionList.Item>Item</ActionList.Item>
            </ActionList.Group>
          </ActionList>,
        ),
      ).toThrow(
        "You are setting a heading for a list, that requires a heading level. Please use 'as' prop to set a proper heading level.",
      )
    })
  })
  it('should render the ActionList.GroupHeading component as a span (not a heading tag) when role is specified as listbox', async () => {
    HTMLRender(
      <ActionList role="listbox">
        <ActionList.Heading as="h1">Heading</ActionList.Heading>
        <ActionList.Group>
          <ActionList.GroupHeading>Group Heading</ActionList.GroupHeading>
        </ActionList.Group>
      </ActionList>,
    )
    const label = page.getByText('Group Heading', {exact: true})
    await expect.element(label).toBeInTheDocument()
    expect(label.element().tagName).toEqual('SPAN')
  })
  it('should render the ActionList.GroupHeading component as a span with role="presentation" and aria-hidden="true" when role is specified as listbox', async () => {
    HTMLRender(
      <ActionList role="listbox">
        <ActionList.Heading as="h1">Heading</ActionList.Heading>
        <ActionList.Group>
          <ActionList.GroupHeading>Group Heading</ActionList.GroupHeading>
        </ActionList.Group>
      </ActionList>,
    )
    const label = page.getByText('Group Heading', {exact: true})
    const wrapper = label.element().parentElement
    expect(wrapper).toHaveAttribute('role', 'presentation')
    expect(wrapper).toHaveAttribute('aria-hidden', 'true')
  })
  it('should label the list with the group heading id', async () => {
    const {container} = HTMLRender(
      <ActionList>
        <ActionList.Heading as="h1">Heading</ActionList.Heading>
        <ActionList.Group data-test-id="ActionList.Group">
          <ActionList.GroupHeading as="h2">Group Heading</ActionList.GroupHeading>
          <ActionList.Item>Item</ActionList.Item>
        </ActionList.Group>
      </ActionList>,
    )
    const list = container.querySelector(`li[data-test-id='ActionList.Group'] > ul`)
    const heading = page.getByText('Group Heading', {exact: true})
    expect(list).toHaveAttribute('aria-labelledby', heading.element().id)
  })
  it('should NOT label the list with the group heading id when role is specified', async () => {
    const {container} = HTMLRender(
      <ActionList role="listbox">
        <ActionList.Heading as="h1">Heading</ActionList.Heading>
        <ActionList.Group data-test-id="ActionList.Group">
          <ActionList.GroupHeading>Group Heading</ActionList.GroupHeading>
          <ActionList.Item>Item</ActionList.Item>
        </ActionList.Group>
      </ActionList>,
    )
    const list = container.querySelector(`li[data-test-id='ActionList.Group'] > ul`)
    const heading = page.getByText('Group Heading', {exact: true})
    expect(list).not.toHaveAttribute('aria-labelledby', heading.element().id)
  })

  it('should label the list with aria-label if it is specified', async () => {
    const {container} = HTMLRender(
      <ActionList>
        <ActionList.Heading as="h1">Heading</ActionList.Heading>
        <ActionList.Group aria-label="Animals" data-test-id="ActionList.Group">
          <ActionList.Item>Item</ActionList.Item>
        </ActionList.Group>
      </ActionList>,
    )
    const list = container.querySelector(`li[data-test-id='ActionList.Group'] > ul`)
    expect(list).toHaveAttribute('aria-label', 'Animals')
  })

  describe('GroupHeading.TrailingAction (behind feature flag)', () => {
    it('renders GroupHeading.TrailingAction as a sibling of the heading element when the feature flag is enabled', async () => {
      HTMLRender(
        <FeatureFlags flags={{primer_react_action_list_group_heading_trailing_action: true}}>
          <ActionList>
            <ActionList.Heading as="h1">Heading</ActionList.Heading>
            <ActionList.Group>
              <ActionList.GroupHeading as="h2">
                Group Heading
                <ActionList.GroupHeading.TrailingAction label="New field" icon={PlusIcon} />
              </ActionList.GroupHeading>
              <ActionList.Item>Item</ActionList.Item>
            </ActionList.Group>
          </ActionList>
        </FeatureFlags>,
      )

      const heading = page.getByRole('heading', {level: 2})
      const button = page.getByRole('button', {name: 'New field', exact: true})

      // The button must NOT be inside the heading element
      await expect.element(heading).not.toContainElement(button.element())
      // The heading text should not include the button's accessible name
      await expect.element(heading).toHaveTextContent('Group Heading')
      expect(heading.element().textContent).not.toContain('New field')
      // The button should be inside the same wrapper as the heading
      expect(heading.element().parentElement).toContainElement(button.element())
    })

    it('passes GroupHeading.TrailingAction through as a child of the heading when the feature flag is disabled', async () => {
      HTMLRender(
        <ActionList>
          <ActionList.Heading as="h1">Heading</ActionList.Heading>
          <ActionList.Group>
            <ActionList.GroupHeading as="h2">
              Group Heading
              <ActionList.GroupHeading.TrailingAction label="New field" icon={PlusIcon} />
            </ActionList.GroupHeading>
            <ActionList.Item>Item</ActionList.Item>
          </ActionList.Group>
        </ActionList>,
      )

      const heading = page.getByRole('heading', {level: 2})
      const button = page.getByRole('button', {name: 'New field', exact: true})

      // Without the flag, the slot is not consumed: the button passes
      // through and still renders inside the heading element.
      await expect.element(heading).toContainElement(button.element())
    })

    it('throws when GroupHeading.TrailingAction is used inside an ActionMenu (menu role) and the feature flag is enabled', () => {
      withExpectedConsoleError(() => {
        expect(() =>
          HTMLRender(
            <FeatureFlags flags={{primer_react_action_list_group_heading_trailing_action: true}}>
              <BaseStyles>
                <ActionMenu open={true}>
                  <ActionMenu.Button>Trigger</ActionMenu.Button>
                  <ActionMenu.Overlay>
                    <ActionList>
                      <ActionList.Group>
                        <ActionList.GroupHeading>
                          Group Heading
                          <ActionList.GroupHeading.TrailingAction label="New field" icon={PlusIcon} />
                        </ActionList.GroupHeading>
                      </ActionList.Group>
                    </ActionList>
                  </ActionMenu.Overlay>
                </ActionMenu>
              </BaseStyles>
            </FeatureFlags>,
          ),
        ).toThrow(/can not be used inside an ActionList with an ARIA role of "menu"/)
      })
    })

    it('throws when GroupHeading.TrailingAction is used inside a listbox role and the feature flag is enabled', () => {
      withExpectedConsoleError(() => {
        expect(() =>
          HTMLRender(
            <FeatureFlags flags={{primer_react_action_list_group_heading_trailing_action: true}}>
              <ActionList role="listbox">
                <ActionList.Group>
                  <ActionList.GroupHeading>
                    Group Heading
                    <ActionList.GroupHeading.TrailingAction label="New field" icon={PlusIcon} />
                  </ActionList.GroupHeading>
                </ActionList.Group>
              </ActionList>
            </FeatureFlags>,
          ),
        ).toThrow(/can not be used inside an ActionList with an ARIA role of "listbox"/)
      })
    })
  })
})
