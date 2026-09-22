# L2-WRAPPER-OUTPUTS: id is a local name for AVM's resource_id output.
output "id" {
  description = "Resource-group ID; the wrapper intentionally renames AVM resource_id to id."
  value       = module.avm.resource_id
}

output "name" {
  description = "Resource-group name from the published AVM name output."
  value       = module.avm.name
}

output "location" {
  description = "Resource-group location from the published AVM location output."
  value       = module.avm.location
}
