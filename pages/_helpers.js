import React from 'react'
import {Avatar, Heading, Text} from '../src'

// Next.js needs this?
export default () => {}

export function GitHubAvatar({username, size = 20, ...rest}) {
  return (
    <Avatar
      src={`https://avatars.githubusercontent.com/${username}?v=3&s=${size * 2}`}
      size={size}
      {...rest}
    />
  )
}

export function ExampleHeading(props) {
  return (
    <Heading tag='h3' fontSize={3} mb={2} {...props} />
  )
}

export function Swatch({name, index, color, ...rest}) {
  return (
    <div {...rest}>
      <div className='m-1 mt-3 p-6' style={{background: color}} />
      <Heading tag='h3' fontSize={2} px={1}>
        {name}.{index}
      </Heading>
      <Text px={1}>
        {color}
      </Text>
    </div>
  )
}
