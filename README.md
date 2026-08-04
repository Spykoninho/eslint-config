# @spykoninho/eslint-config

Config ESLint partagée du golden path. Embarque les recommandations JS/TS, la
neutralisation Prettier, et surtout **les règles de dépendance hexagonale** :

1. `domain/**` n'importe rien d'externe (ni NestJS, ni Prisma, ni Zod)
2. Le sens des dépendances est forcé : infrastructure → application → domain, jamais l'inverse
3. Un use case = un fichier (`max-classes-per-file`)
4. Aucun import direct entre modules — passage obligatoire par un port

Les règles supposent la structure `src/modules/<contexte>/{domain,application,infrastructure}`
(cf. `knowledge/architecture.md` du golden path).

## Usage

```bash
npm install -D eslint @spykoninho/eslint-config
```

```js
// eslint.config.js
import config from '@spykoninho/eslint-config'

export default config
```

## Sortir des règles

Un `eslint-disable` sur une règle hexagonale est une déviation d'architecture :
il se justifie par un ADR, pas par un commentaire.
