# Lab 2 evidence worksheet

**Status: participant observations not yet entered.** The authored instructions and expected messages are not execution evidence. Follow [the guide](../README.md); record actual outcomes, including failures and zero applicable scanner checks. Use public-safe identifiers and links only.

## Owned copy and source

| Evidence | Observed value |
| --- | --- |
| Owned repository URL / approved visibility | Not recorded |
| Instructor-assigned dev commit / actual clone commit | Not recorded |
| Verified owned fetch URL and push URL | Not recorded |
| Participant initial commit / default main confirmed | Not recorded |
| Initial push with no active workflows | Not recorded |
| Feature PR into owned main / review route | Not recorded |
| Review actor or explicit no-independent-review route | Not recorded |
| Merge commit | Not recorded |

## Four Copilot interactions

| Interaction | Accepted reasoning/change | Rejected suggestion or explicit review of a supplied unsafe alternative |
| --- | --- | --- |
| Explanation | Not recorded | Example to reject: rg-aks creates AKS |
| Published release interface | Not recorded | Example to reject: AzureRM runtime provider required because of registry suffix |
| Descriptions/types/rules | Not recorded | Example to reject: extra resource or invented AVM allowed_locations input |
| Actual unsupported argument | Not recorded | Example to reject: add resource_group_name inside a downloaded external module |

If Copilot did not propose an unsafe change, say so and review one supplied alternative; do not fabricate a conversation. If unavailable, identify the exact deterministic source fallback used.

## Local native checks

| Check | Actual command/result and time |
| --- | --- |
| Terraform 1.16.3 | Not run / not recorded |
| fmt -check -recursive | Not run / not recorded |
| init -backend=false -lockfile=readonly | Not run / not recorded |
| Lock unchanged after initialization | Not run / not recorded |
| validate success | Not run / not recorded |
| Inserted unsupported AVM argument | Not run / not recorded |
| Actual Unsupported argument diagnostic and nonzero exit | Not run / not recorded |
| Removed only unsupported line; fmt/validate success | Not run / not recorded |
| Optional eight source-regression tests | Not run / not recorded |
| Optional working-input source contract | Not run / not recorded |

No runtime variable evaluation or Azure access was demonstrated by these static checks. Do not attach raw state, plans, credentials, or unredacted provider logs.

## Manual then automatic quality

| Observation | Run/PR URL | Event, ref, commit(s), outcome |
| --- | --- | --- |
| Manual workflow published on main | Not recorded | No automatic push execution expected |
| Manual baseline | Not recorded | workflow_dispatch; refs/heads/main; evaluated SHA |
| PR-event installation | Not recorded | Preserve manual dispatch; main-targeting pull_request only |
| Fresh feature push | Not recorded | No push event configured |
| Nonmatching-base PR, closed without merge | Not recorded | lab02-filter-observation excluded; absence alone is inconclusive |
| Fresh matching-base PR | Not recorded | pull_request; main; PR head and evaluated merge SHAs |
| Fresh automatic quality run | Not recorded | Same source revision as matching PR, not manual rerun |
| Exact required check, if configured afterward | Not recorded | Select the successful actual check, not an invented name |
| Final peer review / merge | Not recorded | Respect current checks and inherited rules |

Record **manual Checkov** passed / failed / skipped / applicable count: not recorded.
Record **PR Checkov** passed / failed / skipped / applicable count: not recorded.
Scan boundary: working local Terraform source; external-module downloads disabled. If applicable count is zero, write **zero applicable checks; no claim of complete AVM/AzAPI coverage**. Record scanner version 3.3.19 only when verified in the run.

## Explain and preserve

- Root -> wrapper -> AVM input and output mappings: not recorded.
- Why validate caught the unsupported argument without Azure: not recorded.
- Which variable rules were not evaluated with real values: not recorded.
- Why provider locks do not pin registry module code: not recorded.
- Difference between manual dispatch, automatic PR event, and deployment approval: not recorded; this lab has no deployment approval.
- Local source/evidence retention and optional observation-branch cleanup: not recorded.
- Cloud outcome: **not applicable; no Azure resources are created in Lab 2**.
