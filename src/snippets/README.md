# Lab 2 labelled copy sections

Open and inspect each section in VS Code. Copy the entire file text into the listed destination unless explicitly stated otherwise. The text-file suffix prevents these fragments from entering Terraform configuration or Actions discovery. Do not copy this directory wholesale into the working root.

| Label / source | Destination / boundary |
| --- | --- |
| [L2-MODULE.tf.txt](L2-MODULE.tf.txt) | Replace all of [root main](../terraform/main.tf). |
| [L2-WRAPPER.tf.txt](L2-WRAPPER.tf.txt) | Replace all of [wrapper main](../terraform/modules/resource-group/main.tf). |
| [L2-INPUTS.tf.txt](L2-INPUTS.tf.txt) | Replace all of [root variables](../terraform/variables.tf). |
| [L2-WRAPPER-INPUTS.tf.txt](L2-WRAPPER-INPUTS.tf.txt) | Replace all of [wrapper variables](../terraform/modules/resource-group/variables.tf). |
| [L2-OUTPUTS.tf.txt](L2-OUTPUTS.tf.txt) | Replace all of [root outputs](../terraform/outputs.tf). |
| [L2-WRAPPER-OUTPUTS.tf.txt](L2-WRAPPER-OUTPUTS.tf.txt) | Replace all of [wrapper outputs](../terraform/modules/resource-group/outputs.tf). |
| [L2-VALUES.tfvars.txt](L2-VALUES.tfvars.txt) | Replace all of [participant example values](../terraform/terraform.tfvars.example); edit only the anonymous suffix/owner. |
| [L2-UNSUPPORTED-ARGUMENT.tf.txt](L2-UNSUPPORTED-ARGUMENT.tf.txt) | Deliberately invalid: insert only its assignment inside the existing AVM call, then remove it after the expected diagnostic. |
| [L2-PR-EVENTS.yml.txt](L2-PR-EVENTS.yml.txt) | Replace only the `on` block of the learner-activated quality workflow; retain all jobs and safeguards. |

The full manual-only **L2-MANUAL-QUALITY** workflow is [../workflows/terraform-quality.yml](../workflows/terraform-quality.yml), not an abbreviated snippet. Copy it only at the activation checkpoint. Do not add a push event, live backend, plan/apply step, or cloud credentials.

All commands and four Copilot prompts are embedded in [the participant guide](../../README.md). The independent [complete reference](../reference/README.md) is for comparison and recovery after attempting each edit, not a substitute for the learning sequence.
