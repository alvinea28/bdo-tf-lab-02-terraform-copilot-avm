# L2-MODULE: the working root calls one workshop-authored local module.
module "resource_group" {
  source = "./modules/resource-group"

  name     = var.resource_group_name
  location = var.location
  tags     = var.tags
}
