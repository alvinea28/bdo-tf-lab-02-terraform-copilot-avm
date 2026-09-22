# Complete reference and historical comparison

The [historical resource extract](upstream-resource.tf.txt) is a Microsoft MIT-licensed block from the frozen Azure sample. It is deliberately nonexecutable text. Do not rename it, import it into the working root, or deploy it before introducing the wrapper.

## Complete checkpoint solution

The solution is a small, complete Terraform configuration supplied **inside this lab**. It is outside the learner working root and workflow discovery. It has no remote backend and must not be planned/applied in Lab 2. The absence of a backend does not make a live plan safe.

| Complete source | Purpose |
| --- | --- |
| [solution/main.tf](solution/main.tf) | Root -> local wrapper call, one group module. |
| [solution/variables.tf](solution/variables.tf) | Explicit types, descriptive inputs, name rule, allowed region list, non-empty tag entries. |
| [solution/outputs.tf](solution/outputs.tf) | Root id/name/location values. |
| [solution/versions.tf](solution/versions.tf) | Exact Terraform/provider pins, no AzureRM runtime provider. |
| [solution/providers.tf](solution/providers.tf) | AzAPI with preflight disabled; not an authentication bypass. |
| [solution/terraform.tfvars.example](solution/terraform.tfvars.example) | Synthetic, non-auto-loaded learner values. |
| [solution/modules/resource-group/main.tf](solution/modules/resource-group/main.tf) | Published AVM 0.4.0 with explicit telemetry/lock/RBAC choices. |
| [solution/modules/resource-group/variables.tf](solution/modules/resource-group/variables.tf) | Minimal wrapper interface name/location/tags and validation. |
| [solution/modules/resource-group/outputs.tf](solution/modules/resource-group/outputs.tf) | Explicit resource_id -> id mapping. |
| [solution/modules/resource-group/versions.tf](solution/modules/resource-group/versions.tf) | Terraform >= 1.9, < 2.0 and compatible provider requirements. |

A genuine provider dependency lock must be generated for this root and the starter by the coordinating author before publication. Exact forthcoming paths:

```text
src/terraform/.terraform.lock.hcl
src/reference/solution/.terraform.lock.hcl
```

No fabricated checksum/empty lock is supplied. The [instructor release gates](../../docs/instructor.md) distinguish authored source, native validation, and live rehearsal. A complete source solution is not a claim of an executed Azure deployment.

## Recovery without discarding work

Compare only the file for the failed checkpoint. Use the matching [labelled source section](../snippets/README.md), inspect the diff, and re-run the relevant native checks from the working root. Keep participant edits/evidence and the real lock. Do not copy a whole reference directory over the learner tree, reset Git, or copy state/caches from anywhere.

The three selected outputs cannot show a real Azure resource ID in this lab because no deployment is performed. A mocked/static value must never be recorded as a live result.
