name: Move new issues to inbox

on:
  issues:
    type: [opened]

jobs:
  automate-project-columns:
    runs-on: ubuntu-latest

    steps:
     - name: Add react label to issue
        if: ${{ github.event.action == 'opened' }}
        env:
          GITHUB_TOKEN: ${{ secrets.PRIMER_BOT_TOKEN }}
          ISSUE_ID: ${{ github.event.issue.node_id }}
          REACT_LABEL_ID: "LA_kwDOB0K8ws7Oq_eD"
        run: |
          gh api graphql --header 'GraphQL-Features: projects_next_graphql' -f query='
            mutation($labelIds: [ID!]!, $labelableId: ID!) {
              addLabelsToLabelable(input: { labelIds: [$reactLabelId], labelableId: $issue }) {
                clientMutationId
              }
            }' -f reactLabelId=$REACT_LABEL_ID -f issue="$ISSUE_ID" --jq '.data.addProjectNextItem.projectNextItem.id'
      - name: Add issue to project
        if: ${{ github.event.action == 'opened' }}
        env:
          GITHUB_TOKEN: ${{ secrets.PRIMER_BOT_TOKEN }}
          PROJECT_ID: "PN_kwDNJr_NNKA"
          ISSUE_ID: ${{ github.event.issue.node_id }}
        run: |
          gh api graphql --header 'GraphQL-Features: projects_next_graphql' -f query='
            mutation($project:ID!,$issue:ID!) {
              addProjectNextItem(input: {projectId: $project, contentId: $issue}) {
                projectNextItem {
                  id
                }
              }
            }' -f project=$PROJECT_ID -f issue="$ISSUE_ID" --jq '.data.addProjectNextItem.projectNextItem.id'
