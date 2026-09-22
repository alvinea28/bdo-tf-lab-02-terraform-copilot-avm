# L2-WRAPPER-INPUTS-STARTER: valid inputs, intentionally terse descriptions.
variable "name" {
  type        = string
  description = "Name."
  nullable    = false
}

variable "location" {
  type        = string
  description = "Location."
  nullable    = false
}

variable "tags" {
  type        = map(string)
  description = "Tags."
  default     = {}
  nullable    = false
}
