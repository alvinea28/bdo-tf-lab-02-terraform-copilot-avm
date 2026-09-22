# Lab 2 - Terraform, Copilot, and an AVM-backed local module

**90 minutes | Windows PowerShell 5.1 | no Azure login or deployment**
Build a reviewed root -> local wrapper -> published Azure Verified Module (AVM) configuration, diagnose a real module-interface failure, then run credential-free quality checks manually and on a fresh PR.
This is a standalone lab. Do not copy files, Git metadata, state, or credentials from another lab.

## Before starting

- Use VS Code, Git, Terraform **1.16.3**, the Terraform extension, and working GitHub Copilot access. The optional source-contract exercise uses Node.js 24; the optional local scanner uses Python 3.12 and Checkov 3.3.19.
- Obtain the instructor's frozen 40-character starter commit on `dev` from the source repository: <https://github.com/alvinea28/bdo-tf-lab-02-terraform-copilot-avm>. Publication and rehearsal status are in [docs/instructor.md](docs/instructor.md).
- Pre-create your **own empty repository**, using approved visibility; add no README, license, or ignore file in GitHub. Public source publication does not authorize publishing confidential participant information.
- Respect inherited organization rules. If initial import or workflow installation is restricted, arrange a compliant bootstrap with the instructor; do not bypass rules or force-push.
- Never run `plan`, `apply`, `destroy`, `import`, Azure CLI, or backend/state commands in this lab. No Azure settings, secrets, OIDC trust, or environment are needed.
- Instructor release gate: genuine Windows/Linux provider locks must accompany the starter and reference. If checkpoint 5 reports a missing lock, stop; do not generate or weaken it as a learner.

The active root starts valid but has terse descriptions and no workshop input validation. [src/reference/README.md](src/reference/README.md) explains the complete solution; inspect it only after attempting the relevant exercise. All workflow templates start outside Actions discovery. Preserve [LICENSE](LICENSE) and [docs/source-alignment.md](docs/source-alignment.md).

## 1. Clone, establish ownership, and make the first edit (15 min)

Start in a parent folder for learner repositories, not another lab. Replace both uppercase placeholders below before running. Keep this PowerShell terminal open; its helpers are used throughout. Do not change globally selected Git or Azure identities.

```powershell
$ErrorActionPreference = 'Stop'
function Assert-Native([string]$Step) { if ($global:LASTEXITCODE -ne 0) { throw "$Step failed; stop and inspect the output." } }
$Source = 'https://github.com/alvinea28/bdo-tf-lab-02-terraform-copilot-avm.git'
$Destination = 'https://github.com/REPLACE-WITH-YOUR-OWNER/REPLACE-WITH-YOUR-EMPTY-LAB02-REPOSITORY.git'
$StarterCommit = 'REPLACE-WITH-INSTRUCTOR-40-CHARACTER-STARTER-COMMIT'
if ($Destination -match 'REPLACE-' -or $StarterCommit -notmatch '^[a-fA-F0-9]{40}$') { throw 'Fill the destination and frozen source commit first.' }
if (($Destination.TrimEnd('/') -replace '\.git$', '') -eq ($Source -replace '\.git$', '')) { throw 'The instructor source is not your destination.' }
git clone --branch dev --single-branch https://github.com/alvinea28/bdo-tf-lab-02-terraform-copilot-avm.git .\bdo-tf-lab-02-terraform-copilot-avm
Assert-Native 'Clone'
Set-Location .\bdo-tf-lab-02-terraform-copilot-avm
$LabRoot = (Get-Location).Path
$ActualCommit = git rev-parse HEAD; Assert-Native 'Read starter commit'
if ($ActualCommit -ne $StarterCommit) { throw 'Starter revision differs; ask the instructor before proceeding.' }
$Existing = @(git ls-remote --heads --tags $Destination); Assert-Native 'Inspect destination'
if ($Existing.Count -ne 0) { throw 'Destination is not empty; do not overwrite its history.' }
git branch -m main; Assert-Native 'Rename local branch'
git remote remove origin; Assert-Native 'Remove instructor remote'
git remote add origin $Destination; Assert-Native 'Add owned remote'
function Assert-OwnedRemote {
  $Fetch = git remote get-url origin; Assert-Native 'Read fetch URL'
  $Push = git remote get-url --push origin; Assert-Native 'Read push URL'
  if ($Fetch -ne $Destination -or $Push -ne $Destination) { throw 'Unexpected fetch or push destination.' }
  git remote -v; Assert-Native 'Show destinations'
}
Assert-OwnedRemote
git branch --show-current; Assert-Native 'Read branch'
Get-ChildItem -LiteralPath '.github\workflows' -File -ErrorAction SilentlyContinue
code .
```

Expected: local branch `main`; both displayed `origin` URLs are **your destination**; no active workflow files. Source history remains intact. Confirm the repository owner in GitHub; remote text alone is not an authorization check. If a credential prompt appears, authenticate normally without recording tokens.
Open [docs/participant.md](docs/participant.md), fill the anonymous participant code, owned URL, starter commit, and approved visibility, then save. Do not add email, tenant identifiers, or credentials. Review and push only that edit:

```powershell
git diff -- docs/participant.md
git add -- docs/participant.md; Assert-Native 'Stage participant record'
git diff --cached --check; Assert-Native 'Check staged whitespace'
git diff --cached
git commit -m "docs: record Lab 2 participant ownership"; Assert-Native 'Commit participant record'
Assert-OwnedRemote
git push -u origin main; Assert-Native 'Initial owned push'
git switch -c feat/avm-wrapper; Assert-Native 'Create exercise branch'
```

In **your repository -> Code**, verify the guide and participant edit. Under **Settings -> General -> Default branch**, verify/select `main`. Under **Actions**, expect no lab workflow run from this push. Git transfers history, not source-repository settings. If Git lacks author information, stop for local setup; do not silently replace an existing identity.

## 2. Explain before changing code (8 min)

On `feat/avm-wrapper`, open the historical [resource extract](src/reference/upstream-resource.tf.txt), root [main](src/terraform/main.tf), [inputs](src/terraform/variables.tf), and [provider requirements](src/terraform/versions.tf). The extract is nonexecutable text, not a resource to import or deploy.

**Copilot prompt 1 - explanation.** Select the entire resource block in the extract; attach the three working files above as context. Paste exactly:

> Explain only the selected historical resource and the attached Lab 2 root configuration. Trace root inputs, the local child module, provider requirements, and where a backend would belong in a later cloud lab. Explain why the rg-aks label does not create AKS and why the .tf.txt extract is not executable. Do not edit files, invent a backend, read secrets, execute commands automatically, push, or perform any cloud mutations. A human will run all commands. Limit the answer to six bullets and identify anything the selected source cannot prove.

Accept only: one resource group, no AKS, variables are inputs, the local wrapper is a child module, providers implement resources, and a backend stores state rather than selecting a provider. Reject claims of deployed resources or successful Azure access.
Fallback: [docs/source-alignment.md](docs/source-alignment.md) gives those distinctions. Record one explanation in [docs/evidence.md](docs/evidence.md). **Question:** why is a `module` block not a GitHub environment or a Terraform workspace?

## 3. Check the published release and inspect the wrapper (8 min)

Read [docs/avm-interface.md](docs/avm-interface.md), including its links to **v0.4.0**, not a moving main branch. AVM's registry name ends in `/azurerm` but this release uses **AzAPI**, not an AzureRM runtime provider.
Terraform is pinned to 1.16.3. Root provider pins are `Azure/azapi` 2.12.0, `azure/modtm` 0.4.0, and `hashicorp/random` 3.9.1. The published broad constraints `~> 2.4`, `~> 0.3`, and `~> 3.5` allow those minor versions; they do not mean `~> 2.4.0`, `~> 0.3.0`, or `~> 3.5.0`.

**Copilot prompt 2 - published-release interface check.** Select all of [wrapper main](src/terraform/modules/resource-group/main.tf) and attach [the interface note](docs/avm-interface.md) and [root versions](src/terraform/versions.tf). Paste exactly:

> Check only this selected wrapper against Azure/avm-res-resources-resourcegroup/azurerm release 0.4.0 and the attached release evidence. List whether name, location, tags, enable_telemetry, lock, and role_assignments are published inputs, and whether resource_id, name, and location are published outputs. Explain AzAPI versus the azurerm registry suffix and the exact root pins versus broad child constraints. Do not assume the repository main branch matches this release. Do not edit, install, read secrets, execute commands automatically, push, or perform cloud mutations; a human runs commands. If evidence is unavailable, mark it unverified and use the supplied release note, not a guessed argument.

Accept only the six supplied inputs, the three selected outputs, and the actual provider; other optional upstream inputs are outside the exercise. Reject `resource_group_name` as an AVM argument, `module.avm.id`, new credentials, extra resources, or unpinned versions. Fallback: the release table in [docs/avm-interface.md](docs/avm-interface.md).
Now inspect each source below, then in VS Code replace **the entire destination file** with its complete labelled section, including comments. These reinforce the already valid scaffold rather than adding another module:

| Source section | Destination |
| --- | --- |
| [L2-MODULE](src/snippets/L2-MODULE.tf.txt) | [src/terraform/main.tf](src/terraform/main.tf) |
| [L2-WRAPPER](src/snippets/L2-WRAPPER.tf.txt) | [src/terraform/modules/resource-group/main.tf](src/terraform/modules/resource-group/main.tf) |

Keep the local source `./modules/resource-group`; the child requires Terraform `>= 1.9, < 2.0`. Leave telemetry `false`, lock `null`, and role assignments `{}`. These explicit workshop choices prevent optional telemetry, locks, and RBAC additions; they are not all upstream defaults. The workshop wrapper is **not itself Azure Verified**.

## 4. Improve descriptions, types, and validation (14 min)

Select all declarations in [wrapper inputs](src/terraform/modules/resource-group/variables.tf), attach [root inputs](src/terraform/variables.tf), [L2-INPUTS](src/snippets/L2-INPUTS.tf.txt), and [L2-WRAPPER-INPUTS](src/snippets/L2-WRAPPER-INPUTS.tf.txt). Keep provider and module files out of the edit selection.

**Copilot prompt 3 - bounded improvement.** Paste exactly:

> Propose edits only to the selected wrapper inputs and attached root inputs, following the supplied L2 input sections. Preserve names and explicit string, map(string), and list(string) types; use nullable=false and descriptions explaining purpose, format, and non-secret values. Enforce ^rg-bdo-lab02-[a-z0-9-]{3,30}$ for names, root location membership in allowed_locations with default ["southeastasia"], wrapper region-slug syntax, and non-empty tag keys/values. Keep the wrapper interface name/location/tags; do not add allowed_locations to AVM. Preserve source/version pins, provider configuration, resource count, and the absence of a backend. Show and explain the diff. Do not read secrets, execute commands automatically, push, or perform cloud mutations; a human reviews and runs all commands.

Review each hunk: (1) useful descriptions, (2) unchanged explicit types, (3) exact name regex, (4) root allowlist versus wrapper syntax, (5) anonymous non-secret tags, (6) no provider/backend/workflow changes. Reject extra resources or an invented AVM parameter. Explain an accepted and a rejected suggestion in [docs/evidence.md](docs/evidence.md).
If Copilot is unavailable or differs from the bounded contract, inspect and copy the **entire** [L2-INPUTS](src/snippets/L2-INPUTS.tf.txt) into [root inputs](src/terraform/variables.tf), and [L2-WRAPPER-INPUTS](src/snippets/L2-WRAPPER-INPUTS.tf.txt) into [wrapper inputs](src/terraform/modules/resource-group/variables.tf). Compare rather than replacing the whole solution directory.
Root membership validation can reference `allowed_locations` on Terraform 1.16.3. An allowlist in source is not an Azure permission boundary. Empty tag maps remain allowed; the example supplies useful tags. Regex rules deliberately allow lowercase letters, digits, and hyphens, not a claimed globally unique Azure name.

Copy these complete output sections after reading the value expressions:

| Source section | Replace entire destination |
| --- | --- |
| [L2-WRAPPER-OUTPUTS](src/snippets/L2-WRAPPER-OUTPUTS.tf.txt) | [wrapper outputs](src/terraform/modules/resource-group/outputs.tf) |
| [L2-OUTPUTS](src/snippets/L2-OUTPUTS.tf.txt) | [root outputs](src/terraform/outputs.tf) |
| [L2-VALUES](src/snippets/L2-VALUES.tfvars.txt) | [example participant values](src/terraform/terraform.tfvars.example) |

Change `learner01` in the example name and owner tag to your anonymous suffix; keep `southeastasia`. Save the example, not real credentials. The example extension is intentionally not auto-loaded by Terraform. No actual variable-values file is needed for static validation.
Trace `resource_group_name -> name -> AVM name` and `AVM resource_id -> wrapper id -> root id`. `validate` does not produce those output values; there is no deployed state to inspect.

## 5. Run native local checks and inspect the lock (10 min)

All following commands start at `$LabRoot`. They contact public dependency registries during initialization, **not Azure**. [src/terraform/providers.tf](src/terraform/providers.tf) sets `enable_preflight = false`; this does not authorize a real plan or bypass authentication.

```powershell
Set-Location $LabRoot
$Version = (terraform version -json | ConvertFrom-Json).terraform_version; Assert-Native 'Read Terraform version'
if ($Version -ne '1.16.3') { throw 'Use exactly Terraform 1.16.3.' }
if (-not (Test-Path -LiteralPath '.\src\terraform\.terraform.lock.hcl')) { throw 'Instructor provider lock is missing; stop.' }
if (-not (Test-Path -LiteralPath '.\src\reference\solution\.terraform.lock.hcl')) { throw 'Reference provider lock is missing; stop.' }
$LockBefore = (Get-FileHash '.\src\terraform\.terraform.lock.hcl' -Algorithm SHA256).Hash
terraform -chdir=src/terraform fmt -check -recursive
Assert-Native 'Formatting check'
terraform -chdir=src/terraform init -backend=false -lockfile=readonly -input=false -no-color
Assert-Native 'Backend-disabled initialization'
terraform -chdir=src/terraform validate -no-color
Assert-Native 'Static validation'
if ((Get-FileHash '.\src\terraform\.terraform.lock.hcl' -Algorithm SHA256).Hash -ne $LockBefore) { throw 'The provider lock changed unexpectedly.' }
git diff -- src/terraform
```

Expected: formatting is silent with exit 0; initialization downloads the pinned module/providers and ends `Terraform has been successfully initialized!`; validation ends `Success! The configuration is valid.` with exit 0. Initialization advice about planning is generic: **do not follow it in Lab 2**.
If formatting fails, run `terraform -chdir=src/terraform fmt -recursive`, review the diff, then repeat the three checks. If dependencies/lock hashes fail, stop for instructor reconciliation; do not use `-upgrade`, remove the lock, weaken pins, or add Azure credentials.
Inspect the committed lock in VS Code: it locks **provider** versions/checksums, not registry module code; AVM and its interfaces dependency have separate module pins. [Ignore rules](.gitignore) exclude caches, state, plans, and local variable files but retain locks and native test files. Never stage the entire repository blindly.
Optional source-only regression and before/after check, with Node.js 24 already installed:

```powershell
node --test .\tests\input-contract.test.mjs; Assert-Native 'Eight source-contract regressions'
node .\tests\check-input-contract.mjs; Assert-Native 'Completed input source contract'
```

Expected: eight passes/zero failures and `Lab 2 input source contract: PASS (not runtime Terraform validation).` The checker deliberately fails the untouched starter; [tests/README.md](tests/README.md) explains its narrow source-text rubric and fixture.
**Limit:** successful `fmt`, `init`, and `validate` do not evaluate every runtime variable rule, establish Azure access, guarantee a plan, or scan all external AVM code. Invalid values in a variable-values file are not a reliable negative test for `validate`.

## 6. Cause a genuine unsupported-argument failure, then recover (10 min)

In [wrapper main](src/terraform/modules/resource-group/main.tf), inside `module "avm"`, immediately after `name = var.name`, insert only the assignment line from [L2-UNSUPPORTED-ARGUMENT](src/snippets/L2-UNSUPPORTED-ARGUMENT.tf.txt). Keep the existing `name` assignment. Do not copy the snippet as another executable file.

```powershell
terraform -chdir=src/terraform validate -no-color
if ($LASTEXITCODE -eq 0) { throw 'Expected unsupported-argument rejection; check the insertion location.' }
```

Expected: nonzero exit and `Error: Unsupported argument`, naming `resource_group_name` in the wrapper's AVM call; the message says an argument with that name is not expected. A backend, missing-module, or authentication error is **not** this evidence. Record the exact diagnostic locally in [docs/evidence.md](docs/evidence.md), not secrets or whole provider logs.

**Copilot prompt 4 - actual error diagnosis.** Select the entire faulty `module "avm"` block; attach only that actual validation diagnostic and [the release interface](docs/avm-interface.md). Paste exactly:

> Diagnose this actual Terraform validate error using only the selected module call, attached diagnostic, and AVM release 0.4.0 interface. Identify the unsupported argument and propose the smallest correction while retaining the existing supported name argument. Do not declare a new variable inside the external module, switch providers/releases, remove validation, or suggest testing invalid tfvars with validate. Explain why this is an interface error, not proof of an Azure problem. Do not read secrets, execute commands automatically, push, or perform cloud mutations; a human makes the correction and reruns checks.

Accept only deletion of the extra `resource_group_name = var.name` line; the already present `name = var.name` is correct. Reject editing downloaded modules, ignoring errors, or changing provider credentials. Fallback: compare with [L2-WRAPPER](src/snippets/L2-WRAPPER.tf.txt) and remove that one line manually.

```powershell
terraform -chdir=src/terraform fmt -check -recursive; Assert-Native 'Recovered formatting'
terraform -chdir=src/terraform validate -no-color; Assert-Native 'Recovered validation'
git diff --check; Assert-Native 'Working diff whitespace'
```

Expected: exit 0 and the success message again. Do not commit the intentional defect. **Question:** why can this failure be detected without evaluating participant values or calling Azure?

## 7. Review, commit small changes, and open your first PR (8 min)

Still on `feat/avm-wrapper`, save your local-check and Copilot evidence. Review each staged diff before its commit; confirm the lock has not changed and caches/state are absent. A new terminal must re-establish the helpers and verified destination from checkpoint 1 before any push.

```powershell
git status --short
git add -- src/terraform/main.tf src/terraform/variables.tf src/terraform/modules/resource-group/main.tf src/terraform/modules/resource-group/variables.tf
git diff --cached --check; Assert-Native 'Input diff whitespace'
git diff --cached
git commit -m "feat: document and validate Lab 2 wrapper inputs"; Assert-Native 'Commit input improvement'
git add -- src/terraform/outputs.tf src/terraform/modules/resource-group/outputs.tf src/terraform/terraform.tfvars.example docs/evidence.md
git diff --cached --check; Assert-Native 'Output diff whitespace'
git diff --cached
git commit -m "feat: expose AVM outputs and record local checks"; Assert-Native 'Commit outputs and evidence'
Assert-OwnedRemote
git push -u origin feat/avm-wrapper; Assert-Native 'Push owned feature branch'
```

In **your repository -> Pull requests -> New pull request**, choose **base `main`**, compare `feat/avm-wrapper`; never select the instructor/upstream repository. Review **Files changed** and ask the assigned peer/instructor to review; the author cannot approve their own PR. Follow existing rules, then the author merges. No quality check exists yet: do not invent a required check. A permitted solo route records **no independent review**.

```powershell
git switch main; Assert-Native 'Return to main'
git pull --ff-only origin main; Assert-Native 'Read merged main'
git status --short
```

Expected: clean working tree and merged inputs/outputs on owned `main`; no workflow run and no Azure resources. Record the PR URL/merge commit. If histories diverge, inspect with the instructor rather than resetting or forcing.

## 8. Install the manual-only quality workflow, then dispatch (9 min)

Read the **whole L2-MANUAL-QUALITY** template in [src/workflows/terraform-quality.yml](src/workflows/terraform-quality.yml). It uses Ubuntu 24.04/Bash, SHA-pinned Actions, Python 3.12, Terraform 1.16.3, a 15-minute timeout, `contents: read`, no persisted Git credential, and no Terraform command wrapper.
The blocking scanner is Checkov 3.3.19: `checkov -d src/terraform --framework terraform --download-external-modules false`. It scans the working source only; zero applicable AzAPI checks is possible, **not complete AVM/security coverage**. No soft-fail, SARIF upload, CodeQL, Azure login, or environment is configured.
Read [docs/scanner-policy.md](docs/scanner-policy.md): the exact registry AVM call carries one documented `CKV_TF_1` exception because that rule accepts only Git-ref syntax. Module-version check `CKV_TF_2` and other applicable findings remain blocking; record the skip, not an exception-free pass.
Under **Settings -> Actions -> General**, confirm Actions and these pinned actions are permitted by policy. Retain the read-only token policy; do not add secrets or OIDC permission. Copy the entire template only now:

```powershell
git switch -c feat/manual-quality; Assert-Native 'Create workflow branch'
New-Item -ItemType Directory -Path '.github\workflows' -Force | Out-Null
Copy-Item -LiteralPath '.\src\workflows\terraform-quality.yml' -Destination '.\.github\workflows\terraform-quality.yml'
Get-Content -LiteralPath '.\.github\workflows\terraform-quality.yml'
git add -- .github/workflows/terraform-quality.yml
git diff --cached --check; Assert-Native 'Workflow whitespace'
git diff --cached
git commit -m "ci: install manual credential-free quality"; Assert-Native 'Commit manual workflow'
Assert-OwnedRemote
git push -u origin feat/manual-quality; Assert-Native 'Push workflow branch'
```

Open/merge a PR into **your `main`** using checkpoint 7's review rules. Then run `git switch main` and `git pull --ff-only origin main`, checking each exit. Expected: no run merely from a push/merge; only `workflow_dispatch` is configured.
In **Actions -> Lab 2 Terraform Quality -> Run workflow**, choose **main -> Run workflow**. Read every step and the summary: event `workflow_dispatch`, ref `refs/heads/main`, evaluated commit equal to current main, status success. Record the URL and actual Checkov passed/failed/skipped counts, including zero. Do not describe scanner installation or zero findings as full security coverage.
If the button is missing, verify the active file exists on the default `main` branch and Actions policy allows it. Fix YAML/path/pin/download issues via a small PR; never remove a failing scanner/validation step. A green manual run does not satisfy a required PR check.
Optional local scan, only with preinstalled Python 3.12 and Checkov 3.3.19, from the repository root:

```powershell
python --version
checkov --version
checkov -d src/terraform --framework terraform --download-external-modules false
Assert-Native 'Optional blocking local scan'
```

## 9. Add the PR event and prove a fresh automatic run (8 min)

On updated `main`, create `feat/quality-pr-event`. In the **active workflow**, replace only its `on` block with the entire [L2-PR-EVENTS](src/snippets/L2-PR-EVENTS.yml.txt) section. Retain `workflow_dispatch`; add `pull_request` targeting `main`. Leave jobs, pins, scanner, permissions, and timeout unchanged. Do not add `push` or `pull_request_target`.

```powershell
git switch -c feat/quality-pr-event; Assert-Native 'Create event branch'
# Make and save the specified on-block edit in VS Code before continuing.
git diff -- .github/workflows/terraform-quality.yml
git add -- .github/workflows/terraform-quality.yml
git diff --cached --check; Assert-Native 'Event whitespace'
git commit -m "ci: add main-targeting PR quality event"; Assert-Native 'Commit PR event'
Assert-OwnedRemote
git push -u origin feat/quality-pr-event; Assert-Native 'Push event change'
```

Review/merge this PR into your `main`. If it already runs a PR check, keep that evidence, but still perform the **fresh** positive control below; do not substitute a rerun of the earlier dispatch.

```powershell
git switch main; Assert-Native 'Return to main'
git pull --ff-only origin main; Assert-Native 'Read event installation'
git branch lab02-filter-observation; Assert-Native 'Create temporary nonmatching base'
Assert-OwnedRemote
git push origin lab02-filter-observation; Assert-Native 'Publish owned observation base'
git switch -c feat/quality-positive; Assert-Native 'Create fresh exercise branch'
```

In [root inputs](src/terraform/variables.tf), append ` Use the approved cohort region.` inside the `location` description. Change no expression, type, default, or provider. This harmless source change gives the check a new head commit.

```powershell
terraform -chdir=src/terraform fmt -check -recursive; Assert-Native 'Fresh-PR formatting'
terraform -chdir=src/terraform validate -no-color; Assert-Native 'Fresh-PR validation'
git diff -- src/terraform/variables.tf
git add -- src/terraform/variables.tf
git diff --cached --check; Assert-Native 'Fresh-PR whitespace'
git commit -m "docs: clarify the approved region input"; Assert-Native 'Commit fresh edit'
Assert-OwnedRemote
git push -u origin feat/quality-positive; Assert-Native 'Push fresh feature'
git rev-parse HEAD; Assert-Native 'Record fresh head'
```

1. Push alone should not run quality: there is no push event. Open a **non-draft PR with base `lab02-filter-observation`**, compare `feat/quality-positive`. The main-only base filter excludes this PR. Inspect the published event block and Actions policy; record the absence, then **close without merging**. Do not make this deliberately filtered PR a required-check gate.
2. Open a **new non-draft PR with base `main`**, same compare branch. Without selecting Run workflow, observe **Lab 2 quality** under Checks and the new Actions run. Require event `pull_request` and the fresh PR head SHA in its summary. The evaluated `github.sha` is normally a synthetic PR merge commit, not the head SHA; both are recorded.
3. The successful matching run is the positive control for the earlier filter observation. If no run appears, inspect YAML indentation/base/events, Actions policy, and the installed commit; do not infer success from silence or replace it with a manual run.
4. Only now, if the class requires protection, use **Settings -> Rules -> Rulesets** (or **Branches -> branch protection**) for `main`, require PRs and the **actual successful Lab 2 quality check**, and select the agreed peer-review rule. Do not require a manual-only check or a nonexistent deployment. Preserve inherited protections; no bypass.
5. After current checks and any required peer approval pass, the author merges. No push-triggered deployment follows. Record both PR URLs, the automatic run URL, event, head/merge SHAs, and scan scope in [docs/evidence.md](docs/evidence.md). Delete only your unused observation branch when ready.

## Finish, evidence, and recovery

Complete [docs/evidence.md](docs/evidence.md); retain the worksheet locally or submit a short evidence-only PR using checkpoint 7's explicit file staging/review sequence with a new branch name. Do not paste provider logs, tokens, raw state, or plans. This lab creates no Azure resources, so there is nothing to destroy. Local dependency caches can remain ignored; preserve source and evidence.

| Checkpoint | Pass condition / bounded recovery |
| --- | --- |
| Ownership | Both URLs owned, `main` default, no initial workflows; stop on wrong destination or unexpected history. |
| Copilot and module | Explain an accepted/rejected suggestion; recover one selected file from its supplied snippet, never reset the repository. |
| Native checks | Correct CLI and unchanged real lock; resolve downloads with the instructor, never add Azure credentials. |
| Negative case | Actual unsupported argument then success after deleting it; missing modules are a different failure. |
| GitHub quality | Manual run before fresh automatic PR run; inspect event/ref/head SHA, not just a green badge. |
| Security claims | Record actual Checkov counts and external-module exclusion; zero checks is not full coverage. |

Answer: Why is AVM not an AzureRM provider here? Why is `id` a wrapper output but `resource_id` an AVM output? What does the provider lock not pin? Which input rules need runtime evaluation? Why cannot a manual dispatch stand in for PR evidence?
Instructor answers and remaining rehearsal gates: [docs/instructor.md](docs/instructor.md). Source attribution: [docs/source-alignment.md](docs/source-alignment.md). Lab 3 supplies its own baseline; do not transfer this repository's state, settings, or unfinished code.
