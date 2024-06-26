import { App, RemovalPolicy, Stack } from "aws-cdk-lib";
import { ISubnet, InstanceClass, InstanceSize, InstanceType, Port, SecurityGroup, Vpc } from "aws-cdk-lib/aws-ec2";
import { DatabaseInstance, DatabaseInstanceEngine, PostgresEngineVersion } from "aws-cdk-lib/aws-rds";

interface RDSStackProperties {
  vpc: Vpc;
  subnets: ISubnet[];
  allowedSecurityGroups: SecurityGroup[];
}
export class RDSStack extends Stack {
  constructor(parent:App, props: RDSStackProperties) {
    super(parent, `MyTestRDS`);
    const instance = new DatabaseInstance(this, 'PostgresInstance', {
      vpc: props.vpc,
      vpcSubnets: { subnets: props.subnets },
      engine: DatabaseInstanceEngine.postgres({
        version: PostgresEngineVersion.VER_15_6
      }),
      instanceType: InstanceType.of(
        InstanceClass.T4G,
        InstanceSize.MICRO,
      ),
      allocatedStorage: 10,
      allowMajorVersionUpgrade: true,
      removalPolicy: RemovalPolicy.DESTROY,
      databaseName: 'my_test_db'
    });
    props.allowedSecurityGroups.forEach(sg => {
      instance.connections.allowFrom(sg, Port.tcp(5432), "Postgres clients ingress");
    });

  }
}