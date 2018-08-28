import {BorderBox} from '../../src'


```.jsx
<BorderBox>This is a BorderBox</BorderBox>
<BorderBox p={2}>This is a BorderBox with padding.</BorderBox>
<BorderBox boxShadow="small" m={4} p={2}>This is a BorderBox with shadow.</BorderBox>
<BorderBox boxShadow="medium" m={4} p={2}>This is a BorderBox with a medium shadow.</BorderBox>
<BorderBox boxShadow="large" m={4} p={2}>This is a BorderBox with a large shadow.</BorderBox>
<BorderBox boxShadow="extra-large" m={4} p={2}>This is a BorderBox with an extra-large shadow.</BorderBox>
<BorderBox borderColor="green.5" p={2}>This is a BorderBox with a green border.</BorderBox>
```
export const meta = { displayName: 'BorderBox'}
