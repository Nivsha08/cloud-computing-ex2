#!/bin/bash

if [[ "$(pwd)" != *"/kube/scripts" ]]; then
    echo "Current working directory: $(pwd)"
    echo "This script must be run from the \"/kube/scripts\" directory. Exiting."
    return 1
fi

region="eu-north-1"
cluster_uuid=$(date +%s)
cluster_name="message-app-cluster-$cluster_uuid"
cluster_version="1.30"
release_name="message-app"

chart_path="../helm/message-app"
secret_path="../helm/message-app/templates/mongo-secret.yaml"

checkmark="\xE2\x9C\x94"

# Generate and store mongo-root-username and mongo-root-password
mongo_root_username=$(openssl rand -base64 12)
mongo_root_password=$(openssl rand -base64 12)
mongo_root_username_encoded=$(echo -n $mongo_root_username | base64)
mongo_root_password_encoded=$(echo -n $mongo_root_password | base64)
sed -i "" "s|mongo-root-username: .*|mongo-root-username: $mongo_root_username_encoded|" $secret_path
sed -i "" "s|mongo-root-password: .*|mongo-root-password: $mongo_root_password_encoded|" $secret_path

echo "\nChecking dependencies..."

# jq
if ! command -v jq &> /dev/null; then
    echo "jq not found, installing..."
    source "./deps/jq.sh"
    jq --version
else
    echo -e "$checkmark jq is already installed."
fi

# aws
if ! command -v aws &> /dev/null; then
    echo "aws not found, installing..."
    source "./deps/aws.sh"
    aws --version
else
    echo -e "$checkmark aws is already installed."
fi

# eksctl
if ! command -v eksctl &> /dev/null; then
    echo "eksctl not found, installing..."
    source "./deps/eksctl.sh"
    eksctl version
else
    echo -e "$checkmark eksctl is already installed."
fi

# helm
if ! command -v helm &> /dev/null; then
    echo "helm not found, installing..."
    source "./deps/helm.sh"
    helm version
else
    echo -e "$checkmark helm is already installed."
fi

# Configure AWS CLI user and attach necessary permissions policy
echo -e "\nChecking AWS CLI configuration..."
if [ -s ~/.aws/config ]; then
    echo -e "$checkmark AWS CLI is configured."
else
    aws configure set default.region $region
fi

echo -e "\nAttaching necessary IAM permissions..."
source "./attach-iam-permissions.sh";
echo -e "$checkmark Done."

# Create an EKS Cluster
echo -e "\nCreating EKS Cluster..."
eksctl create cluster --name $cluster_name --version $cluster_version --region $region --with-oidc --without-nodegroup --fargate
server_api_endpoint=$(kubectl get svc | awk '/message-app-express-service/{print $4}')

echo -e "\n$checkmark EKS Cluster created successfully."

# Deploy the app 
echo -e "\nDeploying the app..."
helm upgrade --install $release_name $chart_path

echo -e "\n$checkmark App deployed successfully."
echo -e "Server API endpoint: $server_api_endpoint"