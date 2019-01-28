workflow "Lint and test" {
  on = "push"
  resolves = ["install", "lint", "test"]
}

action "npm install" {
  uses = "actions/npm@94e6933"
  args = "ci"
}

action "npm lint" {
  needs = ["install"]
  uses = "actions/npm@94e6933"
  args = "run lint"
}

action "npm test" {
  needs = ["install"]
  uses = "actions/npm@94e6933"
  args = "test"
}
