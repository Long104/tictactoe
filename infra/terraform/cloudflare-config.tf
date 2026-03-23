variable "cloudflare_api_token" {
  description = "Cloudflare API token"
  type        = string
  sensitive   = true
}

variable "cloudflare_zone_id" {
  description = "Cloudflare zone ID"
  type        = string
}

variable "domain_name" {
  description = "Domain name"
  type        = string
}

variable "aws_alb_dns_name" {
  description = "AWS ALB DNS name"
  type        = string
}

variable "enable_cdn" {
  description = "Enable Cloudflare CDN"
  type        = bool
  default     = true
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

resource "cloudflare_record" "root" {
  zone_id = var.cloudflare_zone_id
  name    = var.domain_name
  value   = var.aws_alb_dns_name
  type    = "CNAME"
  proxied = var.enable_cdn
  ttl     = 1
}

resource "cloudflare_record" "www" {
  zone_id = var.cloudflare_zone_id
  name    = "www"
  value   = var.domain_name
  type    = "CNAME"
  proxied = var.enable_cdn
  ttl     = 1
}

resource "cloudflare_record" "api" {
  zone_id = var.cloudflare_zone_id
  name    = "api"
  value   = var.aws_alb_dns_name
  type    = "CNAME"
  proxied = var.enable_cdn
  ttl     = 1
}

resource "cloudflare_record" "monitoring" {
  zone_id = var.cloudflare_zone_id
  name    = "monitoring"
  value   = var.aws_alb_dns_name
  type    = "CNAME"
  proxied = var.enable_cdn
  ttl     = 1
}

resource "cloudflare_record" "jenkins" {
  zone_id = var.cloudflare_zone_id
  name    = "jenkins"
  value   = var.aws_alb_dns_name
  type    = "CNAME"
  proxied = var.enable_cdn
  ttl     = 1
}

resource "cloudflare_record" "grafana" {
  zone_id = var.cloudflare_zone_id
  name    = "grafana"
  value   = var.aws_alb_dns_name
  type    = "CNAME"
  proxied = var.enable_cdn
  ttl     = 1
}

resource "cloudflare_zone_settings_override" "settings" {
  zone_id = var.cloudflare_zone_id

  settings {
    always_use_https         = true
    automatic_https_rewrites = "on"
    min_tls_version          = "1.2"
    tls_1_3                  = "on"
    opportunistic_encryption = "on"
  }
}

output "dns_records" {
  value = {
    root    = cloudflare_record.root.hostname
    www     = cloudflare_record.www.hostname
    api     = cloudflare_record.api.hostname
    jenkins = cloudflare_record.jenkins.hostname
    grafana = cloudflare_record.grafana.hostname
  }
}