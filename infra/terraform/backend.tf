terraform {
  backend "s3" {
    bucket         = "tictactoe-terraform-state"
    key            = "terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "tictactoe-terraform-lock"
  }
}