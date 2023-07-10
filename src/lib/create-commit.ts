import { Toolkit } from 'actions-toolkit'
import readFile, { readDir } from './read-file'

export default async function createCommit(tools: Toolkit) {

  const dist_dir = await readDir(tools.workspace, 'dist')

  let main = []
  for (const file of dist_dir) {
    tools.log.info(`file: ${ file }`)
    main.push({
      path: file,
      mode: '100644',
      type: 'blob',
      content: await readFile(tools.workspace, file)
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
