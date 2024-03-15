import { App } from "aws-cdk-lib";
import { VpcStack } from "./stacks/vpc-stack";
import { EC2Stack } from "./stacks/ec2-stack";

function main() {
  const app = new App();
  const vpc = new VpcStack(app);
  new EC2Stack(app, {
    nameSuffix: "Isolated",
    vpc: vpc.vpc,
    subnets: vpc.isolatedSubnets,
  });
  new EC2Stack(app, {
    nameSuffix: "PrivateWithEgress",
    vpc: vpc.vpc,
    subnets: vpc.privateSubnets,
  });
}
main();