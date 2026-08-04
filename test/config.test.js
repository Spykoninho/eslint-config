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

describe('hexagonal architecture rules', () => {
  it('forbids external imports in the domain (rule 1)', async () => {
    expect(await lint('src/modules/orders/domain/entities/bad-external.ts')).toContain(
      'boundaries/external',
    )
  })

  it('forbids the domain from importing infrastructure (rule 2)', async () => {
    expect(await lint('src/modules/orders/domain/entities/bad-layer.ts')).toContain(
      'boundaries/element-types',
    )
  })

  it('forbids imports across modules (rule 4)', async () => {
    expect(await lint('src/modules/orders/application/use-cases/bad-cross-module.ts')).toContain(
      'boundaries/element-types',
    )
  })

  it('detects an unawaited promise (type-aware)', async () => {
    expect(await lint('src/modules/orders/application/use-cases/bad-floating-promise.ts')).toContain(
      '@typescript-eslint/no-floating-promises',
    )
  })

  it('accepts a compliant module', async () => {
    expect(await lint('src/modules/orders/application/use-cases/create-order.ts')).toEqual([])
    expect(await lint('src/modules/orders/infrastructure/persistence/prisma-order-repository.ts')).toEqual([])
  })
})
