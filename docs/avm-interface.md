# Lab 2 published AVM interface

Source review date: **2026-09-22**. This is release-specific evidence, not proof that a cloud deployment succeeded.

## Release and provider identity

- Registry source: [Azure/avm-res-resources-resourcegroup/azurerm 0.4.0](https://registry.terraform.io/modules/Azure/avm-res-resources-resourcegroup/azurerm/0.4.0).
- Published [requirements](https://github.com/Azure/terraform-azurerm-avm-res-resources-resourcegroup/blob/v0.4.0/terraform.tf), [inputs](https://github.com/Azure/terraform-azurerm-avm-res-resources-resourcegroup/blob/v0.4.0/variables.tf), [outputs](https://github.com/Azure/terraform-azurerm-avm-res-resources-resourcegroup/blob/v0.4.0/outputs.tf), and [implementation](https://github.com/Azure/terraform-azurerm-avm-res-resources-resourcegroup/blob/v0.4.0/main.tf) were inspected at the release tag.
- The registry suffix `/azurerm` is part of the module address. This release creates its group with `azapi_resource.this`, type `Microsoft.Resources/resourceGroups@2025-04-01`, and reads `azapi_client_config` during a real plan. It therefore does not make planning credential-free.
- The implementation calls `Azure/avm-utl-interfaces/azure` at version **0.6.0**. The AVM source pin and this nested pin are separate from provider dependency locking.
- The published moved blocks mention historical AzureRM resource addresses. They do not require introducing an AzureRM runtime provider into this fresh, state-free lab. Existing deployed state would require a separate migration review; none is performed here.

| Component | Published broad requirement | This lab's exact root selection |
| --- | --- | --- |
| Terraform CLI | `>= 1.9, < 2.0` | `= 1.16.3` |
| Azure/azapi | `~> 2.4` | `= 2.12.0` |
| azure/modtm | `~> 0.3` | `= 0.4.0` |
| hashicorp/random | `~> 3.5` | `= 3.9.1` |

With two version components, `~> 0.3` means at least 0.3 but less than 1.0; it accepts 0.4.0. Likewise `~> 2.4` permits 2.12.0 below 3.0 and `~> 3.5` permits 3.9.1 below 4.0. Do not narrow these to three-component constraints accidentally. The [root requirements](../src/terraform/versions.tf) pin exact versions, while the [local wrapper requirements](../src/terraform/modules/resource-group/versions.tf) declare compatible broad requirements and inherit the root provider configuration.

## Selected inputs, not the entire upstream interface

| Published input | Published type/default | Wrapper mapping and workshop choice |
| --- | --- | --- |
| `name` | Required `string` | `var.name`; tighter workshop naming rule than Azure's full naming grammar |
| `location` | Required non-null `string` | `var.location`; approved list enforced by the root |
| `tags` | `map(string)`, default `null` | `var.tags`, workshop default `{}` |
| `enable_telemetry` | Non-null `bool`, default `true` | Explicit **false** |
| `lock` | Object containing `kind` and optional `name`, default `null` | Explicit **null**, no management lock |
| `role_assignments` | Non-null map of role-assignment objects, default `{}` | Explicit **{}**, no role assignments |

Additional upstream optional inputs exist, including `managed_by`, `retry`, and `timeouts`. They are deliberately not exposed in the small wrapper. The supported AVM group name input is **`name`**, not `resource_group_name`; that latter name belongs only to our root interface. Inventing it on the AVM module call causes the lab's required static failure.

## Selected outputs

| Published output | Local wrapper output | Root output |
| --- | --- | --- |
| `resource_id` | `id` | `id` |
| `name` | `name` | `name` |
| `location` | `location` | `location` |

AVM also publishes `resource`, the full resource object; the lab does not expose it. `module.avm.id` is not a supported release output. The complete [wrapper output section](../src/snippets/L2-WRAPPER-OUTPUTS.tf.txt) makes the deliberate rename visible.

## What verification does and does not prove

- `fmt -check -recursive` checks formatting; `init -backend=false -lockfile=readonly` downloads dependencies and checks the real provider lock; `validate` checks the configuration/module interfaces with unknown root inputs.
- Neither backend-disabled initialization nor validation contacts Azure to prove authorization. The [AzAPI configuration](../src/terraform/providers.tf) disables preflight, not authentication. There is no real backend block or deployed state.
- The completed validation rules must be evaluated with actual values by Terraform in a suitable future test/plan context. In this lab, optional [source-contract regressions](../tests/README.md) inspect source text only; they are not a substitute for runtime evaluation.
- The blocking Checkov command deliberately does not download external modules. Applicable AzAPI check counts may be zero. A clean exit is not evidence that external AVM internals, Azure RBAC, Azure Policy, or a deployment were verified.
- Real provider-lock generation and Windows/Linux dependency validation are separate publication gates owned by the coordinating author. Never fabricate hashes or create an empty lock to pass a file-existence check.
