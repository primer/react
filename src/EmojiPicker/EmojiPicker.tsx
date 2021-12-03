import {
  ClockIcon,
  GlobeIcon,
  HeartIcon,
  ImageIcon,
  LightBulbIcon,
  LocationIcon,
  OrganizationIcon,
  SmileyIcon,
  SquirrelIcon
} from '@primer/octicons-react'
import React, {useEffect, useRef, useState} from 'react'
import {Box, Button, ButtonInvisible, StyledOcticon, Text, TextInput} from '..'
import {AnchoredOverlay} from '../AnchoredOverlay'
import emojis from './data'
import styled from 'styled-components'
import {get} from '../constants'

export interface EmojiPickerProps {
  customCategories?: Array<EmojiCategory>
  onSelect?: (emoji: string) => void
}

export interface Emoji {
  name: string
  emoji: string
}

export interface EmojiCategory {
  id: number | string
  name: string
  categoryIcon: React.ReactNode
  emojis: Array<Emoji>
}

const CategoryButton = styled(ButtonInvisible)`
  color: ${get('colors.fg.muted')};
  background-color: transparent;
  border: 0;
  border-radius: ${get('radii.2')};
  box-shadow: none;
  padding: 8px;
  flex: 1;
`

const EmojiPicker = ({customCategories, onSelect}: EmojiPickerProps) => {
  const emojiAnchor = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [frequentEmojis, setFrequentEmojis] = useState<Array<Emoji>>([])

  useEffect(() => {
    if (isOpen) {
      const lsEmojis = JSON.parse(localStorage.getItem('frequentEmojis') ?? '[]')
      if (lsEmojis) {
        setFrequentEmojis(lsEmojis)
      }
    }
  }, [isOpen])

  const onEmojiClick = (emoji: Emoji) => {
    onSelect?.(emoji.emoji)
    setIsOpen(false)
  }

  return (
    <>
      <Button ref={emojiAnchor} onClick={() => setIsOpen(!isOpen)}>
        <StyledOcticon icon={SmileyIcon} />
      </Button>
      <AnchoredOverlay anchorRef={emojiAnchor} renderAnchor={null} open={isOpen} height={'large'} width={'medium'}>
        <Box sx={{display: 'flex', flex: 1, flexDirection: 'column', height: '100%'}}>
          <Box sx={{display: 'flex', flex: 1, flexDirection: 'row', width: '100%'}}>
            {frequentEmojis.length > 0 && (
              <CategoryButton>
                <StyledOcticon icon={ClockIcon} color="fg.muted" />
              </CategoryButton>
            )}
            {customCategories?.map(category => {
              if (category.emojis.length > 0)
                return <CategoryButton key={category.id}>{category.categoryIcon}</CategoryButton>
            })}
            <CategoryButton>
              <SmileyIcon />
            </CategoryButton>
            <CategoryButton>
              <SquirrelIcon />
            </CategoryButton>
            <CategoryButton>
              <StyledOcticon icon={ImageIcon} color="fg.muted" />
            </CategoryButton>
            <CategoryButton>
              <StyledOcticon icon={GlobeIcon} color="fg.muted" />
            </CategoryButton>
            <CategoryButton>
              <StyledOcticon icon={OrganizationIcon} color="fg.muted" />
            </CategoryButton>
            <CategoryButton>
              <StyledOcticon icon={LightBulbIcon} color="fg.muted" />
            </CategoryButton>
            <CategoryButton>
              <StyledOcticon icon={HeartIcon} color="fg.muted" />
            </CategoryButton>
            <CategoryButton>
              <StyledOcticon icon={LocationIcon} color="fg.muted" />
            </CategoryButton>
          </Box>
          <TextInput block width="auto" color="fg.default" />
          <Box sx={{overflow: 'auto', display: 'flex', flexDirection: 'column', width: '100%', height: '100%', p: 2}}>
            {frequentEmojis.length > 0 && (
              <Box key="frequently-used">
                <Text sx={{fontSize: 0, color: 'fg.muted'}}>Frequently Used</Text>
                <Box sx={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%'}}>
                  {frequentEmojis.map(emoji => (
                    <Text key={`emoji-${emoji.emoji}`} sx={{p: '10px', borderRadius: 'radii.3', flex: 1}}>
                      {emoji.emoji}
                    </Text>
                  ))}
                </Box>
              </Box>
            )}
            {customCategories?.map(category => {
              if (category.emojis.length > 0)
                return (
                  <Box key={`category-section-${category.id}`}>
                    <Text sx={{fontSize: 0, color: 'fg.muted'}}>{category.name}</Text>
                    <Box sx={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%'}}>
                      {category.emojis.map(emoji => (
                        <ButtonInvisible
                          key={`emoji-${emoji.emoji}`}
                          sx={{p: '10px', borderRadius: 'radii.3', flex: 1, color: 'fg.muted'}}
                          onClick={() => onEmojiClick(emoji)}
                        >
                          <Text key={`emoji-${emoji.emoji}`} sx={{p: '10px', borderRadius: 'radii.3', flex: 1}}>
                            {emoji.emoji}
                          </Text>
                        </ButtonInvisible>
                      ))}
                    </Box>
                  </Box>
                )
            })}
            {emojis.map(category => (
              <Box key={category.id}>
                <Text sx={{fontSize: 0, color: 'fg.muted'}}>{category.name}</Text>
                <Box sx={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%'}}>
                  {category.emojis.map(emoji => (
                    <ButtonInvisible
                      key={`emoji-${emoji.emoji}`}
                      sx={{p: '10px', borderRadius: 'radii.3', flex: 1, color: 'fg.muted'}}
                      onClick={() => onEmojiClick(emoji)}
                    >
                      <Text key={`emoji-${emoji.emoji}`}>{emoji.emoji}</Text>
                    </ButtonInvisible>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </AnchoredOverlay>
    </>
  )
}

export default EmojiPicker
