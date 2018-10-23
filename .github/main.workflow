workflow "Lint and test" {
  on = "push"
  resolves = ["install", "lint", "test"]
}

action "install" {
  uses = "actions/npm@94e6933"
  args = "ci"
}

action "lint" {
  uses = "actions/npm@94e6933"
  args = "run lint"
}

action "test" {
  uses = "actions/npm@94e6933"
  args = "test"
}
