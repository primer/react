workflow "Primer Components Workflow" {
  on = "push"
  resolves = [
    "npm lint",
    "npm test",
    "publish",
    "deploy",
  ]
}

action "npm install" {
  uses = "actions/npm@v2.0.0"
  args = "ci"
}

action "npm lint" {
  uses = "actions/npm@v2.0.0"
  needs = ["npm install"]
  args = "run lint"
}

action "npm test" {
  uses = "actions/npm@v2.0.0"
  needs = ["npm install"]
  args = "test"
}

action "deploy" {
  uses = "primer/deploy@bc4097b"
  needs = ["npm install"]
  secrets = ["GITHUB_TOKEN", "NOW_TOKEN"]
}

action "publish" {
  uses = "primer/publish@v1.0.0"
  needs = ["npm install"]
  secrets = [
    "GITHUB_TOKEN",
    "NPM_AUTH_TOKEN",
  ]
  args = ["--", "--unsafe-perm"]
}
