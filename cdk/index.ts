import { App } from "aws-cdk-lib";
import { VpcStack } from "./stacks/vpc-stack";
import { EC2Stack } from "./stacks/ec2-stack";
import { EC2ConectivityStack } from "./stacks/ec2-connectivity-stack";

function main() {
  const app = new App();
  const vpc = new VpcStack(app);
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
}
main();