
### Buttons

```.jsx
<Box>
  <Button> Button </Button>
</Box>

<Box>
  <Button size="sm"> Button small </Button>
</Box>

<Box>
  <Button size="large"> Button large </Button>
</Box>

<Box>
  <ButtonDanger> ButtonDanger </ButtonDanger>
</Box>

<Box>
  <ButtonPrimary> ButtonPrimary </ButtonPrimary>
</Box>

<Box>
  <ButtonOutline> ButtonOutline </ButtonOutline>
</Box>

<Box>
  <Button block> Button block </Button>
</Box>

<Box>
  <Button linkStyle> Button linkStyle </Button>
</Box>

<Box>
  <ButtonLink href="https://www.goatslive.com/">This is an {'<a>'} styled as a button</ButtonLink>
</Box>

<ExampleHeading>Octicon Buttons</ExampleHeading>
<Box>
  <OcticonButton icon={Pencil} label="Edit" onClick={() => alert('edit')} mr={3} />
</Box>

<Box>
  <Text color="red.5"><OcticonButton icon={X} label="Close" onClick={() => alert('close')} mr={3} /></Text>
</Box>

<Box>
  <OcticonButton icon={Hubot} size="large" label="ROBOT" onClick={() => alert('beep boop')} />
</Box>
```

export const meta = {displayName: 'Buttons'}
