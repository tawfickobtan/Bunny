# Bunny - Agent Context

Personal project by Toffy. Coding agent app server (TypeScript, Express, tsx).
The owner is learning TypeScript and engineering: guide and explain, do not implement unless explicitly asked.

## Goal
A working app server where the agent runs. Clients talk to it over HTTP:
1. Terminal CLI first (`cli/`, minimal readline loop using `fetch` + SSE).
2. Electron + React app later (same HTTP contract).

## Design Decisions (settled)

### Threads
- A thread is the `session` object: UUID `id`, `title`, `cwd`, `allowedDirs` (starts as `[cwd]`), `messages`, `messageCount`.
- Client creates a thread, then continues it by id:
  - `POST /threads` with `{cwd}` -> `{id}`
  - `POST /threads/:id/messages` with `{text, messageCount}` -> SSE stream
  - `GET /threads`, `GET /threads/:id` to list and reload
- State lives in memory, saved to JSON under `~/.bunny` after every pushed message. SQLite possibly later.

### Agent
- A fresh `agent` is created per incoming message and operates on the stored thread.
- `run()` takes a single `onEvent(event)` callback instead of many hooks.
- Events (discriminated union, defined once in a shared `events.ts`): `tool_call`, `tool_result`, `message` (incl. reasoning), `error`, `done`.
- Turn limit: 25 per run (a constant).
- Model/provider hardcoded in one place for now. Later: UI picker, stored per thread.
- `executeToolCall` always returns a string (unknown tool, bad JSON, or thrown errors become tool messages), and must `return await` inside `try`.

### Protocol
- Replies stream as typed JSON events over SSE.
- Optimistic concurrency: client sends the `messageCount` it last saw; server accepts only if it matches the thread's. The check and the user-message push happen with no `await` between them. Mismatch -> reject (stale/duplicate/busy).
- LLM failure mid-run: emit `error` then `done`; history stays valid (never end with assistant `tool_calls` lacking tool replies); no auto-retry.

### Code layout
- `ThreadStore`: memory + disk persistence, create/lookup by id, load on startup.
- `agent`: runs one thread.
- `server/` routes: thin; parse request, call store/agent, write SSE.
- `events.ts`: shared event types.
- `cli/`: separate terminal client.

## Postponed on purpose
- Approval flow (for `runCommand` and for adding folders to `allowedDirs`; needs a client-to-server channel mid-run).
- `runCommand` safety (not in the registry for v1; it ignores `cwd` and has no sandbox).
- Better tools, queueing/cancelling, SQLite.

## Type & Engineering Principles (learned so far)
- Make illegal states unrepresentable: discriminated unions (e.g. `message` by `role`).
- Types describe; they don't verify. `as` is trust. Validate at boundaries later (e.g. zod).
- Be as specific as the truth allows (`choice.message` is an `assistantMessage`).
- Avoid `any`. `tool<T>` is generic over its params; the registry still uses `any` (known, tolerated for now).
- Throw for unrecoverable failures; use return types for normal variation.
- One place per rule (e.g. `isInsideCwd` in `tools/common.ts`).
- Silent failures are worse than loud ones: always answer the model.

## Known To-Dos / Gaps
- `path.resolve(filePath)` in tools resolves against the server's cwd, not the thread's `cwd`; use `path.resolve(cwd, filePath)`.
- `isInsideCwd` compares path segments by position; consider `path.relative` and Windows case-insensitivity.
- `complete()` does not check `response.ok` before parsing.
- `index.ts` still creates a new hardcoded session per request and ignores `sessions.json`.
