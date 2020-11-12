import * as core from "@actions/core"
import * as github from "@actions/github"
import * as exec from "@actions/exec"

const getCoverageOutputTextForCommand = async (command: string) => {
  let outputText = ""

  await exec.exec("ls")

  await exec.exec("ls/node_modules")

  await exec.exec(
    `nyc --reporter=lcov --reporter=text-summary ${command}`,
    undefined,
    {
      listeners: {
        stdout: (data: Buffer) => {
          outputText += data.toString()
        },
      },
    }
  )

  return outputText
}

const main = async () => {
  if (!github.context.payload.pull_request) {
    return
  }

  const command = core.getInput("command")

  const coverageOutputText = await getCoverageOutputTextForCommand(command)

  const githubToken = core.getInput("GITHUB_TOKEN")

  const octokit = github.getOctokit(githubToken)

  await octokit.issues.createComment({
    ...github.context.repo,
    issue_number: github.context.payload.pull_request.number,
    body: coverageOutputText,
  })
}

main().catch((error: Error) => core.setFailed(error.message))
