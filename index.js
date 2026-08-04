import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import boundaries from 'eslint-plugin-boundaries'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import prettier from 'eslint-config-prettier'

// Hexagonal architecture rules — see README for the underlying method
const hexagonal = {
  files: ['**/*.ts'],
  plugins: { boundaries },
  settings: {
    // Resolves extensionless TS imports (and tsconfig aliases) for the boundaries plugin
    'import/resolver': { typescript: {} },
    'boundaries/elements': [
      { type: 'domain', pattern: 'src/modules/*/domain', capture: ['module'] },
      { type: 'application', pattern: 'src/modules/*/application', capture: ['module'] },
      { type: 'infrastructure', pattern: 'src/modules/*/infrastructure', capture: ['module'] },
    ],
  },
  rules: {
    // Rule 4: no direct imports between modules; rules 1-2: layer dependency direction
    'boundaries/element-types': [
      'error',
      {
        default: 'disallow',
        rules: [
          { from: ['domain'], allow: [['domain', { module: '${from.module}' }]] },
          {
            from: ['application'],
            allow: [
              ['domain', { module: '${from.module}' }],
              ['application', { module: '${from.module}' }],
            ],
          },
          {
            from: ['infrastructure'],
            allow: [
              ['domain', { module: '${from.module}' }],
              ['application', { module: '${from.module}' }],
              ['infrastructure', { module: '${from.module}' }],
            ],
          },
        ],
      },
    ],
    // Rule 1: the domain imports nothing external (no NestJS, no Prisma, no Zod)
    'boundaries/external': [
      'error',
      {
        default: 'allow',
        rules: [{ from: ['domain'], disallow: ['*'] }],
      },
    ],
  },
}

// General quality: high-signal rules, autofixable where possible
const quality = {
  plugins: { 'simple-import-sort': simpleImportSort },
  rules: {
    eqeqeq: ['error', 'smart'],
    'no-console': 'warn',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
  },
}

export default tseslint.config(
  js.configs.recommended,
  // Type-aware: no-floating-promises, no-misused-promises, await-thenable…
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  },
  {
    // JS files (configs, scripts) are excluded from type-checked linting
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    ...tseslint.configs.disableTypeChecked,
  },
  quality,
  hexagonal,
  {
    // Rule 3 (lintable part): one use case = one file
    files: ['src/modules/*/application/use-cases/**/*.ts'],
    rules: { 'max-classes-per-file': ['error', 1] },
  },
  prettier,
)
