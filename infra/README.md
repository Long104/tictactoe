# DevOps Infrastructure for TicTacToe Application

This repository contains the complete infrastructure setup for deploying a TicTacToe application using Terraform, Jenkins, Docker, Kubernetes, Ansible, Prometheus, Grafana, and K6 with Cloudflare integration.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLOUDFLARE                                  │
│                    (DNS + CDN + WAF for security)                       │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         AWS INFRASTRUCTURE                              │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────────────────┐ │
│  │   Route 53   │  │     ACM      │  │         EKS CLUSTER           │ │
│  │   (DNS)      │  │  (TLS Cert)  │  │  ┌─────┐  ┌─────┐  ┌─────┐   │ │
│  └──────────────┘  └──────────────┘  │  │App1 │  │App2 │  │...  │   │ │
│                                      │  └─────┘  └─────┘  └─────┘   │ │
│  ┌─────────────────────────────────┐└────────────────────────────────┘ │
│  │          S3 (State Storage)      │                                    │
│  │        + DynamoDB (Locking)     │                                    │
│  └─────────────────────────────────┘                                    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      CI/CD PIPELINE (JENKINS)                          │
│  GitHub Webhook → Build → Test → Docker Build → Push to ECR → Deploy   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        MONITORING STACK                                 │
│         Prometheus + Grafana + AlertManager + K6                        │
└─────────────────────────────────────────────────────────────────────────┘
```

## Prerequisites

- AWS Account
- Cloudflare Account with domain
- Terraform >= 1.0
- kubectl
- AWS CLI
- Ansible

## Directory Structure

```
tictactoe-infra/
├── terraform/           # Infrastructure as Code
│   ├── main.tf          # Main AWS resources
│   ├── variables.tf     # Variables
│   ├── outputs.tf       # Outputs
│   ├── backend.tf       # S3 backend
│   ├── modules/         # Reusable modules
│   └── cloudflare-config.tf  # Cloudflare config
├── ansible/             # Configuration Management
│   ├── inventory.ini    # Inventory file
│   ├── playbook.yml    # Main playbook
│   └── roles/          # Ansible roles
├── k8s/                # Kubernetes manifests
│   ├── base/           # Base manifests
│   └── helm/           # Helm charts
├── jenkins/            # CI/CD Pipeline
│   └── Jenkinsfile     # Jenkins pipeline
└── monitoring/         # Monitoring setup
    ├── prometheus/     # Prometheus config
    ├── grafana/        # Grafana dashboards
    └── k6/             # K6 load tests
```

## Deployment Steps

### Phase 1: Setup Terraform Backend

```bash
cd terraform
terraform init
terraform plan -var="aws_region=us-east-1"
terraform apply -var="aws_region=us-east-1"
```

### Phase 2: Configure Servers with Ansible

```bash
cd ansible
ansible-playbook -i inventory.ini playbook.yml
```

### Phase 3: Setup CI/CD Pipeline

1. Access Jenkins at http://jenkins-server:8080
2. Create a new pipeline job
3. Point to the Jenkinsfile in your repository
4. Configure webhooks for automatic triggers

### Phase 4: Deploy to Kubernetes

```bash
# Update kubeconfig
aws eks update-kubeconfig --name tictactoe

# Apply manifests
kubectl apply -f k8s/base/
```

### Phase 5: Setup Monitoring

```bash
# Install Prometheus Stack
helm install prometheus prometheus-community/kube-prometheus-stack

# Run K6 tests
k6 run monitoring/k6/smoke-test.js
```

### Phase 6: Configure Cloudflare

```bash
cd terraform
terraform init
terraform apply -var="cloudflare_api_token=your_token"
```

## Environment Variables

Create a `.tfvars` file:

```hcl
aws_region = "us-east-1"
project_name = "tictactoe"
environment = "production"
domain_name = "example.com"
```

## Outputs

After deployment, you will get:
- EKS Cluster Endpoint
- ECR Repository URL
- Jenkins Server IP
- Route53 Zone ID
- Cloudflare DNS Records

## Monitoring

- **Prometheus**: http://monitoring-server:9090
- **Grafana**: http://monitoring-server:3000
- **K6 Results**: Stored in `/opt/k6-tests`

## Security

- Secrets are stored in Kubernetes Secrets
- Terraform state is stored in S3 with encryption
- Cloudflare WAF rules are applied
- TLS/SSL is enabled end-to-end

## Cleanup

```bash
# Destroy Kubernetes resources
kubectl delete -f k8s/base/

# Destroy Terraform resources
terraform destroy

# Destroy Cloudflare resources
terraform destroy -var="cloudflare_api_token=..."
```

## License

MIT