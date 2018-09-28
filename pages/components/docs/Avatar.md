
# Avatar

Avatars are images used to represent users and organizations on GitHub. They typically are squares with rounded edges.

## Default example

```.jsx
<Avatar src="https://avatars.githubusercontent.com/primer" size={128} />
```

## System props

Avatar components get `COMMON` system props. Read our [System Props](/system-props) doc page for a full list of available props.

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
