import React from 'react'
import {ButtonInvisible, Text} from '..'
import {Emoji} from './EmojiPicker'

interface EmojiProps {
  emoji: Emoji
  onClick: (emoji: Emoji) => void
}

const EmojiComponent: React.VFC<EmojiProps> = ({emoji, onClick}) => {
  return (
    <ButtonInvisible
      sx={{p: '8px', borderRadius: 'radii.3', flex: 1, color: 'fg.default'}}
      onClick={() => onClick(emoji)}
    >
      <Text key={`emoji-${emoji.emoji}`} sx={{fontSize: 3}}>
        {emoji.emoji}
      </Text>
    </ButtonInvisible>
  )
}

export default EmojiComponent
