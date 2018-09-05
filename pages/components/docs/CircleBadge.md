
# CircleBadge
---

```.jsx
<Heading fontSize={3}>Small, medium & large</Heading>
<CircleBadge bg="blue.5" size="small"><img src="https://avatars0.githubusercontent.com/t/1929972?s=280&v=4"/></CircleBadge>
<CircleBadge bg="blue.5" size="medium"><img src="https://avatars0.githubusercontent.com/t/1929972?s=280&v=4"/></CircleBadge>
<CircleBadge bg="blue.5" size="large"><img src="https://avatars0.githubusercontent.com/t/1929972?s=280&v=4"/></CircleBadge>

<Heading fontSize={3}>With custom width & height</Heading>
<CircleBadge bg="blue.5" size={40}><img src="https://avatars0.githubusercontent.com/t/1929972?s=280&v=4"/></CircleBadge>

<Heading fontSize={3}>{`With <img> as a child & bg prop`}</Heading>
<CircleBadge bg="blue.5" size="small"><img src="https://avatars0.githubusercontent.com/t/1929972?s=280&v=4"/></CircleBadge>

<Heading fontSize={3}>With Octicon as child</Heading>
<CircleBadge size="medium">
  <Octicon icon={Zap}/>
</CircleBadge>
```

export const meta = {displayName: 'CircleBadge'}
