
# BranchName

```.jsx
<BranchName>a_new_feature_branch</BranchName>

<ExampleHeading mt={3}>BranchName with Octicon</ExampleHeading>
<BranchName>
  <Box mr={2} display='inline-block'><Octicon icon={GitBranch} /></Box>
  a_new_feature_branch
</BranchName>

<ExampleHeading mt={3}>Linked BranchName</ExampleHeading>
<BranchName is="a" href="/">
  a_new_feature_branch
</BranchName>
```

export const meta = {displayName: 'BranchName'}
