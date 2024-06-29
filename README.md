## Cloud Computing - Ex2 submission docs

### Server and interface
* Express application running from `/app/index.js` with a MongoDB, exposing the required
API endpoints and logic.

### Infra and deployment
* The service is running over a Docker container served from an EKS cluster. 
Helm charts and configuration are all under `kube` folder.
* A script to create the EKS cluster and deploy the app to the cloud.

```
cd kube/scripts
source deploy-eks.sh
```
#### Prerequisites
1. AWS user to login with as part of the deploy script.
2. Basic AWS CLI permissions to that user.
3. IAM persmissions to attach policies. The deployment script will attach the necessary permissions for creating the cluster. Specifically:
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "iam:ListPolicies",
                "iam:CreatePolicy",
                "iam:AttachUserPolicy"
            ],
            "Resource": "*"
        }
    ]
}
```

---

### Architecture discussion

Overall, this architecture provides a flexible, scalable solution that can adapt to varying loads, ensuring that the system remains responsive as the user base grows.

#### Thousands of users:

K8s offers seamless scaling and management of containers. At this scale, K8s efficiently distributes traffic and manages the deployment of additional instances of the service as needed. Also in this scale, Mongo can easily handle the increase in data. 
From cost perspective, at this scale the costs are relatively low due to the efficient use of resources. Kubernetes helps optimize resource usage, ensuring you only pay for what you need.

#### Tens of Thousands of Users:

K8s continues to manage the scaling efficiently - this scale requires greater monitoring and auto-scaling features which are provided by K8s. The database's sharding capabilities become crucial, allowing the system to distribute the workload across more servers to maintain performance. 
Costs increase, particularly for Mongo if sharding is required, as this means more servers. However, K8s can still help manage costs by dynamically allocating resources based on demand.

#### Millions of Users:

As the application is small and doesn't require micro services or complex deployment orchestration, K8s should handle the scale similarly. However from the DB perspective, at this scale the performance is highly dependent on the DB sharding strategy, to distribute the operations evenly.
Costs, on the other end, increase significantly especially for Mongo due to the need for a large number of shards and replicas to ensure performance and availability.
