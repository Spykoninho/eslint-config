import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import boundaries from 'eslint-plugin-boundaries'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import prettier from 'eslint-config-prettier'

// Règles hexagonales du golden path — cf. knowledge/architecture.md
const hexagonal = {
  files: ['**/*.ts'],
  plugins: { boundaries },
  settings: {
    // Résout les imports TS sans extension (et les alias tsconfig) pour le plugin boundaries
    'import/resolver': { typescript: {} },
    'boundaries/elements': [
      { type: 'domain', pattern: 'src/modules/*/domain', capture: ['module'] },
      { type: 'application', pattern: 'src/modules/*/application', capture: ['module'] },
      { type: 'infrastructure', pattern: 'src/modules/*/infrastructure', capture: ['module'] },
    ],
  },
  rules: {
    // Règle 4 : aucun import direct entre modules ; règles 1-2 : sens des dépendances entre couches
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
    // Règle 1 : le domaine n'importe rien d'externe (ni NestJS, ni Prisma, ni Zod)
    'boundaries/external': [
      'error',
      {
        default: 'allow',
        rules: [{ from: ['domain'], disallow: ['*'] }],
      },
    ],
  },
}

// Qualité générale : règles à fort signal, autofixables quand possible
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
  // Type-aware : no-floating-promises, no-misused-promises, await-thenable…
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
    // Les fichiers JS (configs, scripts) ne sont pas couverts par le type-checking
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    ...tseslint.configs.disableTypeChecked,
  },
  quality,
  hexagonal,
  {
    // Règle 3 (part lintable) : un use case = un fichier
    files: ['src/modules/*/application/use-cases/**/*.ts'],
    rules: { 'max-classes-per-file': ['error', 1] },
  },
  prettier,
)
