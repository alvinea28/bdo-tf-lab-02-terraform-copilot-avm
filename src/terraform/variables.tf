# L2-INPUTS-STARTER: types are valid; descriptions and policy need improvement.
variable "resource_group_name" {
  type        = string
  description = "Resource group name."
  nullable    = false
}

variable "location" {
  type        = string
  description = "Location."
  default     = "southeastasia"
  nullable    = false
}

variable "tags" {
  type        = map(string)
  description = "Tags."
  default     = {}
  nullable    = false
}

variable "allowed_locations" {
  type        = list(string)
  description = "Allowed locations."
  default     = ["southeastasia"]
  nullable    = false
}
