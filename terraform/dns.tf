resource "cloudflare_record" "app" {
  zone_id = data.cloudflare_zone.main.id
  name    = var.app_subdomain
  value   = "tictactoe.pages.dev"
  type    = "CNAME"
  proxied = true
}