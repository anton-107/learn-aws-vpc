import { App } from "aws-cdk-lib";
import { VpcStack } from "./stacks/vpc-stack";

function main() {
  const app = new App();
  new VpcStack(app);
}
main();