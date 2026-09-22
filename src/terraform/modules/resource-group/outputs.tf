# L2-WRAPPER-OUTPUTS-STARTER: the completed section also exposes id.
output "name" {
  description = "Resource group name."
  value       = module.avm.name
}

output "location" {
  description = "Resource group location."
  value       = module.avm.location
}
