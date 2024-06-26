import { App, RemovalPolicy, Stack } from "aws-cdk-lib";
import { DatabaseCluster } from "aws-cdk-lib/aws-docdb";
import { ISubnet, InstanceClass, InstanceSize, InstanceType, Port, SecurityGroup, Vpc } from "aws-cdk-lib/aws-ec2";

interface DocumentDBStackProperties {
  vpc: Vpc;
  subnets: ISubnet[];
  allowedSecurityGroups: SecurityGroup[];
}

export class DocumentDBStack extends Stack {
  constructor(parent:App, props: DocumentDBStackProperties) {
    super(parent, `MyTestDocumentDB`);
    const port = DatabaseCluster.DEFAULT_PORT;
    const cluster = new DatabaseCluster(this, 'MyTestDocumentDB', {
      vpc: props.vpc,
      vpcSubnets: {subnets: props.subnets },
      port,
      instances: 1,
      masterUser: {
        username: 'mongouser',
      },
      instanceType: InstanceType.of(
        InstanceClass.T4G,
        InstanceSize.MEDIUM,
      ),
      removalPolicy: RemovalPolicy.DESTROY
    });
    props.allowedSecurityGroups.forEach(sg => {
      cluster.connections.allowFrom(sg, Port.tcp(port), "Mongodb clients ingress");
    });
  }
}