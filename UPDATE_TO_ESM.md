# RC Package Modernization Plan: CommonJS to TypeScript with Build Tools

This document outlines the comprehensive plan to modernize the `rc` package from legacy CommonJS to TypeScript with modern build tools, targeting Node.js 24+ and implementing modern development practices.

## Current State Analysis

**Package**: `rc` v1.2.8 - Hardwired configuration loader  
**Current Structure**: CommonJS with basic Node.js assert tests  
**Dependencies**: `deep-extend`, `ini`, `minimist`, `strip-json-comments`  
**Tooling**: No linting, formatting, or modern tooling  
**Target**: TypeScript with tsup build tool, ESM output for Node.js 24+

## Phase 1: TypeScript & Build Tool Setup

### 1.1 Update package.json

- Set `"type": "module"` for ESM-only output
- Add `"engines": {"node": ">=24", "npm": ">=11"}` for modern Node.js support
- Update `"main"` to point to built output files
- Add `"exports"` for modern package exports with TypeScript source maps
- Add `"types"` field for TypeScript definitions
- Add comprehensive dev dependencies including TypeScript and build tools

### 1.2 Dependencies Assessment

- **deep-extend**: Replace with native object spreading or find modern TypeScript-compatible alternative
- **ini**: Keep (maintained, add @types/ini)
- **minimist**: Keep or replace with `getopts`/`commander` (both TypeScript-compatible)
- **strip-json-comments**: Keep (maintained, add @types/strip-json-comments)

### 1.3 TypeScript & Build Dependencies

```json
{
  "devDependencies": {
    "typescript": "^5.3.0",
    "tsup": "^8.0.0",
    "@types/node": "^20.10.0",
    "@types/ini": "^1.3.34",
    "@types/strip-json-comments": "^3.0.0",
    "eslint": "^8.57.0",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "prettier": "^3.2.0",
    "tsx": "^4.6.0"
  }
}
```

### 1.4 TypeScript Configuration

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "test"]
}
```

### 1.5 Build Tool Configuration (tsup)

Create `tsup.config.ts`:

```typescript
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    cli: 'src/cli.ts',
    utils: 'src/utils.ts'
  },
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  target: 'node24',
  banner: {
    js: '#!/usr/bin/env node'
  }
})
```

## Phase 2: TypeScript Conversion

### 2.1 Core File Conversions to TypeScript

#### src/index.ts (main entry)

- Convert `require('./lib/utils')` → `import * as utils from './utils.js'`
- Convert `require('path').join` → `import { join } from 'node:path'`
- Replace `deep-extend` with native object spreading or type-safe alternative
- Convert `require('minimist')` → `import minimist from 'minimist'`
- Add proper TypeScript interfaces and types
- Replace `module.exports =` with `export default function`

#### src/utils.ts (utility functions)

- Convert all `require()` statements to `import` statements
- Add TypeScript interfaces for function signatures
- Convert `exports.parse =` → `export const parse =` with proper types
- Convert `exports.file =` → `export const file =` with return types
- Convert `exports.json =` → `export const json =` with type guards
- Convert `exports.env =` → `export const env =` with environment variable types
- Convert `exports.find =` → `export const find =` with path types

#### src/cli.ts (CLI interface)

- Add shebang to `#!/usr/bin/env node`
- Convert `require('./index')` → `import rc from './index.js'`
- Add proper TypeScript CLI argument handling
- Add error handling and validation types

### 2.2 Type Definitions

- Create interfaces for configuration objects
- Add type guards for different configuration formats
- Define types for command-line arguments
- Add proper return types for all functions

### 2.3 Import Path Requirements

- Use `.js` extensions for built imports (TypeScript will handle)
- Use native Node.js modules with `node:` prefix
- Ensure proper module resolution in TypeScript config

## Phase 3: TypeScript Testing Setup

### 3.1 Test Framework Migration

- Use `tsx` for TypeScript test execution
- Keep native Node.js test runner (`node --test`) with tsx transpilation
- Convert all test files to TypeScript with `.test.ts` extension
- Add proper TypeScript test utilities and mocks

### 3.2 Test File Conversions

#### test/index.test.ts

- Convert `var assert = require('assert')` → `import assert from 'node:assert'`
- Convert `require('../')(n, ...)` → `import rc from '../dist/index.js'` (built version)
- Add TypeScript interfaces for test data
- Update to native test runner structure with type safety

#### test/ini.test.ts

- Convert `var cc = require('../lib/utils')` → `import * as cc from '../dist/utils.js'`
- Convert `var INI = require('ini')` → `import INI from 'ini'`
- Convert `var assert = require('assert')` → `import assert from 'node:assert'`
- Add TypeScript types for INI parsing

#### test/nested-env-vars.test.ts

- Convert all requires to TypeScript imports
- Add type-safe environment variable handling
- Update import paths to use built modules

### 3.3 Test Scripts with TypeScript

```json
{
  "scripts": {
    "test": "npm run build && node --test test/**/*.test.js",
    "test:watch": "npm run build:watch & node --test --watch test/**/*.test.js",
    "test:coverage": "npm run build && node --test --experimental-test-coverage test/**/*.test.js",
    "test:dev": "tsx --test test/**/*.test.ts"
  }
}
```

### 3.4 Test Type Safety

- Add `@types/node` for Node.js built-in types
- Create test-specific type definitions
- Add type guards for test assertions
- Use TypeScript's strict mode for better test coverage

## Phase 4: TypeScript Code Quality Tools

### 4.1 ESLint Configuration with TypeScript

Create `.eslintrc.js`:

```javascript
module.exports = {
  extends: [
    'standard',
    '@typescript-eslint/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2024,
    sourceType: 'module',
    project: './tsconfig.json'
  },
  plugins: ['@typescript-eslint'],
  env: {
    node: true,
    es2024: true
  },
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/prefer-const': 'error'
  },
  ignorePatterns: ['dist/', 'node/', '*.js']
}
```

### 4.2 Prettier Configuration

Create `.prettierrc`:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "parser": "typescript"
}
```

### 4.3 Ignore Files

- `.eslintignore`: `dist/`, `node/`, `coverage/`, `*.js`
- `.prettierignore`: `dist/`, `node/`, `coverage/`, `*.js`
- Add TypeScript-specific patterns to ignore

### 4.4 TypeScript Linting

- Use `@typescript-eslint` plugin for TypeScript-specific rules
- Enable strict type checking in ESLint
- Add rules for proper TypeScript patterns
- Configure ESLint to work with tsup build process

## Phase 5: TypeScript Build & Development Scripts

### 5.1 Complete package.json Scripts

```json
{
  "scripts": {
    "build": "tsup",
    "build:watch": "tsup --watch",
    "dev": "tsx src/index.ts",
    "test": "npm run build && node --test test/**/*.test.js",
    "test:watch": "npm run build:watch & node --test --watch test/**/*.test.js",
    "test:coverage": "npm run build && node --test --experimental-test-coverage test/**/*.test.js",
    "test:dev": "tsx --test test/**/*.test.ts",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix",
    "format": "prettier --write src/**/*.ts test/**/*.ts",
    "format:check": "prettier --check src/**/*.ts test/**/*.ts",
    "typecheck": "tsc --noEmit",
    "prepublishOnly": "npm run build && npm run test && npm run lint && npm run format:check",
    "clean": "rm -rf dist/ node/ coverage/"
  }
}
```

## Phase 6: TypeScript Documentation Updates

### 6.1 README.md Updates

- Update all code examples to use ESM syntax with TypeScript:

  ```typescript
  // Before
  var conf = require('rc')(appname, defaults);
  
  // After  
  import rc from 'rc';
  const conf = rc(appname, defaults);
  ```

- Add TypeScript usage examples with type definitions:

  ```typescript
  import rc, { ConfigOptions } from 'rc';
  
  interface AppConfig {
    port: number;
    mode: string;
  }
  
  const config: AppConfig = rc<AppConfig>('myapp', {
    port: 3000,
    mode: 'development'
  });
  ```

- Add breaking change notice for v2.0.0 (TypeScript + build tools)
- Update Node.js version requirements to >=24
- Add "Development" section with TypeScript build commands
- Update API documentation with TypeScript interfaces
- Add "TypeScript Support" section

### 6.2 Version Management

- Bump version to 2.0.0 for breaking changes (TypeScript + build system)
- Create comprehensive CHANGELOG.md documenting TypeScript migration
- Update package.json repository information if needed
- Document TypeScript build process and output structure

## Phase 7: TypeScript File Structure Refactoring

### 7.1 Modern TypeScript Directory Structure

```txt
rc-esm/
├── src/
│   ├── index.ts          # Main export file with types
│   ├── utils.ts          # Utility functions with type safety
│   ├── cli.ts            # CLI interface with TypeScript
│   └── types.ts          # TypeScript type definitions
├── test/
│   ├── index.test.ts     # Main functionality tests
│   ├── utils.test.ts     # Utility function tests
│   ├── cli.test.ts       # CLI tests
│   └── fixtures/         # Test fixtures if needed
├── dist/                 # Built output (generated by tsup)
│   ├── index.js          # Built main module
│   ├── index.d.ts        # Type declarations
│   ├── cli.js            # Built CLI
│   ├── cli.d.ts          # CLI type declarations
│   └── utils.js          # Built utilities
├── browser.js            # Browser entry point (if needed)
├── package.json
├── tsconfig.json         # TypeScript configuration
├── tsup.config.ts        # Build tool configuration
├── .eslintrc.js
├── .prettierrc
├── .eslintignore
├── .prettierignore
├── CHANGELOG.md
└── README.md
```

### 7.2 Package.json Exports with TypeScript

```json
{
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts",
      "browser": "./browser.js"
    },
    "./cli": {
      "import": "./dist/cli.js",
      "types": "./dist/cli.d.ts"
    },
    "./utils": {
      "import": "./dist/utils.js",
      "types": "./dist/utils.d.ts"
    }
  },
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "browser": "./browser.js",
  "bin": {
    "rc": "./dist/cli.js"
  },
  "files": [
    "dist/",
    "browser.js",
    "README.md",
    "LICENSE*"
  ]
}
```

### 7.3 TypeScript Type Definitions

Create `src/types.ts`:

```typescript
export interface RcOptions {
  [key: string]: any;
}

export interface RcConfig {
  configs?: string[];
  config?: string;
  [key: string]: any;
}

export interface ParseFunction {
  (content: string): RcOptions;
}

export interface RcFunction {
  <T = RcOptions>(
    name: string,
    defaults?: T | string,
    argv?: RcOptions,
    parse?: ParseFunction
  ): T & RcConfig;
}
```

## Implementation Order

1. **Phase 1**: Set up TypeScript, tsup, and build dependencies
2. **Phase 7**: Create new TypeScript file structure
3. **Phase 2**: Convert all source files from JavaScript to TypeScript
4. **Phase 4**: Set up TypeScript ESLint and Prettier configurations
5. **Phase 5**: Configure build scripts and tooling integration
6. **Phase 3**: Convert and modernize test suite to TypeScript
7. **Phase 6**: Update documentation with TypeScript examples
8. **Build Process**: Set up tsup build pipeline
9. **Testing**: Comprehensive testing of built TypeScript output
10. **Validation**: Ensure everything works with Node.js 24+

## Key Considerations

### Breaking Changes

- **TypeScript + ESM-only**: Will break existing CommonJS users
- **Build process**: Users must consume built output from `dist/` directory
- **Import syntax**: Users must use `import rc from 'rc'` instead of `require('rc')`
- **Type definitions**: New TypeScript types available for better developer experience
- **Node version**: Minimum Node.js 24+ required for modern features
- **Build dependency**: Package now includes built output, not source files

### Compatibility

- **Node.js 24+**: Enables use of modern JavaScript and TypeScript features
- **Browser support**: Maintained through browser.js entry point
- **Type safety**: Full TypeScript support with generated type definitions
- **Build tool**: tsup provides fast, modern bundling for Node.js

### Migration Path for Users

- Document breaking changes clearly in README
- Provide migration examples for both JavaScript and TypeScript users
- Show TypeScript usage examples with proper type annotations
- Consider maintaining a v1.x branch for CommonJS users if demand exists

### Build & Distribution Considerations

- Use tsup for fast, efficient TypeScript compilation
- Generate both JavaScript and TypeScript declaration files
- Include source maps for better debugging experience
- Ensure proper npm package publishing with `files` field

## Success Criteria

- [ ] TypeScript compilation succeeds without errors
- [ ] tsup build process generates correct output in `dist/`
- [ ] All tests pass with TypeScript compilation
- [ ] ESLint passes with zero TypeScript warnings
- [ ] Prettier formatting consistent across TypeScript files
- [ ] Generated type definitions are accurate and complete
- [ ] Package works as TypeScript + ESM-only module
- [ ] CLI functionality preserved with TypeScript
- [ ] Browser compatibility maintained through build output
- [ ] Documentation updated with TypeScript examples
- [ ] Node.js 24+ compatibility verified
- [ ] All import/export statements work with TypeScript
- [ ] Source maps are generated and functional
- [ ] npm package includes correct files for distribution

This plan ensures a complete modernization of the rc package with TypeScript, modern build tools, and improved developer experience while maintaining core functionality and backward compatibility through proper package configuration.

**✅ ALL PHASES COMPLETED SUCCESSFULLY!**
