# Lab 2 instructor runbook

## Boundary and hand-off status

Only Lab 2 is authored here. The instructor source is intended for public publication under **alvinea28** on `dev`; learners retain that history, rename their local branch to `main`, and push to their own pre-created empty destinations. Actual source publication/commit IDs and class readiness must be verified by the coordinating main agent, not inferred from an intended URL.

No Git initialization, commit, push, repository settings mutation, identity change, cloud operation, Terraform initialization, or provider-lock generation is part of this authoring hand-off. The local [daily report](daily%20work%20report/2026-09-22.md) records only verification actually performed. All Azure deployment/runtime claims remain out of scope.

## Pre-publication release gates (coordinating author)

1. Review exact root pins and release-tag evidence in [avm-interface.md](avm-interface.md). Do not substitute moving module branches or add an AzureRM runtime provider.
2. Generate **real** provider locks for the starter and reference using Terraform 1.16.3; include `windows_amd64` and `linux_amd64` checksum coverage. Confirm the selected AzAPI/ModTM/Random versions are 2.12.0/0.4.0/3.9.1, not just compatible major versions. Do not fabricate hashes or reuse an unrelated root's lock blindly.
3. The exact required lock paths are listed below. The working root and reference use the same provider requirements, but validate each directory independently. Run dependency resolution only as the authorized coordinating author; this lab-authoring task intentionally leaves it to that owner.

```text
src/terraform/.terraform.lock.hcl
src/reference/solution/.terraform.lock.hcl
```

4. In clean Windows and Linux test copies, run the participant's exact backend-disabled, read-only-lock initialization and static validation. Check the lock bytes stay unchanged; no Azure login, environment variables containing credentials, or actual backend should be necessary.
5. Reproduce the actual unsupported AVM argument, require its specific nonzero diagnostic, remove only that line, and require revalidation success. Invalid participant variable values are not a substitute for this static interface test.
6. Rehearse the complete copy sequence from terse starter inputs to completed snippets. Root/wrapper outputs must align, and every local source link must resolve. Confirm both code roots pass formatting and every snippet formats when placed at its specified destination.
7. Check the inactive workflow with actionlint and parse its manual/PR-event variants. Checkov 3.3.19 must remain blocking with external-module downloads false. Record applicable pass/fail/skip counts honestly, including zero; no SARIF integration or code scanning setup is assumed.
8. Verify ignore rules preserve provider locks/native test files but exclude caches, state, plans, secrets, and real variable-values files. Review all staged content and public-safe evidence. No active workflow may ship in the source starter.
9. Only after those gates, publish with the authorized main-agent publication procedure on `dev`, record its frozen 40-character commit for the cohort, and verify an ordinary single-branch clone preserves history/license. The participant uses `main` in their own copy; do not ask them to push to the instructor source.

Native initialization/locking/validation and the actual unsupported-argument rehearsal were subsequently completed; see [verification.md](verification.md) for observed results and the [scanner exception](scanner-policy.md). Hosted GitHub execution remains a separate uncompleted classroom gate.

Local checks passed formatting for both roots, actionlint for manual/PR variants (without ShellCheck/Pyflakes), eight source-contract regressions, snippet/reference parity, local links, and PowerShell-fence parsing. The untouched starter correctly failed the optional improvement checker. Native initialization/validation and failure/recovery also passed in the coordinating release. Full counts and limitations are in [the daily report](daily%20work%20report/2026-09-22.md); GitHub rehearsal remains pending.

## Participant pre-work

- Confirm Windows PowerShell 5.1, VS Code, Git, Terraform 1.16.3, Terraform language support, and Copilot access. Preserve installed extensions. Node.js 24 is optional for the source-test exercise; Python 3.12/Checkov 3.3.19 are optional locally, installed by the quality runner itself.
- Each participant creates their own approved empty destination before class. Check actual owner/visibility and inherited rules; if they forbid the initial history import or workflow bootstrap, arrange a policy-compliant path rather than weakening protections.
- Supply the instructor source URL, frozen `dev` commit, approved anonymous participant-code convention, `southeastasia`, and peer/instructor review arrangements.
- Confirm public provider/module distribution and GitHub Actions downloads are reachable. No Azure tenant, subscription, service principal, secret, backend, or environment belongs in this lab.
- Make clear that learner commands are authorized only against their own repository. Public instructor publication does not authorize publishing private participant content.

## Teaching path and timing

| Checkpoint | Minutes | Instructor observation |
| --- | --- | --- |
| 1. Owned copy | 15 | Single-branch dev clone, verified frozen commit, owned fetch/push, first worksheet edit, default main, no workflows. |
| 2. Explanation | 8 | Learner distinguishes historical text, root/child, provider/backend, and no AKS. |
| 3. Release contract | 8 | Learner catches AzAPI versus registry suffix; retains exact root pins and six selected inputs. |
| 4. Input/output editing | 14 | Descriptions and validations actually improve; wrapper interface stays small; output rename understood. |
| 5. Native local checks | 10 | Formatting, backend-disabled init, read-only lock and validate; static versus runtime limit explained. |
| 6. Failure/recovery | 10 | Genuine unsupported argument, minimal deletion, revalidation; not invalid tfvars. |
| 7. Small commits/PR | 8 | Explicit staging, own main as base, peer route or truthful solo disclosure. |
| 8. Manual quality | 9 | Workflow first on default main, real dispatch, correct SHA/event, blocking scanner. |
| 9. Fresh automatic PR | 8 | Main-only base filter negative, fresh positive PR run, actual check required only afterward. |
| **Total** | **90** | Rehearse before committing to classroom duration; tool installation is pre-work. |

The authoritative mandatory procedure is [the root guide](../README.md), not a hidden instructor script. Four complete inline prompts have bounded selections, review criteria, and deterministic fallbacks. Copilot output may differ; evaluate the diff, not agreement with a prose answer. If no unsafe suggestion occurs, have learners explicitly reject a supplied unsafe alternative without fabricating a Copilot response.

## Workflow and branch-rule sequence

1. Publish the manual-only workflow through an allowed PR/bootstrap path; there are no named lab checks to require yet. Preserve organization restrictions throughout.
2. Dispatch on the default `main` and record the actual run. A push cannot trigger this baseline. A dispatch check is not a PR-check substitute.
3. Add `pull_request` for base `main` while retaining dispatch. The event-installation PR may itself run; the next deliberately fresh PR is still required evidence.
4. Use the temporary observation base only for a cloud-free nonmatching filter example; close that PR without merging. Reopen the same source comparison as a new PR against `main` for a matching positive control. Absence of a run by itself proves nothing.
5. Verify `pull_request`, the PR head SHA, and the evaluated merge SHA in the successful summary. Then select the real **Lab 2 quality** check if class policy requires checks. Do not require the filtered observation PR or an unavailable deployment check.
6. Authors cannot approve their own PR reviews. Use a peer/instructor when review is required; an explicitly allowed solo route is **no independent review**, not self-approval. Environment self-review settings are irrelevant because this lab has no environment.

## Answer key and bounded recovery

- **AzAPI:** release 0.4.0 uses AzAPI resources; the registry suffix is not proof of the provider implementation. `enable_preflight=false` does not make a real plan cloud-free.
- **Naming:** the root calls its input `resource_group_name`, the wrapper calls its input `name`, and AVM accepts `name`. The negative line is invalid at the AVM boundary, not at the root variable declaration.
- **Outputs:** AVM `resource_id` is renamed to local `id`; `name` and `location` pass through. Static validation cannot produce a deployed ID.
- **Validation:** the root enforces membership in `allowed_locations`, the wrapper enforces region-slug syntax, and source typing is explicit. Unknown root values during `validate` mean a passed static check does not prove all runtime rules were exercised.
- **Locks:** provider checksums/versions are locked; module versions are independently pinned. Keep both real locks, no upgrades during class, and no state/cache staging.
- **Checkov:** blocking exit status applies to its actual scan scope, not all external AVM internals. A zero-check scan is not a comprehensive pass.
- **Recovery:** save/diff the one affected file, compare its labelled snippet, correct the smallest error, repeat the same check. Do not reset participant history, remove safeguards, edit downloaded modules, change identities, or use cloud access to diagnose a static exercise.

## Still requiring a separate rehearsal

Authoring and local read-only checks cannot prove GitHub Actions policy, remote authentication, learner clone/push/default-branch handling, actual manual/automatic runs, or peer-review availability. Run those in approved owned disposable repositories with real URLs and exact commits after publication. There is no live application or Azure health endpoint to check in Lab 2.

Retain [participant evidence](evidence.md). Leave local caches ignored, preserve the completed source, and clean only the participant-owned temporary observation branch if desired. There is no workload to destroy and no dependency on another participant lab.
