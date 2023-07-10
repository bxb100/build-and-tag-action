import fs from 'fs'
import path from 'path'

export default async function readFile(baseDir: string, file: string) {
  const pathToFile = path.join(baseDir, file)

  if (!fs.existsSync(pathToFile)) {
    throw new Error(`${file} does not exist.`)
  }

  return fs.promises.readFile(pathToFile, 'utf8')
}

export async function readDir(baseDir: string, dir: string) {
  const pathToDir = path.join(baseDir, dir)

  return fs.promises.readdir(pathToDir)
}
