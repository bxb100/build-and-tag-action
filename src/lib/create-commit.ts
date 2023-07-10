import { Toolkit } from 'actions-toolkit'
import readFile, { readDir } from './read-file'
import path from "path";

export default async function createCommit(tools: Toolkit) {

  const dist_dir = await readDir(tools.workspace, 'dist')

  let main = []
  for (const file of dist_dir) {
    const file_path = path.join('dist', file)
    tools.log.info(`file: ${ file_path }`)
    main.push({
      path: file_path,
      mode: '100644',
      type: 'blob',
      content: await readFile(tools.workspace, file_path)
    })
  }

  tools.log.info('Creating tree')
  const tree = await tools.github.git.createTree({
    ...tools.context.repo,
    tree: [
      {
        path: 'action.yml',
        mode: '100644',
        type: 'blob',
        content: await readFile(tools.workspace, 'action.yml')
      },
      // @ts-ignore
      ...main
    ]
  })

  tools.log.complete('Tree created')

  tools.log.info('Creating commit')
  const commit = await tools.github.git.createCommit({
    ...tools.context.repo,
    message: 'Automatic compilation',
    tree: tree.data.sha,
    parents: [tools.context.sha]
  })
  tools.log.complete('Commit created')

  return commit.data
}
