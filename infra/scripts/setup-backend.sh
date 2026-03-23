#!/bin/bash

set -e

echo "=== Terraform Backend Bootstrap Script ==="
echo "This script creates S3 bucket and DynamoDB table for Terraform state"
echo ""

# Configuration
AWS_REGION=${AWS_REGION:-"us-east-1"}
BUCKET_NAME=${BUCKET_NAME:-"tictactoe-terraform-state"}
TABLE_NAME=${TABLE_NAME:-"tictactoe-terraform-lock"}
PROJECT_NAME=${PROJECT_NAME:-"tictactoe"}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    log_error "AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check AWS credentials
log_info "Checking AWS credentials..."
aws sts get-caller-identity > /dev/null 2>&1 || {
    log_error "AWS credentials not configured. Run 'aws configure' first."
    exit 1
}

# Get account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query 'Account' --output text)
log_info "AWS Account ID: $ACCOUNT_ID"

# Create S3 bucket for Terraform state
log_info "Creating S3 bucket: $BUCKET_NAME"

# Check if bucket exists
if aws s3api head-bucket --bucket "$BUCKET_NAME" 2>/dev/null; then
    log_warn "S3 bucket already exists: $BUCKET_NAME"
else
    # Create bucket in us-east-1 (required for SSE-KMS)
    aws s3api create-bucket \
        --bucket "$BUCKET_NAME" \
        --region "$AWS_REGION" \
        --create-bucket-configuration LocationConstraint="$AWS_REGION" 2>/dev/null || {
        # If region is us-east-1, the command format is different
        aws s3api create-bucket --bucket "$BUCKET_NAME" --region "$AWS_REGION"
    }
    log_info "S3 bucket created: $BUCKET_NAME"
fi

# Enable versioning on S3 bucket
aws s3api put-bucket-versioning \
    --bucket "$BUCKET_NAME" \
    --versioning-configuration Status=Enabled

log_info "S3 versioning enabled"

# Enable encryption on S3 bucket
aws s3api put-bucket-encryption \
    --bucket "$BUCKET_NAME" \
    --server-side-encryption-configuration '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"}}]}'

log_info "S3 encryption enabled"

# Block public access
aws s3api put-public-access-block \
    --bucket "$BUCKET_NAME" \
    --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

log_info "S3 public access blocked"

# Create DynamoDB table for state locking
log_info "Creating DynamoDB table: $TABLE_NAME"

aws dynamodb create-table \
    --table-name "$TABLE_NAME" \
    --attribute-definitions AttributeName=LockID,AttributeType=S \
    --key-schema AttributeName=LockID,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region "$AWS_REGION" 2>/dev/null || {
    # Check if table already exists
    if aws dynamodb describe-table --table-name "$TABLE_NAME" --region "$AWS_REGION" > /dev/null 2>&1; then
        log_warn "DynamoDB table already exists: $TABLE_NAME"
    else
        log_error "Failed to create DynamoDB table"
        exit 1
    }
}

log_info "DynamoDB table created: $TABLE_NAME"

# Enable TTL on DynamoDB table for automatic cleanup
aws dynamodb update-time-to-live \
    --table-name "$TABLE_NAME" \
    --time-to-live-specification "Enabled=true, AttributeName=Expires" \
    --region "$AWS_REGION" 2>/dev/null || true

log_info "DynamoDB TTL enabled for auto-cleanup"

# Update backend.tf with actual values
log_info "Updating backend.tf with bucket name..."

cd "$(dirname "$0")/terraform"

# Create backend.tf with actual values
cat > backend.tf << EOF
terraform {
  backend "s3" {
    bucket         = "${BUCKET_NAME}"
    key            = "terraform.tfstate"
    region         = "${AWS_REGION}"
    encrypt        = true
    dynamodb_table = "${TABLE_NAME}"
  }
}
EOF

log_info "backend.tf updated"

# Summary
echo ""
echo "========================================"
echo "Bootstrap Complete!"
echo "========================================"
echo ""
echo "S3 Bucket: s3://${BUCKET_NAME}"
echo "DynamoDB Table: ${TABLE_NAME}"
echo ""
echo "Next steps:"
echo "1. Run: cd terraform && terraform init"
echo "2. Run: cd terraform && terraform plan"
echo "3. Run: cd terraform && terraform apply"
echo ""

exit 0