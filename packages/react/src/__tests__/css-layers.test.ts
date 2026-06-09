import fs from 'node:fs'
import path from 'node:path'
import {generate, parse} from 'css-tree'
import type {StyleSheet} from 'css-tree'
import {describe, expect, test} from 'vitest'

const allowlist = new Set([
  path.resolve(import.meta.dirname, '../Avatar/Avatar.module.css'),
  path.resolve(import.meta.dirname, '../AvatarStack/AvatarStack.module.css'),
  path.resolve(import.meta.dirname, '../BaseStyles.module.css'),
  path.resolve(import.meta.dirname, '../BranchName/BranchName.module.css'),
  path.resolve(import.meta.dirname, '../ButtonGroup/ButtonGroup.module.css'),
  path.resolve(import.meta.dirname, '../Card/Card.module.css'),
  path.resolve(import.meta.dirname, '../Checkbox/Checkbox.module.css'),
  path.resolve(import.meta.dirname, '../Checkbox/shared.module.css'),
  path.resolve(import.meta.dirname, '../CircleBadge/CircleBadge.module.css'),
  path.resolve(import.meta.dirname, '../deprecated/FilteredSearch/FilteredSearch.module.css'),
  path.resolve(import.meta.dirname, '../deprecated/UnderlineNav/UnderlineNav.module.css'),
  path.resolve(import.meta.dirname, '../Details/Details.module.css'),
  path.resolve(import.meta.dirname, '../experimental/CSSComponent/component.module.css'),
  path.resolve(import.meta.dirname, '../experimental/UnderlinePanels/UnderlinePanels.module.css'),
  path.resolve(import.meta.dirname, '../Flash/Flash.module.css'),
  path.resolve(import.meta.dirname, '../Header/Header.module.css'),
  path.resolve(import.meta.dirname, '../Heading/Heading.module.css'),
  path.resolve(import.meta.dirname, '../Hidden/Hidden.module.css'),
  path.resolve(import.meta.dirname, '../InlineMessage/InlineMessage.module.css'),
  path.resolve(import.meta.dirname, '../internal/components/ButtonReset.module.css'),
  path.resolve(import.meta.dirname, '../internal/components/Caret.module.css'),
  path.resolve(import.meta.dirname, '../internal/components/InputLabel.module.css'),
  path.resolve(import.meta.dirname, '../internal/components/InputValidation.module.css'),
  path.resolve(import.meta.dirname, '../internal/components/TextInputInnerAction.module.css'),
  path.resolve(import.meta.dirname, '../internal/components/TextInputInnerVisualSlot.module.css'),
  path.resolve(import.meta.dirname, '../internal/components/TextInputWrapper.module.css'),
  path.resolve(import.meta.dirname, '../internal/components/UnderlineTabbedInterface.module.css'),
  path.resolve(import.meta.dirname, '../internal/components/UnstyledTextInput.module.css'),
  path.resolve(import.meta.dirname, '../internal/components/ValidationAnimationContainer.module.css'),
  path.resolve(import.meta.dirname, '../Label/Label.module.css'),
  path.resolve(import.meta.dirname, '../Link/Link.module.css'),
  path.resolve(import.meta.dirname, '../Overlay/Overlay.module.css'),
  path.resolve(import.meta.dirname, '../Pagehead/Pagehead.module.css'),
  path.resolve(import.meta.dirname, '../PageHeader/PageHeader.module.css'),
  path.resolve(import.meta.dirname, '../Pagination/Pagination.module.css'),
  path.resolve(import.meta.dirname, '../Placeholder.module.css'),
  path.resolve(import.meta.dirname, '../Popover/Popover.module.css'),
  path.resolve(import.meta.dirname, '../ProgressBar/ProgressBar.module.css'),
  path.resolve(import.meta.dirname, '../Radio/Radio.module.css'),
  path.resolve(import.meta.dirname, '../PageLayout/PageLayout.module.css'),
  path.resolve(import.meta.dirname, '../ScrollableRegion/ScrollableRegion.module.css'),
  path.resolve(import.meta.dirname, '../Select/Select.module.css'),
  path.resolve(import.meta.dirname, '../SideNav.module.css'),
  path.resolve(import.meta.dirname, '../Skeleton/SkeletonBox.module.css'),
  path.resolve(import.meta.dirname, '../SkeletonAvatar/SkeletonAvatar.module.css'),
  path.resolve(import.meta.dirname, '../SkeletonText/SkeletonText.module.css'),
  path.resolve(import.meta.dirname, '../Stack/Stack.module.css'),
  path.resolve(import.meta.dirname, '../StateLabel/StateLabel.module.css'),
  path.resolve(import.meta.dirname, '../SubNav/SubNav.module.css'),
  path.resolve(import.meta.dirname, '../TabNav/TabNav.module.css'),
  path.resolve(import.meta.dirname, '../Text/Text.module.css'),
  path.resolve(import.meta.dirname, '../Timeline/Timeline.module.css'),
  path.resolve(import.meta.dirname, '../Tooltip/Tooltip.module.css'),
  path.resolve(import.meta.dirname, '../TopicTag/TopicTag.module.css'),
  path.resolve(import.meta.dirname, '../TopicTag/TopicTagGroup.module.css'),
  path.resolve(import.meta.dirname, '../Truncate/Truncate.module.css'),
  path.resolve(import.meta.dirname, '../deprecated/ActionList/Divider.module.css'),
  path.resolve(import.meta.dirname, '../deprecated/ActionList/Header.module.css'),
  path.resolve(import.meta.dirname, '../deprecated/ActionList/Item.module.css'),
  path.resolve(import.meta.dirname, '../deprecated/ActionList/List.module.css'),
  path.resolve(import.meta.dirname, '../VisuallyHidden/VisuallyHidden.module.css'),
  path.resolve(import.meta.dirname, '../_VisuallyHidden.module.css'),
  path.resolve(import.meta.dirname, '../CounterLabel/CounterLabel.module.css'),
  path.resolve(import.meta.dirname, '../DataTable/Pagination.module.css'),
  path.resolve(import.meta.dirname, '../DataTable/Table.module.css'),
  path.resolve(import.meta.dirname, '../internal/components/CheckboxOrRadioGroup/CheckboxOrRadioGroup.module.css'),
  path.resolve(import.meta.dirname, '../KeybindingHint/KeybindingHint.module.css'),
  path.resolve(import.meta.dirname, '../KeybindingHint/components/Chord.module.css'),
  path.resolve(import.meta.dirname, '../Spinner/Spinner.module.css'),
  path.resolve(import.meta.dirname, '../Textarea/TextArea.module.css'),
  path.resolve(import.meta.dirname, '../TextInput/TextInput.module.css'),
  path.resolve(import.meta.dirname, '../ToggleSwitch/ToggleSwitch.module.css'),
  path.resolve(import.meta.dirname, '../Token/IssueLabelToken.module.css'),
  path.resolve(import.meta.dirname, '../Token/Token.module.css'),
  path.resolve(import.meta.dirname, '../Token/TokenBase.module.css'),
  path.resolve(import.meta.dirname, '../Token/_RemoveTokenButton.module.css'),
  path.resolve(import.meta.dirname, '../Token/_TokenTextContainer.module.css'),
  path.resolve(import.meta.dirname, '../TextInputWithTokens/TextInputWithTokens.module.css'),
  path.resolve(import.meta.dirname, '../TooltipV2/Tooltip.module.css'),
  path.resolve(import.meta.dirname, '../Button/ButtonBase.module.css'),
  path.resolve(import.meta.dirname, '../ActionList/ActionList.module.css'),
  path.resolve(import.meta.dirname, '../ActionList/Group.module.css'),
  path.resolve(import.meta.dirname, '../ActionList/Heading.module.css'),
])
const files = Array.from(allowlist).map(file => {
  return [path.relative(path.resolve(import.meta.dirname, '..'), file), file]
})

const CSS_LAYER_REGEX = /^primer\.components\.[A-Z][A-Za-z0-9]+$/

describe('CSS Layers', () => {
  describe.each(files)('%s', (_name, filename) => {
    const contents = fs.readFileSync(filename, 'utf8')
    const ast = parse(contents, {
      filename,
    }) as StyleSheet

    test('uses CSS Layer', () => {
      const first = ast.children.first

      expect(first?.type).toBe('Atrule')
      if (!first || first.type !== 'Atrule') throw new Error('Expected stylesheet to start with an @layer at-rule')

      expect(first.name).toBe('layer')
    })

    test('CSS Layer matches naming conventions', () => {
      const first = ast.children.first

      expect(first?.type).toBe('Atrule')
      if (!first || first.type !== 'Atrule') throw new Error('Expected stylesheet to start with an @layer at-rule')

      const layerName = first.prelude ? generate(first.prelude).trim() : ''
      expect(layerName).toMatch(CSS_LAYER_REGEX)
    })
  })
})
