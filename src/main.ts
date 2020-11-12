import * as core from "@actions/core"
import * as github from "@actions/github"

const main = async () => {
  try {
    if (!github.context.payload.pull_request) {
      return
    }
    // `who-to-greet` input defined in action metadata file s
    const nameToGreet = core.getInput("who-to-greet")
    const githubToken = core.getInput("GITHUB_TOKEN")
    if (!githubToken) {
      core.setFailed("GITHUB_TOKEN not found")
    }

    console.log(`Hello ${nameToGreet}!`)
    const time = new Date().toTimeString()
    core.setOutput("time", time)
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`)

    const octokit = github.getOctokit(githubToken)

    await octokit.issues.createComment({
      ...github.context.repo,
      issue_number: github.context.payload.pull_request.number,
      body: "hello world",
    })
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    core.setFailed(error.message)
  }
}
main().catch((error: Error) => core.setFailed(error.message))
