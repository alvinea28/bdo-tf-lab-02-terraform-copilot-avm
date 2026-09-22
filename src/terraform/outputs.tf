# L2-OUTPUTS-STARTER: extend this interface after inspecting AVM outputs.
output "name" {
  description = "Resource group name."
  value       = module.resource_group.name
}
