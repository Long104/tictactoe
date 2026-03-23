variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name for resource naming"
  type        = string
  default     = "tictactoe"
}

variable "environment" {
  description = "Environment (dev/staging/prod)"
  type        = string
  default     = "production"
}

variable "availability_zones" {
  description = "Availability zones for the VPC"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b", "us-east-1c"]
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "eks_cluster_version" {
  description = "EKS cluster version"
  type        = string
  default     = "1.29"
}

variable "eks_node_instance_type" {
  description = "EC2 instance type for EKS nodes"
  type        = string
  default     = "t3.medium"
}

variable "eks_node_desired_capacity" {
  description = "Desired number of nodes"
  type        = number
  default     = 2
}

variable "eks_node_min_capacity" {
  description = "Minimum number of nodes"
  type        = number
  default     = 2
}

variable "eks_node_max_capacity" {
  description = "Maximum number of nodes"
  type        = number
  default     = 4
}

variable "domain_name" {
  description = "Domain name for the application"
  type        = string
  default     = "tictactoe.example.com"
}

variable "jenkins_instance_type" {
  description = "EC2 instance type for Jenkins"
  type        = string
  default     = "t3.medium"
}