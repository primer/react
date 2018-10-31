
# Avatar

Avatars are images used to represent users and organizations on GitHub. They typically are squares with rounded edges.

## Default example

```.jsx
<Avatar src="https://avatars.githubusercontent.com/primer" size={128} />

<Text is='p'>To create a Parent + Child avatar, wrap Avatars in Avatar.Parent and use Avatar.Child for the smaller Avatar</Text>

 <Avatar.Parent my={4}>
  <Avatar src="https://avatars.githubusercontent.com/primer" size={48} />
  <Avatar.Child src="https://avatars.githubusercontent.com/primer" size={20} />
 </Avatar.Parent>
```

## System props

Avatar components get `COMMON` system props. Read our [System Props](/components/docs/system-props) doc page for a full list of available props.

## Component props

| Name | Type | Default | Description |
| :- | :- | :-: | :- |
| alt | String | | Passed through to alt on img tag |
| isChild | Boolean | | adds the `avatar-child` class if present |
| size | Number | 20 | adds the `avatar-small` class if less than 24 |
| src | String | | The source url of the avatar image |

export const meta = {
  displayName: 'Avatar'
}
