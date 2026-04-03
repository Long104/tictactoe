terraform {
  required_version = ">= 1.5"

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
    vercel = {
      source  = "vercel/vercel"
      version = "~> 2.0"
    }
    render = {
      source  = "render-oss/render"
      version = "~> 1.0"
    }
  }
}
