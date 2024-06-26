# learn-aws-vpc
CDK constructs to deploy a Virtual Private Cloud into your AWS account

## Bootstrap
1. npm install
2. npm install -g ts-node

## Deployment
1. export your AWS credentials /region to your session
2. npm run deploy

## What gets deployed?
1. 1 VPC
2. 6 subnets
3. Security group for access from CloudShell
3. 1 Internet gateway
4. 1 NAT Gateway
5. 1 EC2 instance in an isolated subnet
6. 1 EC2 instance in an private subnet with egress
7. 1 EC2 Instance Connect endpoint
8. 1 RDS instance with Postgres database in an isolated subnet