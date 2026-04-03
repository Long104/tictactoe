resource "cloudflare_record" "frontend_cname" {
  zone_id = var.cloudflare_zone_id
  name    = var.frontend_subdomain
  content = "cname.vercel-dns.com"
  type    = "CNAME"
  ttl     = 1
  proxied = false
}

resource "cloudflare_record" "backend_cname" {
  zone_id = var.cloudflare_zone_id
  name    = var.backend_subdomain
  content = trimprefix(render_web_service.backend.url, "https://")
  type    = "CNAME"
  ttl     = 1
  proxied = true

  depends_on = [render_web_service.backend]
}
