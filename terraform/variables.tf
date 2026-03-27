variable "cloudflare_api_token" {
  description = "Cloudflare API token"
  type        = string
  sensitive   = true
}

variable "cloudflare_account_id" {
  description = "Cloudflare Account ID"
  type        = string
}

variable "cloudflare_zone_id" {
  description = "Cloudflare Zone ID for pantorn.site"
  type        = string
}

variable "domain" {
  description = "Domain name (e.g., pantorn.site)"
  type        = string
  default     = "pantorn.site"
}

variable "app_subdomain" {
  description = "App subdomain for tictactoe (e.g., ttt)"
  type        = string
  default     = "ttt"
}

variable "github_owner" {
  description = "GitHub owner/organization name"
  type        = string
  default     = "Long104"
}

variable "github_repo" {
  description = "GitHub repository name"
  type        = string
  default     = "tictactoe"
}
