import { App, Stack } from "aws-cdk-lib";
import { AmazonLinuxGeneration, AmazonLinuxImage, ISubnet, Instance, InstanceClass, InstanceSize, InstanceType, KeyPair, SubnetSelection, Vpc } from "aws-cdk-lib/aws-ec2";

interface EC2StackProperties {
  nameSuffix: string;
  vpc: Vpc;
  subnets: ISubnet[];
}

export class EC2Stack extends Stack {
  constructor(parent: App, props: EC2StackProperties) {
    super(parent, `MyTestEC2-${props.nameSuffix}`);

    const keyPair = new KeyPair(this, 'MyTestKeyPair', {});

    new Instance(this, `MyTestInstance-${props.nameSuffix}`, {
      vpc: props.vpc,
      vpcSubnets: { subnets: props.subnets },
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.NANO),
      machineImage: new AmazonLinuxImage({generation: AmazonLinuxGeneration.AMAZON_LINUX_2023}),
      keyPair
    });
  }
}