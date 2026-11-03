import {runCommand, runMain} from 'citty'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {list as listComponents} from './commands/components/list'
import {get as getComponent} from './commands/components/get'
import {get as getExamples} from './commands/components/examples/get'
import {get as getUsage} from './commands/components/usage/get'
import {get as getAccessibility} from './commands/components/accessibility/get'
import {get as getColor} from './commands/guidelines/color/get'
import {get as getTypography} from './commands/guidelines/typography/get'
import {get as getCoding} from './commands/guidelines/coding/get'
import {list as listPatterns} from './commands/patterns/list'
import {get as getPattern} from './commands/patterns/get'
import {list as listScenarios} from './commands/scenarios/list'
import {get as getScenario} from './commands/scenarios/get'
import {list as listTokens} from './commands/tokens/list'
import {get as getToken} from './commands/tokens/get'
import {search as searchTokens} from './commands/tokens/search'
import {list as listGroups} from './commands/tokens/group/list'
import {specs} from './commands/tokens/specs'
import {get as getTokenUsage} from './commands/tokens/usage/get'
import './index'

vi.mock(import('citty'), async importOriginal => {
  const original = await importOriginal()
  return {
    ...original,
    runMain: vi.fn(),
  }
})

const [main] = vi.mocked(runMain).mock.calls[0]
const routes = [
  {
    path: 'components list',
    command: listComponents,
    args: ['--json', '--limit', '2'],
  },
  {
    path: 'components get',
    command: getComponent,
    args: ['Button'],
  },
  {
    path: 'components examples get',
    command: getExamples,
    args: ['Button'],
  },
  {
    path: 'components usage get',
    command: getUsage,
    args: ['Button'],
  },
  {
    path: 'components accessibility get',
    command: getAccessibility,
    args: ['Button'],
  },
  {
    path: 'guidelines color get',
    command: getColor,
    args: [],
  },
  {
    path: 'guidelines typography get',
    command: getTypography,
    args: [],
  },
  {
    path: 'guidelines coding get',
    command: getCoding,
    args: [],
  },
  {
    path: 'patterns list',
    command: listPatterns,
    args: ['--json'],
  },
  {
    path: 'patterns get',
    command: getPattern,
    args: ['data-visualization'],
  },
  {
    path: 'scenarios list',
    command: listScenarios,
    args: ['--json'],
  },
  {
    path: 'scenarios get',
    command: getScenario,
    args: ['create'],
  },
  {
    path: 'tokens list',
    command: listTokens,
    args: ['--json'],
  },
  {
    path: 'tokens get',
    command: getToken,
    args: ['--json', '--', '--bgColor-default'],
  },
  {
    path: 'tokens search',
    command: searchTokens,
    args: ['body medium', '--group', 'typography'],
  },
  {
    path: 'tokens group list',
    command: listGroups,
    args: ['control', 'button', '--json'],
  },
  {
    path: 'tokens specs',
    command: specs,
    args: [],
  },
  {
    path: 'tokens usage get',
    command: getTokenUsage,
    args: [],
  },
]

describe('CLI routing', () => {
  beforeEach(() => {
    for (const {command} of routes) {
      vi.spyOn(command, 'run').mockImplementation(() => {})
    }
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it.each(routes)('dispatches $path to its leaf command', async ({path, command, args}) => {
    await runCommand(main, {
      rawArgs: [...path.split(' '), ...args],
    })

    expect(command.run).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        rawArgs: args,
      }),
    )
  })
})
