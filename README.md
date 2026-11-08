# Bunny 🐇 (App Server)

Self-Improving Coding agent I'm working on, just wait! 😊

## Next-Up To-Do:
- Frontend time (Electron + React.js coming up)

## UI Plan (learning from zero):
Rule: change only one unfamiliar thing at a time, so when something breaks I know which layer it's in.
- [ ] **Step 1: terminal client** (`cli/`, no React, no UI framework). Plain readline loop that sends a message with `fetch`, reads the SSE stream, and prints each event. Proves the server contract works. No fancy TUI libraries yet.
- [ ] **Step 2: learn React on its own**, on throwaway projects: a counter, then a todo list, then something that fetches from `/health`. Core ideas: components, state, effects.
- [ ] **Step 3: connect them.** Build the chat window (Electron + React) against my own server, once steps 1 and 2 feel okay.

## To Fix Before Frontend:
- [ ] **Tools overhaul:**
  - [ ] Unify the response format across all tools (one shape for success and failure, same structure everywhere).
  - [ ] Make tools execute from the correct directory (resolve paths against the thread's `cwd`, not the server's working directory; `runCommand` must use `cwd`).
  - [ ] Tighten `isInsideCwd` (use `path.relative`, handle Windows case-insensitivity).
  - [ ] Keep `runCommand` out of the registry until the approval flow exists.
- [ ] **Skill system:** skill manager + parser, then skill tools (`createSkill`, `editSkill`, `deleteSkill`, ...). Skills are data on disk; the agent loop stays fixed.
