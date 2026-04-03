resource "vercel_project" "frontend" {
  name      = "tictactoe-frontend"
  framework = "nextjs"

  git_repository = {
    type = "github"
    repo = var.github_repo
  }

  root_directory = "frontend"
}

resource "vercel_project_environment_variable" "backend_url" {
  project_id = vercel_project.frontend.id
  key        = "NEXT_PUBLIC_BACKEND_URL"
  value      = "https://${var.backend_subdomain}.${var.domain}"
  target     = ["production", "preview", "development"]
}

resource "vercel_project_domain" "frontend" {
  project_id = vercel_project.frontend.id
  domain     = "${var.frontend_subdomain}.${var.domain}"
}
