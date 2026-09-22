# L2-MODULE: a valid local-wrapper scaffold; no direct AzureRM resource.
module "resource_group" {
  source = "./modules/resource-group"

  name     = var.resource_group_name
  location = var.location
  tags     = var.tags
}
