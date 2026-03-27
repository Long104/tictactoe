terraform {
  required_version = ">= 1.0"

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

data "cloudflare_zone" "main" {
  name = var.domain
}

resource "cloudflare_pages_project" "frontend" {
  account_id        = var.cloudflare_account_id
  name              = "tictactoe"
  production_branch = "deployOnCloudflare"
}

resource "cloudflare_workers_kv_namespace" "game_state" {
  account_id = var.cloudflare_account_id
  title      = "tictactoe-game-state"
}