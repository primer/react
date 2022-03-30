import React from 'react'
import {Meta} from '@storybook/react'
import {SmileyIcon, KebabHorizontalIcon} from '@primer/octicons-react'
import {createGlobalStyle} from 'styled-components'
import {BaseStyles, Box, ThemeProvider, Text, IconButton, PageLayout, Heading} from '..'
import {useAnchoredPosition} from '../hooks'

export default {
  title: 'Behaviors/anchoredPosition',
  decorators: [
    // Note: For some reason, if you use <BaseStyles><Story /></BaseStyles>,
    // the component gets unmounted from the root every time a control changes!
    Story => {
      return (
        <ThemeProvider>
          <BaseStyles>{Story()}</BaseStyles>
        </ThemeProvider>
      )
    }
  ]
} as Meta

export const BoundaryCollisions = () => {
  const reactionButtonRef = React.useRef<HTMLButtonElement>(null)
  const reactionTooltipRef = React.useRef<HTMLDivElement>(null)

  const {position: reactionTooltipPosition} = useAnchoredPosition({
    side: 'outside-bottom',
    align: 'start',
    anchorElementRef: reactionButtonRef,
    floatingElementRef: reactionTooltipRef
  })

  const optionsButtonRef = React.useRef<HTMLButtonElement>(null)
  const optionsTooltipRef = React.useRef<HTMLDivElement>(null)
  const {position: optionsTooltipPosition} = useAnchoredPosition({
    side: 'outside-bottom',
    align: 'start',
    anchorElementRef: optionsButtonRef,
    floatingElementRef: optionsTooltipRef
  })

  return (
    <>
      <PageLayout padding="none">
        <PageLayout.Header>
          <Box>
            <Heading as="h1" sx={{fontWeight: 'normal'}}>
              Input validation styles <Text sx={{color: 'fg.muted', fontWeight: 'light'}}>#1831</Text>
            </Heading>
            <Box sx={{display: 'flex', gap: 2, alignItems: 'center'}}></Box>
          </Box>
        </PageLayout.Header>
        <PageLayout.Content>
          <Box
            sx={{border: '1px solid', borderRadius: 2, borderColor: 'border.default', height: 200, overflow: 'hidden'}}
          >
            <Box
              sx={{
                backgroundColor: 'canvas.inset',
                padding: 1,
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center'
              }}
            >
              <IconButton
                ref={reactionButtonRef}
                icon={SmileyIcon}
                variant="invisible"
                aria-label="Add your reaction"
                sx={{backgroundColor: 'btn.activeBg', mr: 2}}
              />

              <Box
                ref={reactionTooltipRef}
                sx={{
                  backgroundColor: 'neutral.emphasisPlus',
                  color: 'fg.onEmphasis',
                  borderRadius: 1,
                  fontSize: 0,
                  paddingY: 1,
                  paddingX: 2,
                  position: 'absolute',
                  top: reactionTooltipPosition?.top,
                  left: reactionTooltipPosition?.left
                }}
              >
                Add reaction
              </Box>

              <IconButton icon={KebabHorizontalIcon} variant="invisible" aria-label="Show options" />
            </Box>
          </Box>
        </PageLayout.Content>
        <PageLayout.Pane>
          <Box sx={{display: 'flex', flexDirection: 'column', gap: 3}}>
            <Box>
              <Text sx={{fontSize: 0, fontWeight: 'bold', display: 'block', color: 'fg.muted'}}>Assignees</Text>
              <Text sx={{fontSize: 0, color: 'fg.muted', lineHeight: 'condensed'}}>No one – assign yourself</Text>
            </Box>
            <Box role="separator" sx={{width: '100%', height: 1, backgroundColor: 'border.default'}}></Box>
            <Box>
              <Text sx={{fontSize: 0, fontWeight: 'bold', display: 'block', color: 'fg.muted'}}>Labels</Text>
              <Text sx={{fontSize: 0, color: 'fg.muted', lineHeight: 'condensed'}}>None yet</Text>
            </Box>
          </Box>
        </PageLayout.Pane>
      </PageLayout>

      <PageLayout>
        <PageLayout.Header>
          <Box>
            <Heading as="h1" sx={{fontWeight: 'normal'}}>
              Input validation styles <Text sx={{color: 'fg.muted', fontWeight: 'light'}}>#1831</Text>
            </Heading>
            <Box sx={{display: 'flex', gap: 2, alignItems: 'center'}}></Box>
          </Box>
        </PageLayout.Header>
        <PageLayout.Content>
          <Box
            sx={{border: '1px solid', borderRadius: 2, borderColor: 'border.default', height: 200, overflow: 'hidden'}}
          >
            <Box
              sx={{
                backgroundColor: 'canvas.inset',
                padding: 1,
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center'
              }}
            >
              <IconButton icon={SmileyIcon} variant="invisible" aria-label="Add your reaction" sx={{mr: 2}} />

              <IconButton
                ref={optionsButtonRef}
                icon={KebabHorizontalIcon}
                variant="invisible"
                aria-label="Show options"
                sx={{backgroundColor: 'btn.activeBg'}}
              />

              <Box
                ref={optionsTooltipRef}
                sx={{
                  backgroundColor: 'neutral.emphasisPlus',
                  color: 'fg.onEmphasis',
                  borderRadius: 1,
                  fontSize: 0,
                  paddingY: 1,
                  paddingX: 2,
                  position: 'absolute',
                  top: optionsTooltipPosition?.top,
                  left: optionsTooltipPosition?.left
                }}
              >
                Add reaction
              </Box>
            </Box>
          </Box>
        </PageLayout.Content>
        <PageLayout.Pane>
          <Box sx={{display: 'flex', flexDirection: 'column', gap: 3}}>
            <Box>
              <Text sx={{fontSize: 0, fontWeight: 'bold', display: 'block', color: 'fg.muted'}}>Assignees</Text>
              <Text sx={{fontSize: 0, color: 'fg.muted', lineHeight: 'condensed'}}>No one – assign yourself</Text>
            </Box>
            <Box role="separator" sx={{width: '100%', height: 1, backgroundColor: 'border.default'}}></Box>
            <Box>
              <Text sx={{fontSize: 0, fontWeight: 'bold', display: 'block', color: 'fg.muted'}}>Labels</Text>
              <Text sx={{fontSize: 0, color: 'fg.muted', lineHeight: 'condensed'}}>None yet</Text>
            </Box>
          </Box>
        </PageLayout.Pane>
      </PageLayout>
    </>
  )
}
