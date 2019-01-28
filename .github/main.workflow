workflow "Lint and test" {
  on = "push"
  resolves = [
    "install lint & test",
  ]
}

action "install lint & test" {
  uses = "actions/npm@94e6933"
  runs = "sh -c \"npm install && npm test && npm lint\""
}
