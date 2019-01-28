workflow "Lint and test" {
  on = "push"
  resolves = ["npm install", "npm lint", "npm test"]
}

action "npm install" {
  uses = "actions/npm@94e6933"
  args = "ci"
}

action "npm lint" {
  needs = ["npm install"]
  uses = "actions/npm@94e6933"
  args = "run lint"
}

action "npm test" {
  needs = ["npm install"]
  uses = "actions/npm@94e6933"
  args = "test"
}
