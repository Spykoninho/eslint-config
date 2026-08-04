import { describe, it, expect } from 'vitest'
import { ESLint } from 'eslint'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import config from '../index.js'

const fixtures = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures')

async function lint(file) {
  const eslint = new ESLint({ cwd: fixtures, overrideConfigFile: true, overrideConfig: config })
  const [result] = await eslint.lintFiles([file])
  return result.messages.map((m) => m.ruleId)
}

describe('règles hexagonales', () => {
  it('interdit un import externe dans le domaine (règle 1)', async () => {
    expect(await lint('src/modules/orders/domain/entities/bad-external.ts')).toContain(
      'boundaries/external',
    )
  })

  it("interdit au domaine d'importer l'infrastructure (règle 2)", async () => {
    expect(await lint('src/modules/orders/domain/entities/bad-layer.ts')).toContain(
      'boundaries/element-types',
    )
  })

  it('interdit un import entre modules (règle 4)', async () => {
    expect(await lint('src/modules/orders/application/use-cases/bad-cross-module.ts')).toContain(
      'boundaries/element-types',
    )
  })

  it('accepte un module conforme', async () => {
    expect(await lint('src/modules/orders/application/use-cases/create-order.ts')).toEqual([])
    expect(await lint('src/modules/orders/infrastructure/persistence/prisma-order-repository.ts')).toEqual([])
  })
})
