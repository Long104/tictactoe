variable "cloudflare_api_token" {
  description = "Cloudflare API token with DNS edit permissions"
  type        = string
  sensitive   = true
}

variable "cloudflare_zone_id" {
  description = "Cloudflare zone ID for pantorn.site"
  type        = string
}

variable "vercel_api_token" {
  description = "Vercel API token"
  type        = string
  sensitive   = true
}

variable "vercel_team_id" {
  description = "Vercel team ID (leave empty for personal account)"
  type        = string
  default     = ""
}

variable "render_api_token" {
  description = "Render API key"
  type        = string
  sensitive   = true
}

variable "render_owner_id" {
  description = "Render owner ID (from https://dashboard.render.com/u/settings#api-keys)"
  type        = string
}

variable "github_repo" {
  description = "GitHub repository in 'owner/repo' format"
  type        = string
}

variable "domain" {
  description = "Base domain name"
  type        = string
  default     = "pantorn.site"
}

variable "frontend_subdomain" {
  description = "Subdomain for the frontend"
  type        = string
  default     = "ttt-frontend"
}

variable "backend_subdomain" {
  description = "Subdomain for the backend"
  type        = string
  default     = "ttt-backend"
}

variable "frontend_branch" {
  description = "Git branch for frontend deployments"
  type        = string
  default     = "infraVercelRender"
}

variable "backend_branch" {
  description = "Git branch for backend deployments"
  type        = string
  default     = "infraVercelRender"
}

variable "backend_port" {
  description = "port for backend because render want port to be 10000"
  type        = string
  default     = "10000"
}

variable "render_region" {
  description = "Render region: frankfurt, ohio, oregon, singapore, virginia"
  type        = string
  default     = "oregon"
}

variable "render_plan" {
  description = "Render plan: starter (free), standard, pro, etc."
  type        = string
  default     = "starter"
}
