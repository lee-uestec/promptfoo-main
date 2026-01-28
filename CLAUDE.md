# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Promptfoo is an open-source TypeScript framework for evaluating and testing LLM applications. It provides:
- **Evaluation framework**: Test prompts and models with automated assertions
- **Red teaming**: Security vulnerability scanning for LLM apps
- **CLI and library**: Use as a command-line tool or Node.js package
- **Web UI**: React 19-based interface for viewing results
- **Multi-provider support**: OpenAI, Anthropic, Azure, Bedrock, Ollama, and 80+ providers

## Architecture

### Core Components

**Evaluator** (`src/evaluator.ts`, 2356 lines)
- Heart of the evaluation engine
- Orchestrates test execution across prompts, providers, and test cases
- Manages concurrency, rate limiting, and caching
- Handles assertions and scoring
- Integrates with OpenTelemetry for tracing

**Provider System** (`src/providers/`)
- Unified interface for 80+ LLM providers
- Each provider implements `ApiProvider` interface
- Provider registry for dynamic loading and resolution
- Separate adapters for different capabilities (chat, embeddings, images)
- Rate limiting and retry logic handled per provider

**Red Teaming** (`src/redteam/`)
- Plugin-based architecture for security testing
- Strategies for attack generation (jailbreaks, injections, etc.)
- Graders evaluate if attacks succeeded
- Remote generation service for complex attacks
- Risk scoring and reporting

**Database** (`src/database/`)
- SQLite with Drizzle ORM
- WAL mode for better concurrency
- Stores evaluation results, runs, and metadata
- Located at `~/.promptfoo/promptfoo.db`

**CLI** (`src/main.ts`, `src/commands/`)
- Commander.js-based CLI with subcommands
- Main entry point: `src/entrypoint.ts`
- Commands in `src/commands/` (eval, init, view, redteam, etc.)

**Web Server** (`src/server/`)
- Express server for web UI
- Socket.io for real-time updates
- Serves evaluation results and configuration

**Frontend** (`src/app/`)
- React 19 + Vite + MUI v7
- Separate npm workspace
- See `src/app/AGENTS.md` for details

### Module System

**Build outputs:**
- ESM (`.js`) for library and CLI - primary format
- CJS (`.cjs`) for backward compatibility
- Builds to `dist/` using tsdown (esbuild wrapper)
- Both formats externalize dependencies (not bundled)

**Type system:**
- TypeScript with strict mode
- Types in `src/types/` and inline Zod schemas
- `src/types/index.ts` is being refactored to separate Zod validators
- Heavy use of Zod for runtime validation

### Key Data Flow

1. **Configuration** → YAML/JSON parsed into `TestSuite`
2. **Prompts** → Processed with Nunjucks templating
3. **Providers** → Loaded and resolved via provider registry
4. **Test Cases** → Generated or loaded from files
5. **Evaluation** → Parallel execution with rate limiting
6. **Assertions** → Run against provider responses
7. **Results** → Stored in database and/or exported

### Critical Design Patterns

- **Provider abstraction**: All LLMs unified behind `ApiProvider` interface
- **Async queue**: `async` library for concurrency control
- **Rate limiting**: Scheduler with per-provider token buckets
- **Caching**: File-based cache in `~/.cache/promptfoo`
- **Assertions**: Declarative or JavaScript-based checks
- **Hooks**: Extension points (beforeAll, afterEach, etc.)

## Build Commands

```bash
# Core build
npm run build              # TypeScript check + tsdown build + frontend
npm run build:clean        # Clean dist/ before building
npm run build:watch        # Watch TypeScript files and rebuild

# Development
npm run dev                # Start server + frontend (localhost:3000 + 5173)
npm run dev:server         # Server only (localhost:3000)
npm run dev:app            # Frontend only (localhost:5173)

# Testing
npm test                   # Run all tests (Vitest)
npm run test:watch         # Watch mode
npm run test:integration   # Integration tests
npm run test:redteam:integration  # Red team integration tests
npm run test:coverage      # Coverage report
npx vitest path/to/test    # Run specific test

# Linting & formatting
npm run lint               # Lint src/ with Biome
npm run lint:tests         # Lint test/ directory
npm run format             # Format all files (Biome + Prettier)
npm run format:check       # Check without modifying
npm run l                  # Lint only changed files vs main
npm run f                  # Format only changed files vs main

# Local testing
npm run local -- eval -c config.yaml           # Test with local build
npm run local -- eval -c config.yaml --no-cache  # Disable cache
npm run local -- eval --env-file .env -c config.yaml  # Load env vars

# Database
npm run db:generate        # Generate Drizzle migrations
npm run db:migrate         # Run migrations
npm run db:studio          # Open Drizzle Studio

# Other
npm run tsc                # Type check only
npm run jsonSchema:generate  # Generate JSON schema for configs
```

## Development Workflow

### Running Evaluations Locally

**Always run from repository root:**

```bash
# Use --no-cache during development
npm run local -- eval -c examples/my-config.yaml --no-cache

# Load environment variables
npm run local -- eval -c config.yaml --env-file .env

# Export results for inspection
npm run local -- eval -c config.yaml -o output.json --no-cache

# Verbose logging
LOG_LEVEL=debug npm run local -- eval -c config.yaml --verbose
```

**Important:**
- Use `--` before all flags with `npm run local`
- Don't run `npm run local -- view` - assume dev server is running
- Use `--no-cache` to avoid stale cached results
- **NEVER** delete cache (`~/.cache/promptfoo`) or database without permission

### Testing Changes

1. Run unit tests: `npm test` or `npx vitest path/to/test`
2. Test locally: `npm run local -- eval -c config.yaml --no-cache`
3. Check types: `npm run tsc`
4. Lint & format: `npm run l && npm run f`

### Node Version

- Required: Node.js >=20.0.0 (see `.nvmrc`: 24.13.0)
- Use `nvm use` to align with project version
- `engine-strict=true` in `.npmrc` enforces version

## Key Files and Directories

| Path | Purpose |
|------|---------|
| `src/index.ts` | Public API for npm package |
| `src/entrypoint.ts` | CLI entry point |
| `src/main.ts` | CLI command setup |
| `src/evaluator.ts` | Core evaluation engine |
| `src/providers/` | LLM provider implementations |
| `src/redteam/` | Security testing framework |
| `src/commands/` | CLI commands |
| `src/database/` | SQLite database layer |
| `src/types/` | TypeScript type definitions |
| `src/validators/` | Zod schemas for validation |
| `src/assertions/` | Assertion types and logic |
| `src/app/` | React web UI (workspace) |
| `src/server/` | Backend Express server |
| `test/` | Vitest unit tests |
| `examples/` | Example configurations |
| `drizzle/` | Database migrations |

## Configuration

**Config file**: `promptfooconfig.yaml` (or `.json`)
- Defines prompts, providers, tests, and assertions
- Supports environment variables and templating
- JSON schema available at `site/static/config-schema.json`

**Environment variables**:
- Loaded from `.env` file (not committed)
- Provider API keys (e.g., `OPENAI_API_KEY`)
- Promptfoo settings (e.g., `PROMPTFOO_DISABLE_CACHE`)

**Global config**: `~/.promptfoo/` directory
- Database: `promptfoo.db`
- Signal file: `evalLastWritten`
- Cache: `~/.cache/promptfoo`

## Testing

**Test framework**: Vitest (all tests)
- Backend tests: `test/**/*.test.ts` (globals enabled)
- Frontend tests: `src/app/**/*.test.{ts,tsx}` (explicit imports)
- Integration tests: `vitest.integration.config.ts`

**Test execution**:
- Tests run in random order (catch isolation issues)
- Uses forks (child processes) for memory isolation
- Max concurrency: CPU cores - 2 (min 4)
- 30s timeout per test

**Coverage**: Run `npm run test:coverage`

## Code Standards

- **TypeScript**: Strict mode, ES2022 target
- **Linting**: Biome (replaces ESLint)
- **Formatting**: Biome + Prettier (for CSS, MD, YAML)
- **Imports**: Sorted by Biome
- Use `const` over `let`, avoid `var`
- Async/await for async code
- Consistent curly braces for control flow

**Before committing**: `npm run l && npm run f`

## Provider Development

See `src/providers/AGENTS.md` for detailed guidance on adding providers.

**Key points**:
- Implement `ApiProvider` interface
- Add to `src/providers/index.ts` registry
- Handle rate limits and retries
- Support both chat and completion formats
- Add tests in `test/providers/`

## Red Team Development

See `src/redteam/AGENTS.md` for red teaming details.

**Key concepts**:
- **Plugins**: Generate attack test cases (in `src/redteam/plugins/`)
- **Graders**: Score if attacks succeeded (in `src/redteam/graders.ts`)
- **Strategies**: How to generate variations (in `src/redteam/strategies/`)

## Database

- **SQLite** with Drizzle ORM
- **WAL mode** for concurrency (unless on network filesystem)
- Schema in `src/database/tables.ts`
- Migrations in `drizzle/` directory
- Generate migrations: `npm run db:generate`
- Apply migrations: `npm run db:migrate`

**Never delete database without permission** - it contains user data.

## Important Notes

- Project uses ESM (`"type": "module"` in package.json)
- CommonJS build provided for compatibility
- Many dependencies are optional (AI provider SDKs)
- Cache is in `~/.cache/promptfoo` - use `--no-cache` flag instead of deleting
- Database is at `~/.promptfoo/promptfoo.db`
- Don't edit `CHANGELOG.md` - it's auto-generated
- Alternative package managers (pnpm, yarn) are supported
- Workspaces: `src/app` and `site`

## Additional Documentation

Read when relevant to your task:

- `AGENTS.md` - Main developer guide (start here)
- `src/app/AGENTS.md` - Frontend development
- `src/providers/AGENTS.md` - Provider development
- `src/commands/AGENTS.md` - CLI commands
- `src/redteam/AGENTS.md` - Red teaming
- `src/server/AGENTS.md` - Backend server
- `test/AGENTS.md` - Testing patterns
- `site/AGENTS.md` - Documentation site
- `docs/agents/git-workflow.md` - Git workflow rules
- `docs/agents/pr-conventions.md` - PR title/scope format
- `docs/agents/logging.md` - Logging and sanitization
- `docs/agents/database-security.md` - SQL security