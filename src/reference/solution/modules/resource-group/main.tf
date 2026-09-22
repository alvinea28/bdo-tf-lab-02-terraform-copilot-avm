# L2-WRAPPER: an ordinary local module consuming Azure Verified Modules.
module "avm" {
  #checkov:skip=CKV_TF_1:Registry release 0.4.0 uses version, not a Git ref; see docs/scanner-policy.md. CKV_TF_2 stays blocking.
  source  = "Azure/avm-res-resources-resourcegroup/azurerm"
  version = "0.4.0"

  name             = var.name
  location         = var.location
  tags             = var.tags
  enable_telemetry = false
  lock             = null
  role_assignments = {}
}
