import {ActionBar} from './ActionBar'
export default {title: 'Data/ActionBar', component: ActionBar}
export const Default = () => (
  <ActionBar aria-label="File actions">
    <ActionBar.Button>Copy</ActionBar.Button>
    <ActionBar.Button>Move</ActionBar.Button>
    <ActionBar.Divider />
    <ActionBar.Menu aria-label="More actions" items={[{label: 'Delete'}]} />
  </ActionBar>
)
