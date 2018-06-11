import {Avatar, Heading} from '../src'

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

