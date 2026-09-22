terraform {
  required_version = "= 1.16.3"

  required_providers {
    azapi = {
      source  = "Azure/azapi"
      version = "= 2.12.0"
    }
    modtm = {
      source  = "azure/modtm"
      version = "= 0.4.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "= 3.9.1"
    }
  }
}
