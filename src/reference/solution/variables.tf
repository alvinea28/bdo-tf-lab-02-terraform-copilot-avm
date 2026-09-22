# L2-INPUTS: complete input documentation and workshop validation rules.
variable "resource_group_name" {
  type        = string
  description = "Name of this participant's Lab 2 resource group; use rg-bdo-lab02- followed by a 3-30 character lowercase suffix."
  nullable    = false

  validation {
    condition     = can(regex("^rg-bdo-lab02-[a-z0-9-]{3,30}$", var.resource_group_name))
    error_message = "Use rg-bdo-lab02- followed by 3-30 lowercase letters, digits, or hyphens."
  }
}

variable "location" {
  type        = string
  description = "Azure region slug for the group; it must be in allowed_locations and does not select or authorize a subscription."
  default     = "southeastasia"
  nullable    = false

  validation {
    condition     = contains(var.allowed_locations, var.location)
    error_message = "location must be a member of allowed_locations; the Lab 2 default is southeastasia."
  }
}

variable "tags" {
  type        = map(string)
  description = "Non-secret resource-group tags; include environment, lab, and an anonymous owner code, never credentials or personal data."
  default     = {}
  nullable    = false

  validation {
    condition     = alltrue([for key, value in var.tags : trimspace(key) != "" && try(trimspace(value) != "", false)])
    error_message = "Tag keys and values must be non-empty strings; use anonymous, non-secret values."
  }
}

variable "allowed_locations" {
  type        = list(string)
  description = "Instructor-approved Azure region slugs; this local input rule is not an Azure Policy or an authorization boundary."
  default     = ["southeastasia"]
  nullable    = false

  validation {
    condition     = length(var.allowed_locations) > 0 && alltrue([for region in var.allowed_locations : can(regex("^[a-z0-9]+$", region))])
    error_message = "allowed_locations must contain at least one non-null, lowercase Azure region slug."
  }
}
