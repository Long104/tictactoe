output "frontend_url" {
  value       = "https://${var.frontend_subdomain}.${var.domain}"
  description = "Frontend URL (Vercel)"
}

output "backend_url" {
  value       = "https://${var.backend_subdomain}.${var.domain}"
  description = "Backend URL (Render)"
}

output "render_default_url" {
  value       = render_web_service.backend.url
  description = "Render-assigned default URL"
}

output "vercel_project_id" {
  value = vercel_project.frontend.id
}

output "render_service_id" {
  value = render_web_service.backend.id
}
