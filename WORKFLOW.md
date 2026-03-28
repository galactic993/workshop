---
tracker:
  kind: linear
  project_slug: "e3bfb6c23ae9"
  active_states:
    - Todo
    - In Progress
    - Human Review
    - Merging
    - Rework
  terminal_states:
    - Closed
    - Cancelled
    - Canceled
    - Duplicate
    - Done
polling:
  interval_ms: 5000
workspace:
  root: /Users/izutanikazuki/symphony-workspaces/workshop
hooks:
  after_create: |
    set -e
    git_dir_root=/Users/izutanikazuki/.codex-gitdirs/workshop
    workspace_name="$(basename "$PWD")"
    git_dir="$git_dir_root/$workspace_name"
    mkdir -p "$git_dir_root"
    rm -rf "$git_dir"
    git clone --depth 1 --separate-git-dir "$git_dir" git@github.com:galactic993/workshop.git .
  before_remove: |
    git_dir_root=/Users/izutanikazuki/.codex-gitdirs/workshop
    git_dir=""
    if [ -f .git ]; then
      git_dir="$(sed -n 's/^gitdir: //p' .git | head -n 1)"
    fi
    if [ -z "$git_dir" ]; then
      git_dir="$git_dir_root/$(basename "$PWD")"
    fi
    case "$git_dir" in
      /*) ;;
      *) git_dir="$PWD/$git_dir" ;;
    esac
    if [ -n "$git_dir" ] && [ -d "$git_dir" ]; then
      rm -rf "$git_dir"
    fi
agent:
  max_concurrent_agents: 8
  max_turns: 100
codex:
  command: codex --config shell_environment_policy.inherit=all --config model_reasoning_effort=high --config 'sandbox_workspace_write.writable_roots=["/Users/izutanikazuki/.codex-gitdirs/workshop"]' --config 'sandbox_workspace_write.network_access=true' --model gpt-5.4 app-server
  approval_policy: never
  thread_sandbox: workspace-write
  turn_sandbox_policy:
    type: workspaceWrite
    writableRoots:
      - /Users/izutanikazuki/symphony-workspaces/workshop
      - /Users/izutanikazuki/.codex-gitdirs/workshop
    readOnlyAccess:
      type: fullAccess
    networkAccess: true
    excludeTmpdirEnvVar: false
    excludeSlashTmp: false
---

You are working on a Linear ticket `{{ issue.identifier }}`

{% if attempt %}
Continuation context:

- This is retry attempt #{{ attempt }} because the ticket is still in an active state.
- Resume from the current workspace state instead of restarting from scratch.
- Do not repeat already-completed investigation or validation unless needed for new code changes.
- Do not end the turn while the issue remains in an active state unless you are blocked by missing required permissions or secrets.
{% endif %}

Issue context:
Identifier: {{ issue.identifier }}
Title: {{ issue.title }}
Current status: {{ issue.state }}
Labels: {{ issue.labels }}
URL: {{ issue.url }}

Description:
{% if issue.description %}
{{ issue.description }}
{% else %}
No description provided.
{% endif %}

Instructions:

1. This is an unattended orchestration session. Never ask a human to perform routine follow-up actions.
2. Only stop early for a true blocker such as missing required auth, permissions, or secrets. If blocked, record it in the workpad and move the issue according to workflow.
3. Final message must report completed actions and blockers only. Do not include "next steps for user".

Work only in the provided repository copy. Do not touch any other path.

## Repository quick reference

- Repository type: mixed workshop repository. It is not a single app.
- Major subtrees:
  - `ssol/` -> training materials and slides; usually docs-only work
  - `hts/workshop/` -> Python-based Excel cross-check tooling
  - `hts/mock/` -> Dockerized mock management system with frontend, backend, DB, and Redis
- There is no meaningful root-level `npm run dev`. Choose the target subtree first.
- Typical commands by target:
  - `ssol/`: edit docs/slides only; generate artifacts only when the ticket requires it
  - `hts/workshop/`: create venv, `pip install pandas openpyxl`, then `python3 check_excel_cross_reference.py`
  - `hts/mock/`: `docker compose up -d --build`, then frontend/backend setup and validation inside containers
- Legacy absolute paths under `/Users/izutanikazuki/kzp/fileMaker/...` still appear in some workshop docs and scripts. Validate path assumptions before running them.

## Default posture

- Start by reading the current Linear issue state and route work according to that state.
- Keep one persistent `## Codex Workpad` comment as the source of truth for plan, notes, acceptance criteria, and validation.
- Identify the exact target subtree before editing anything.
- Reproduce the current behavior or establish a concrete signal before editing.
- Sync with `origin/main` before code changes and record the result in the workpad.
- Preserve unexpected existing edits and keep ticket state aligned with reality.

## Status map

- `Backlog` -> do not modify the issue or repository; stop.
- `Todo` -> move to `In Progress` before active work.
- `In Progress` -> implement and validate.
- `Human Review` -> wait for review or address feedback.
- `Merging` -> follow the repository's normal landing flow and do not bypass checks.
- `Rework` -> address requested changes and revalidate.
- `Done` -> no action.

## Required execution flow

1. Fetch the issue by explicit ticket ID and read the current state.
2. For `Todo`, immediately set the issue to `In Progress`, then create or reuse the single `## Codex Workpad` comment.
3. Keep the workpad updated with a hierarchical plan, acceptance criteria, validation checklist, and a short environment stamp `<host>:<abs-workdir>@<short-sha>`.
4. Choose the target subtree first and record that choice in the workpad.
5. Sync with `origin/main` before edits and record the result in the workpad.
6. Implement the minimum change needed for the ticket inside the selected subtree.
7. Run only the validations that match the touched area.
8. Update the workpad after each meaningful milestone.
9. Move the issue only when the validation bar is actually met.

## PR feedback sweep

- If a PR already exists for the branch, review top-level and inline feedback before returning to `Human Review`.
- Treat actionable review comments as blocking until code/docs are updated or a justified pushback is recorded.
- Re-run the relevant validation after feedback-driven changes.

## Blockers

- Missing Docker, missing Python dependencies, missing env files, or stale path assumptions that make the selected subtree non-runnable are valid blockers.
- If blocked, record the exact missing dependency and attempted command in the workpad, then stop.
