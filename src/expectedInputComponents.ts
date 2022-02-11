/*
If we don't import `default` directly, Jest throws an error:
`TypeError: Cannot read property 'default' of undefined`
*/

import Autocomplete from './Autocomplete'
import Checkbox from './Checkbox'
import Radio from './Radio'
import Select from './Select'
import TextInput from './TextInput'
import TextInputWithTokens from './TextInputWithTokens'
import Textarea from './Textarea'

export const expectedInputComponents = [Autocomplete, Checkbox, Radio, Select, TextInput, TextInputWithTokens, Textarea]
