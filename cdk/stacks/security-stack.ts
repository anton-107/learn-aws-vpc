import { App, Stack } from "aws-cdk-lib";
import {  SecurityGroup, Vpc } from "aws-cdk-lib/aws-ec2";

interface SecurityStackProperties {
  vpc: Vpc;
}
export class SecurityStack extends Stack {
  public readonly cloudShellSecurityGroup: SecurityGroup;

  constructor(parent:App, props: SecurityStackProperties) {
    super(parent, `MyTestSecurityStack`);
    this.cloudShellSecurityGroup = new SecurityGroup(this, 'AWS CloudShell environments', {
      vpc: props.vpc
    });
  }
}