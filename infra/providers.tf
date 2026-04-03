provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

provider "vercel" {
  api_token = var.vercel_api_token
  team      = var.vercel_team_id
}

provider "render" {
  api_key  = var.render_api_token
  owner_id = var.render_owner_id
}
