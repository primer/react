
# Avatar

Avatars are images that users can set as their profile picture. On GitHub, they're always going to be rounded squares. They can be custom photos, uploaded by users, or generated as Identicons as a placeholder.

## Default example

```.jsx
<Avatar src="https://avatars.githubusercontent.com/primer?v=3&s=128" size={128} />
```

## System props

Avatar components get `COMMON` system props. Read our [System Props](/system-props) doc page for a full list of available props.

## Component props

| Prop name | Type | Description
| :- | :- | :- |
| alt | String | Passed through to alt on img tag
| isChild | Boolean | adds the `avatar-child` class if present
| size | Number | default: 20, adds the `avatar-small` class if less than 24
| src | String | The source url of the avatar image

export const meta = {
  displayName: 'Avatar'
}
