output "frontend_url" {
  description = "Cloudflare Pages frontend URL"
  value       = "https://${var.app_subdomain}.${var.domain}"
}

output "backend_url" {
  description = "Cloudflare Workers backend URL"
  value       = "https://${var.app_subdomain}.${var.domain}/api"
}

output "pages_project_name" {
  description = "Cloudflare Pages project name"
  value       = cloudflare_pages_project.frontend.name
}

output "kv_namespace_id" {
  description = "Cloudflare KV namespace ID for game state"
  value       = cloudflare_workers_kv_namespace.game_state.id
}

output "zone_id" {
  description = "Cloudflare Zone ID"
  value       = data.cloudflare_zone.main.id
}