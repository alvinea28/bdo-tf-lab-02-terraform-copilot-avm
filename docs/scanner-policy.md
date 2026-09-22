# Scanner scope and explicit registry-module exception

The workflow pins Checkov **3.3.19** and keeps its exit status blocking. There is no global skipped-check list and no soft-fail.

Its `CKV_TF_1` implementation accepts a Git source containing a commit-shaped `?ref=` but rejects registry module addresses even when `version` is exactly pinned. The original scan therefore failed on the official AVM registry module, not on an Azure resource finding.

The one AVM call carries an inline **CKV_TF_1 exception**, copied consistently into the starter, snippet, and reference. Registry addresses use Terraform's `version` argument, not Git `?ref=` syntax. `CKV_TF_2` (module version pinning) and all other applicable checks remain enabled and blocking. The source scanner is not represented as a zero-exception security audit.

- Registry release: `Azure/avm-res-resources-resourcegroup/azurerm` **0.4.0**.
- Verified release tag commit on 2026-09-22: `2c605230f1bcb5dc29a667f2a43258bfa9140c32`.
- Reference: [published release source](https://github.com/Azure/terraform-azurerm-avm-res-resources-resourcegroup/tree/2c605230f1bcb5dc29a667f2a43258bfa9140c32).
- Registry module versions are not checksummed by the provider lock file. Reverify the release during instructor preparation; do not silently switch source kinds or use an unpinned module.
- External module downloads are disabled for Checkov. It scans authored source, not all AVM/AzAPI internals. Record passed, failed, skipped, parsing-error, and resource counts separately; zero scanned Azure resources is not complete coverage.

Do not add exceptions to get an unexplained failure to pass. Diagnose new findings with the instructor. The module-local exception is deliberate, documented, and limited to this incompatible Git-only rule.
