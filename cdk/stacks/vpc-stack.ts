import { App, Stack } from "aws-cdk-lib";
import { IpAddresses, SubnetType, Vpc } from "aws-cdk-lib/aws-ec2";

export class VpcStack extends Stack {
  constructor(parent: App) {
    super(parent, "MyTestVPC");
    
    new Vpc(this, 'MyVPC', {
      ipAddresses: IpAddresses.cidr('10.0.0.0/16'),
      maxAzs: 2,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'PublicSubnet',
          subnetType: SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'PrivateIsolatedSubnet',
          subnetType: SubnetType.PRIVATE_ISOLATED,
        },
        {
          cidrMask: 24,
          name: 'PrivateWithEgressSubnet',
          subnetType: SubnetType.PRIVATE_WITH_EGRESS,
        }
      ]
    });
  }
}