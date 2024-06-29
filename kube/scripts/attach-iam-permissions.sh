policy_name="eks-deployment-policy"
policy_document_file_path="./aws-permissions.json"

caller_identity=$(aws sts get-caller-identity)
user_arn=$(echo $caller_identity | jq -r '.Arn')
user_name=$(echo $user_arn | awk -F'/' '{print $NF}')

if [ -z "$user_name" ]; then
    echo "Failed to retrieve IAM user name."
    return 1
fi

echo -e "\nRetrieved IAM user name: $user_name"

# Check if the policy already exists or create it if it doesn't
existing_policy_arn=$(aws iam list-policies --query 'Policies[?PolicyName==`'$policy_name'`].Arn' --output text)
if [ ! -z "$existing_policy_arn" ]; then
    echo -e "Policy already exists: $existing_policy_arn"
else
    echo -e "\nCreating IAM policy..."
    create_policy_output=$(aws iam create-policy --policy-name "$policy_name" --policy-document file://$policy_document_file_path 2>&1)
    policy_arn=$(echo $create_policy_output | jq -r '.Policy.Arn' 2>/dev/null)

    if [[ $create_policy_output == *"AccessDenied"* ]]; then
        echo -e "Access denied when trying to create IAM policy. Ensure the IAM user has the necessary permissions."
        echo -e "\nError: $create_policy_output"
        return 1
    elif [ -z "$policy_arn" ]; then
        echo -e "Failed to create IAM policy."
        echo -e "\nError: $create_policy_output"
        return 1
    else
        echo -e "\nIAM policy created: $policy_arn"
    fi
fi

echo -e "Attaching policy to user..."
attach_policy_output=$(aws iam attach-user-policy --user-name "$user_name" --policy-arn "${existing_policy_arn:-$policy_arn}" 2>&1)

if [[ $attach_policy_output == *"AccessDenied"* ]]; then
    echo -e "Access denied when trying to attach policy to user. Ensure the IAM user has the necessary permissions."
    echo -e "\nError: $attach_policy_output"
    return 1
else
    echo -e "Policy attached to user successfully."
fi