resource "render_web_service" "backend" {
  name          = "tictactoe-backend"
  plan          = var.render_plan
  region        = var.render_region
  start_command = "bun run src/index.ts"

  runtime_source = {
    docker = {
      auto_deploy      = true
      branch           = var.backend_branch
      repo_url         = "https://github.com/${var.github_repo}"
      context         = "./backend"
      dockerfile_path = "./backend/Dockerfile"
    }
  }

  env_vars = {
    PORT = {
      value = "${var.backend_port}"
    },
    NODE_ENV = {
      value = "production"
    },
    FRONTEND_URL = {
      value = "https://${var.frontend_subdomain}.${var.domain}"
    },
  }

  custom_domains = [
    {
      name = "${var.backend_subdomain}.${var.domain}"
    },
  ]
}
