# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

**Start every task at the recipe index** — `../start-technologies/projects/start-sdk/docs/src/recipes.md`
(or <https://docs.start9.com/packaging/recipes.html>). It maps an intent ("prompt the user to create
admin credentials", "expose a web UI") to the constructs, the reference pages, and a named production
package to copy. Find the recipe before you read this package's neighbours: a package you reach by
grepping may be non-conformant, and the recipe outranks it.

Freshly scaffolded? Work the
[New Package Checklist](../start-technologies/projects/start-sdk/docs/src/new-package-checklist.md)
(or <https://docs.start9.com/packaging/new-package-checklist.html>) from top to bottom. It is a
guide page, not a file in this repo — read it, don't copy it in.

Keep `README.md` (technical reference for an AI support or administering agent) and
`instructions.md` (end-user docs) in sync with your changes. This file restates neither:
whoever changes the package has both, so it carries only what they don't — repo mechanics,
a change that looks right and is not, where the next thing gets added, a naming trap, a
build or test invocation particular to this repo.

**Fix a defect you spot rather than reporting it** — you have the package open and the
context to be sure. File **a GitHub issue on this repo** only when the call isn't yours to
make: you can't pin the cause down, two defensible fixes exist, or it's too large to ride on
the work in hand. An open issue is a report, not a queue — implement one when you're asked
to or when it's labelled `Approved`, then close it with `Closes #<n>`.

Don't record work in the repo instead: no `TODO.md`, no `NOTES.md`, no `PLAN.md`. What you
verified, tried, and decided belongs in the commit message and the PR body.

## This repo

- **`sdk.host.getOwn` takes the host id, not the interface id.** `startos/interfaces.ts` exports both; an interface id resolves to nothing, silently.
- **Keep the import paths in `utils.ts` volume-relative** and prefix them for whoever reads them: `sdk.volumes.main.subpath()` for the JS runtime, `mountpoint` (`/data`) inside a subcontainer. A path from the wrong side fails silently or at Synapse startup.
- **Don't add a `.catch()` to `fileModels/importedHomeserver.yml.ts` or soften `log_config` from its `z.literal`**, don't bind 8448, don't fold `restore-import` back into the import action, and don't drop either `cache_autotuning` bound. Each looks like a simplification; `README.md` says what each one breaks.
- **Other packages import this repo's code** — `ensureAppserviceRegistration` and its `AppserviceParams` from `startos/public.ts`, the host and interface ids from `startos/interfaces.ts`, and `manifest` — and `register-appservice`'s input is filled by their tasks. Renaming any of them breaks a dependent.
