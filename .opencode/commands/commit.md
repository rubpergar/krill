---
description: Group changes into semantic commits and push
---

Create semantic commits from all available changes.

Do not make one big commit by default.
Group files by purpose.
Commit each group separately.

If the user provides extra context via `$ARGUMENTS`, use it to refine commit messages — but do not force text that does not accurately describe the changes.

## Steps

### 1. Inspect repository state

```bash
git status --short
git diff --cached
git diff
git ls-files --others --exclude-standard
```

Understand every available change before committing.

### 2. Detect issue key

```bash
git branch --show-current
```

If the branch contains an issue key (`PROJ-123`, `POW-456`, `#123`), use it in every related commit. Otherwise, commit without it. Do not invent one.

### 3. Group changes semantically

Group files and hunks by intent. One commit = one purpose.

Valid groups: one bug fix, one feature, one refactor, one test update, one documentation change, one dependency update, one config/CI change.

If two files changed for the same reason, commit them together. If one file contains unrelated changes, split hunks with `git add -p` or stage files explicitly with `git add <file>`. Do not use `git add -A` blindly when changes are unrelated.

### 4. Create commits one by one

For each semantic group:
1. Stage only the files or hunks for that group.
2. Verify the staged diff with `git diff --cached`.
3. Create a Conventional Commit.
4. Commit.
5. Repeat until no meaningful changes remain.

Commit format:

```
git commit -m "type(scope): summary"
git commit -m "issue-key: type(scope): summary"
```

Use the most accurate type: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.

Use a short scope when useful (feature area, package, route, module, service, config). Skip scope only if it adds no value.

Message rules:
- Max 72 characters, imperative mood, capitalize, no period.
- Describe the purpose, not the file changed.
- Do not use `changes`, `stuff`, `misc`, or `wip`.

### 5. Keep committing until done

After each commit, check remaining changes with `git status --short`. Stop only when:
- all intentional changes are committed
- unrelated or unsafe changes are left unstaged on purpose
- the user must decide what to do with ambiguous changes

## Splitting rules

Split commits when changes are unrelated:
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

When finished, run `git status --short`. Then report in as few words as possible:
- commits created
- files intentionally left uncommitted
- anything skipped for safety

Done means clean semantic history, not just zero pending files.
