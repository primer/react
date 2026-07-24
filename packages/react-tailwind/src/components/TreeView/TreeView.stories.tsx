import {TreeView} from './TreeView'
export default {title: 'Navigation/TreeView', component: TreeView}
export const Default = () => (
  <TreeView aria-label="Files">
    <TreeView.Item id="src" defaultExpanded subtree={<TreeView.Item id="main">main.tsx</TreeView.Item>}>
      src
    </TreeView.Item>
    <TreeView.Item id="readme">README.md</TreeView.Item>
  </TreeView>
)
