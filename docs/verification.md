# Source verification - 2026-09-22

## Observed locally

- Native Terraform **1.16.3** formatting, backend-disabled initialization, and validation passed for **both starter and reference**.
- Genuine provider locks were generated from signed provider downloads for **windows_amd64 and linux_amd64**. Repeated `init -backend=false -lockfile=readonly` preserved their bytes. Linux provider checksum coverage is not a claim that a Linux-hosted workflow ran.
- Source-contract tests: **8 passed, 0 failed**. The deliberately terse starter is rejected by the optional improvement checker as intended.
- An isolated fresh learner copy applied **all seven supplied source sections**, initialized with the existing read-only lock, and validated. Inserting the extra AVM `resource_group_name` argument produced the actual **Unsupported argument** diagnostic; removing it restored valid formatting/validation. Starter and lock bytes remained unchanged.
- Manual and assembled PR quality workflows passed actionlint **1.7.12**. ShellCheck/Pyflakes were not run. PowerShell guide fences parsed without execution of remote steps.
- Checkov **3.3.19**, separately for starter/reference: **1 passed, 0 failed, 1 skipped, 0 parsing errors, 0 Azure resources scanned**. The [registry-module exception](scanner-policy.md) is explicit. An unpinned-module negative control failed both `CKV_TF_1` and `CKV_TF_2`, proving the scanner remains blocking.
- Local links, source/snippet/reference parity, syntax, whitespace, inactive-workflow and publication exclusions passed the coordination workspace checks.

## Not claimed

No Azure authentication, plan, apply, destroy, or deployed application exists for this lab. No hosted Actions run, participant PR/review, or GitHub trigger exercise is credited by local tests. Checkov's source-only module findings are **not comprehensive AVM/AzAPI coverage**.

Instructor source uses **dev**; learner copies use **main**. Record actual classroom evidence separately in [evidence.md](evidence.md), and use the frozen source commit assigned by the instructor.
