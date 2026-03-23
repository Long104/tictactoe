terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

locals {
  name   = var.project_name
  region = var.aws_region

  tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

data "aws_availability_zones" "available" {
  state = "available"
}

module "vpc" {
  source = "./modules/vpc"

  project_name       = var.project_name
  environment        = var.environment
  vpc_cidr           = var.vpc_cidr
  availability_zones = var.availability_zones
  tags               = local.tags
}

module "eks" {
  source = "./modules/eks"

  cluster_name     = var.project_name
  cluster_version  = var.eks_cluster_version
  vpc_id           = module.vpc.vpc_id
  subnet_ids       = concat(module.vpc.public_subnet_ids, module.vpc.private_subnet_ids)
  instance_type    = var.eks_node_instance_type
  desired_capacity = var.eks_node_desired_capacity
  min_capacity     = var.eks_node_min_capacity
  max_capacity     = var.eks_node_max_capacity
  tags             = local.tags
}

resource "aws_ecr_repository" "app" {
  name = var.project_name

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = local.tags
}

resource "aws_route53_zone" "main" {
  name = var.domain_name

  tags = local.tags
}

resource "aws_acm_certificate" "main" {
  domain_name       = var.domain_name
  validation_method = "DNS"

  subject_alternative_names = ["*.${var.domain_name}"]

  lifecycle {
    create_before_destroy = true
  }

  tags = local.tags
}

resource "aws_instance" "jenkins" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = var.jenkins_instance_type
  subnet_id     = module.vpc.public_subnet_ids[0]

  key_name = "jenkins-key"

  vpc_security_group_ids = [aws_security_group.jenkins.id]

  tags = merge(local.tags, {
    Name = "${var.project_name}-jenkins"
  })
}

resource "aws_security_group" "jenkins" {
  name        = "${var.project_name}-jenkins-sg"
  description = "Security group for Jenkins"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(local.tags, {
    Name = "${var.project_name}-jenkins-sg"
  })
}

output "vpc_id" {
  value = module.vpc.vpc_id
}

output "vpc_cidr" {
  value = module.vpc.vpc_cidr_block
}

output "public_subnet_ids" {
  value = module.vpc.public_subnet_ids
}

output "private_subnet_ids" {
  value = module.vpc.private_subnet_ids
}

output "eks_cluster_name" {
  value = module.eks.cluster_name
}

output "eks_cluster_endpoint" {
  value = module.eks.cluster_endpoint
}

output "eks_cluster_arn" {
  value = module.eks.cluster_arn
}

output "ecr_repository_url" {
  value = aws_ecr_repository.app.repository_url
}

output "jenkins_instance_public_ip" {
  value = aws_instance.jenkins.public_ip
}

output "route53_zone_id" {
  value = aws_route53_zone.main.zone_id
}

output "acm_certificate_arn" {
  value = aws_acm_certificate.main.arn
}