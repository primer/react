flow "Test and Deploy" {
  resolves = ["lint", "test", "deploy"]
}

task "lint" {
  uses = "superb-bears/npm@master"
  args = ["run lint"]
}

task "test" {
  uses = "superb-bears/npm@master"
  args = ["test"]
}

task "deploy" {
  uses "superb-bears/now@master"
  args = []
}
