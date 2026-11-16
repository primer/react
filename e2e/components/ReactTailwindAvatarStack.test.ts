import {expect, test} from '@playwright/test'
import {visit} from '../test-helpers/storybook'

test('preserves mixed avatar shapes and stack overrides', async ({page}) => {
  await visit(page, {id: 'react-tailwind-display-avatarstack-features--mixed-avatar-shapes'})

  const cases = [
    {stack: 'direct-square-first', avatars: ['Direct team first', 'Direct person second'], radii: ['4px', '50%']},
    {stack: 'direct-square-second', avatars: ['Direct person first', 'Direct team second'], radii: ['50%', '4px']},
    {stack: 'wrapped-square-first', avatars: ['Wrapped team first', 'Wrapped person second'], radii: ['4px', '50%']},
    {stack: 'wrapped-square-second', avatars: ['Wrapped person first', 'Wrapped team second'], radii: ['50%', '4px']},
    {
      stack: 'wrapper-default-shape',
      avatars: ['Person before default team', 'Team with wrapper default'],
      radii: ['50%', '4px'],
    },
    {stack: 'square-stack', avatars: ['Direct stack override', 'Wrapped stack override'], radii: ['4px', '4px']},
  ]

  for (const {stack, avatars, radii} of cases) {
    for (const [index, name] of avatars.entries()) {
      const avatar = page.getByTestId(stack).getByRole('img', {name, exact: true})
      await expect(avatar).toHaveCSS('border-top-left-radius', radii[index])
      await expect(avatar).toHaveCSS('width', '16px')
      await expect(avatar).toHaveCSS('height', '16px')
    }
  }

  for (const name of ['Wrapper team first', 'Wrapper person', 'Wrapper app last']) {
    const avatar = page.getByTestId('wrapper-forwarded-defaults').getByRole('img', {name, exact: true})
    await expect(avatar).toHaveCSS('border-top-left-radius', '50%')
    await expect(avatar).toHaveCSS('width', '20px')
    await expect(avatar).not.toHaveAttribute('data-square')
  }
  for (const name of ['Square stack team first', 'Square stack person', 'Square stack app last']) {
    const avatar = page.getByTestId('wrapper-stack-override').getByRole('img', {name, exact: true})
    await expect(avatar).toHaveCSS('border-top-left-radius', '4px')
    await expect(avatar).toHaveCSS('width', '16px')
    await expect(avatar).toHaveAttribute('data-square', '')
  }

  const linked = page.getByTestId('linked-shapes')
  await expect(linked.getByRole('link', {name: 'Team profile'})).toHaveCSS('border-top-left-radius', '0px')
  await expect(linked.getByRole('link', {name: 'Person profile'})).toHaveCSS('border-top-left-radius', '50%')
  const custom = page.getByTestId('custom-shapes')
  await expect(custom.getByRole('link', {name: 'Team with shape prop'})).toHaveCSS('border-top-left-radius', '0px')
  await expect(custom.getByRole('link', {name: 'Person with custom wrapper shape'})).toHaveCSS(
    'border-top-left-radius',
    '0px',
  )
  for (const name of ['Plain person first', 'Plain person second']) {
    await expect(page.getByTestId('plain-images').getByRole('img', {name})).toHaveCSS('border-top-left-radius', '50%')
  }
})
