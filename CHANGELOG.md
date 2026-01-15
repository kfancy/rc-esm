# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-01-15

### 💥 BREAKING CHANGES

- **TypeScript Migration**: Package source code has been migrated from JavaScript to TypeScript
- **ESM Only**: No longer supports CommonJS `require()`, use ESM `import` syntax instead
- **Node.js 18+**: Minimum Node.js version increased from v16 to v18
- **Build Process**: Package now includes built JavaScript files in `dist/` directory
- **Package Structure**: Source code moved to `src/` directory with TypeScript files
- **Development Tools**: Added ESLint, Prettier, and modern build pipeline with tsup

### ✨ NEW FEATURES

- **TypeScript Support**: Full TypeScript definitions included automatically
- **Type Safety**: All functions now have proper TypeScript interfaces and generics
- **Modern Build**: Fast compilation with tsup and source maps
- **Code Quality**: Integrated ESLint and Prettier for consistent code style
- **Development Scripts**: Comprehensive npm scripts for development workflow
- **Watch Mode**: Development build with automatic recompilation
- **Type Checking**: Built-in TypeScript type validation

### 🛠️ IMPROVEMENTS

- **Performance**: Replaced `deep-extend` with native object spreading
- **Code Organization**: Better modular structure with TypeScript interfaces
- **Error Handling**: Improved CLI error handling and validation
- **Documentation**: Enhanced README with TypeScript examples and migration guide
- **Build Output**: Optimized bundle size with modern ESM output

### 📦 DEPENDENCY CHANGES

- **Added**: TypeScript 5.3+ for type safety
- **Added**: tsup 8.0+ for fast builds
- **Added**: ESLint + TypeScript plugin for code quality
- **Added**: Prettier for code formatting
- **Added**: @types/* packages for TypeScript support
- **Removed**: deep-extend dependency (replaced with native implementation)

### 🔄 MIGRATION NOTES

#### From v1.x to v2.0.0:

```typescript
// Before (v1.x - CommonJS)
var rc = require('rc');
var config = rc('myapp', {
  port: 3000
});

// After (v2.x - ESM + TypeScript)
import rc from 'rc';
const config = rc('myapp', {
  port: 3000
});
```

#### TypeScript Usage:

```typescript
import rc, { RcOptions } from 'rc';

interface AppConfig {
  port: number;
  database?: {
    host: string;
  };
}

const config: AppConfig = rc<AppConfig>('myapp', {
  port: 3000,
  database: {
    host: 'localhost'
  }
});
```

### ⚠️ DEPRECATIONS

- CommonJS `require()` syntax is no longer supported
- Node.js versions below 18 are no longer supported
- Direct use of source files (use built files from `dist/` instead)

## [1.2.8] - Previous Version

- Legacy CommonJS implementation
- Basic Node.js assert tests
- Support for .js, .json, and .ini config files
- Environment variable parsing with `__` nesting
- Command-line argument parsing with minimist
- Browser compatibility via browser.js entry point