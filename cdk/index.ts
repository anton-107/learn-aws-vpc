import { App } from "aws-cdk-lib";
import { VpcStack } from "./stacks/vpc-stack";
import { EC2Stack } from "./stacks/ec2-stack";
import { EC2ConectivityStack } from "./stacks/ec2-connectivity-stack";
import { RDSStack } from "./stacks/rds-stack";
import { SecurityStack } from "./stacks/security-stack";

function main() {
  const app = new App();
  const vpc = new VpcStack(app);
  const security = new SecurityStack(app, {
    vpc: vpc.vpc
  });
  const connectivity = new EC2ConectivityStack(app, {
    vpc: vpc.vpc
  });
  new EC2Stack(app, {
    nameSuffix: "Isolated",
    vpc: vpc.vpc,
    subnets: vpc.isolatedSubnets,
    connectEndpoint: connectivity.ec2InstanceConnectEndpoint
  });
  new EC2Stack(app, {
    nameSuffix: "PrivateWithEgress",
    vpc: vpc.vpc,
    subnets: vpc.privateSubnets,
    connectEndpoint: connectivity.ec2InstanceConnectEndpoint
  });
  new RDSStack(app, {
    vpc: vpc.vpc,
    subnets: vpc.isolatedSubnets,
    allowedSecurityGroups: [security.cloudShellSecurityGroup]
  });
}
main();