# @spyko/eslint-config

Shareable ESLint flat config that **enforces hexagonal architecture boundaries as
lint errors**, on top of a type-aware quality baseline.

## Why this exists

This package is part of my personal **golden path**: an opinionated, pre-decided
default stack for solo side projects (NestJS, Prisma, Postgres, Next.js, Flutter,
OpenTelemetry), designed to minimize time-to-first-deploy and the cost of coming
back to a project after weeks away.

Its guiding principle: **a rule that is not enforced by a machine will be broken.**
Architecture documents don't survive contact with a Friday-evening commit — linters
do. This config turns the architectural rules of the golden path into CI-blocking
errors instead of paragraphs in a README.

The full method (knowledge base, project templates, platform setup) will be
open-sourced separately once it has been battle-tested by real projects. This
package is its first public artifact.

## What it enforces

### Hexagonal architecture rules

Assuming the module structure `src/modules/<context>/{domain,application,infrastructure}`:

1. **`domain/**` imports nothing external** — no NestJS, no Prisma, no Zod, no
   decorators. Business logic stays framework-free.
2. **Dependency direction is enforced** — infrastructure → application → domain,
   never the other way around.
3. **One use case = one file** (`max-classes-per-file` on `use-cases/**`).
4. **No direct imports between modules** — modules communicate through ports.

Powered by [`eslint-plugin-boundaries`](https://github.com/javierbrea/eslint-plugin-boundaries).

### Quality baseline

- ESLint + typescript-eslint recommendations in **type-aware** mode
  (`recommendedTypeChecked` + `stylisticTypeChecked`): `no-floating-promises`,
  `no-misused-promises`, `await-thenable`, and friends
- Deterministic import sorting (`simple-import-sort`, autofixable)
- `eqeqeq`, `no-console` (warning — structured logging belongs to your logger)
- Prettier conflict neutralization (formatting stays Prettier's job)

## Usage

```bash
npm install -D eslint @spyko/eslint-config
```

```js
// eslint.config.js
import config from '@spyko/eslint-config'

export default config
```

Prerequisite: a `tsconfig.json` at the project root — type-aware linting relies on
it via `projectService`.

## Escaping the rules

An `eslint-disable` on an architecture rule is an architecture deviation: it
deserves an ADR (Architecture Decision Record), not just a comment.

## License

MIT
