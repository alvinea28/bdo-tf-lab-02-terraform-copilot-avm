# Lab 2 source alignment and attribution

## Frozen sample

Upstream: [Azure-Samples/terraform-github-actions at 2e6dee79491254d4eea193b1691d2c85fd32af0f](https://github.com/Azure-Samples/terraform-github-actions/tree/2e6dee79491254d4eea193b1691d2c85fd32af0f).
The sample's [MIT license](https://github.com/Azure-Samples/terraform-github-actions/blob/2e6dee79491254d4eea193b1691d2c85fd32af0f/LICENSE.md) carries Copyright (c) Microsoft Corporation. The local [LICENSE](../LICENSE) retains that notice and adds Copyright (c) 2026 Alvine Aurelio for workshop adaptations.

The workshop does not claim upstream authors supplied this AVM wrapper, exact dependency pins, participant exercises, or tests. External module/provider dependencies retain their own licenses and are not vendored here.

| Frozen upstream concept | Supplied Lab 2 source | Deliberate adaptation |
| --- | --- | --- |
| [main resource](https://github.com/Azure-Samples/terraform-github-actions/blob/2e6dee79491254d4eea193b1691d2c85fd32af0f/main.tf) | [historical resource extract](../src/reference/upstream-resource.tf.txt) | Only the attributed resource block, kept as nonexecutable text; no upstream provider/backend imported. |
| [untyped inputs](https://github.com/Azure-Samples/terraform-github-actions/blob/2e6dee79491254d4eea193b1691d2c85fd32af0f/variables.tf) | [working inputs](../src/terraform/variables.tf), [completed input section](../src/snippets/L2-INPUTS.tf.txt) | Valid typed starter, then useful descriptions, null rejection, lab naming, approved region list, and tags. |
| [sample values](https://github.com/Azure-Samples/terraform-github-actions/blob/2e6dee79491254d4eea193b1691d2c85fd32af0f/terraform.tfvars) | [anonymous example](../src/terraform/terraform.tfvars.example) | rg-bdo-lab02-learner01 and southeastasia; example is not auto-loaded and contains no credentials. |
| No AVM/local wrapper in sample | [local wrapper](../src/terraform/modules/resource-group/main.tf) | Published AVM 0.4.0 through AzAPI; wrapper is ordinary workshop code, not independently Azure Verified. |
| [Terraform Unit Tests workflow](https://github.com/Azure-Samples/terraform-github-actions/blob/2e6dee79491254d4eea193b1691d2c85fd32af0f/.github/workflows/tf-unit-tests.yml) | [inactive quality source](../src/workflows/terraform-quality.yml) | Retain fmt/init-without-backend/validate/Checkov approach; manual first, then PR, exact pins, blocking scanner, no push baseline or unavailable SARIF integration. |
| Cloud backend/OIDC and plan/apply | Not imported into Lab 2 | This lab deliberately has no backend, Azure login, plan, apply, environment, or AzureRM runtime dependency. |
| No provider lock or input fixture | [root requirements](../src/terraform/versions.tf), [source-regression tests](../tests/input-contract.test.mjs) | Exact versions, release-gated real Windows/Linux provider locks, and narrow static-improvement tests. |

The upstream workflow name does not imply it executes native Terraform tests. Our optional JavaScript tests are expressly source-contract tests; neither naming convention nor a green static check proves runtime correctness.

## Source-to-guide checkpoints

| Guide checkpoint | Local source / evidence |
| --- | --- |
| 1: owned clone/import | [participant record](participant.md), [ignore rules](../.gitignore), [line endings](../.gitattributes) |
| 2: explanation | [historical resource](../src/reference/upstream-resource.tf.txt), [root module](../src/terraform/main.tf) |
| 3: published contract | [AVM release note](avm-interface.md), [L2-MODULE](../src/snippets/L2-MODULE.tf.txt), [L2-WRAPPER](../src/snippets/L2-WRAPPER.tf.txt) |
| 4: bounded improvement | [L2-INPUTS](../src/snippets/L2-INPUTS.tf.txt), [L2-WRAPPER-INPUTS](../src/snippets/L2-WRAPPER-INPUTS.tf.txt) |
| 4: outputs and values | [L2-OUTPUTS](../src/snippets/L2-OUTPUTS.tf.txt), [L2-WRAPPER-OUTPUTS](../src/snippets/L2-WRAPPER-OUTPUTS.tf.txt), [L2-VALUES](../src/snippets/L2-VALUES.tfvars.txt) |
| 5: native/static checks | [version pins](../src/terraform/versions.tf), [test instructions](../tests/README.md) |
| 6: genuine interface failure | [unsupported assignment](../src/snippets/L2-UNSUPPORTED-ARGUMENT.tf.txt), [completed wrapper](../src/reference/solution/modules/resource-group/main.tf) |
| 7: review and owned PR | [evidence worksheet](evidence.md) |
| 8: manual quality | [L2-MANUAL-QUALITY](../src/workflows/terraform-quality.yml) |
| 9: fresh automatic PR | [L2-PR-EVENTS](../src/snippets/L2-PR-EVENTS.yml.txt), [evidence worksheet](evidence.md) |

## Explanation answer checkpoints

1. A Terraform **root module** is the working directory passed to `-chdir`. This lab's working root is the directory containing [its main configuration](../src/terraform/main.tf).
2. A **child module** receives input values from a caller. The local wrapper forwards three inputs to a published module and deliberately renames one output.
3. A **provider** implements resources/data sources; a module groups configuration. A registry module namespace suffix does not establish its actual runtime provider.
4. A **backend** stores state. Backend type and provider identity are separate; a future Azure Blob backend does not imply the AzureRM resource provider is required.
5. A **GitHub environment** is an Actions deployment context/protection boundary, not a Terraform directory. A **Terraform workspace** selects state within a backend; this lab never changes the default workspace.
6. The historical `rg-aks` label creates only a resource group. There is no existing deployed state to migrate, and changing providers/module addresses on deployed infrastructure is not taught as a safe automatic refactor.

## Safety and evidence boundary

All workshop-authored source is in this repository. Nothing downloads code from another lab. Terraform initialization downloads pinned external modules/providers; Actions and Checkov require public distribution access. "Self-contained" does not mean an offline provider bundle.

Templates remain outside the Actions workflow discovery directory until the learner copies them at the stated checkpoint. The complete solution is outside the working root and not included in its `fmt`, `validate`, or scanner path. Git history does not copy repository rules, secrets, environments, or Azure federation.

Current authoring, local validation, publication, and rehearsal status are separate in [the instructor guide](instructor.md) and [the daily report](daily%20work%20report/2026-09-22.md). Expected outputs in the participant guide are not claims of runs already performed.
