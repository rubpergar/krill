---
name: commit-discipline
description: Groups pending changes into semantic commits and pushes them, using Conventional Commit format plus splitting and safety rules. Use when the user asks to commit, to group changes into meaningful commits, or to push.
---

# Commit Discipline

Create semantic commits from all available changes, then push. The user owns the decision and the responsibility for what gets pushed.

Do not make one big commit by default. Group files by purpose and commit each group separately. If the user provides extra context, use it to refine commit messages, but do not force text that does not describe the changes.

## Procedure

### 1. Inspect repository state

```bash
git status --short
git diff --cached
git diff
git ls-files --others --exclude-standard
```

Understand every available change before committing.

### 2. Group changes semantically

Group files and hunks by intent. One commit = one purpose (a bug fix, a feature, a refactor, a test update, a docs change, a dependency update, a config/CI change).

If two files changed for the same reason, commit them together. If one file contains unrelated changes, split hunks with `git add -p` or stage files explicitly with `git add <file>`. Do not use `git add -A` blindly when changes are unrelated.

### 3. Create commits one by one

For each group: stage only its files or hunks, verify with `git diff --cached`, and commit with `type(scope): summary`.

- Use the most accurate type: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
- Use a short scope when useful; skip it when it adds no value.
- Imperative mood, no period, 72 characters or fewer. Describe the purpose, not the file.

Repeat until no meaningful changes remain.

### 4. Push

Once all commits are done and nothing intended for this work is left uncommitted, push to the active branch:

```bash
git push
```

If the push fails because the branch has no upstream or the remote rejects it, stop and report the exact blocker instead of guessing a workaround.

## Splitting rules

Split when changes are unrelated:

- UI change + dependency update = two commits
- bug fix + test for that bug = usually one commit
- refactor + behavior change = two commits
- docs for a feature + feature code = usually one commit
- formatting many files + logic change = two commits
- generated lockfile from dependency update = same commit

If a change cannot be explained by the same sentence, split it.

## Safety rules

Never commit: secrets, `.env` files with real values, API keys, tokens, credentials, debug logs, local editor files, temporary files, build artifacts unless intentionally tracked, unrelated experiments.

Before each commit, verify the staged diff with `git diff --cached`. If it contains unrelated changes, unstage with `git restore --staged <file>` and split.

## Final check

When finished, run `git status --short`, then report in as few words as possible: commits created, files intentionally left uncommitted, anything skipped for safety, and the push result. Done means a clean semantic history, not just zero pending files.
