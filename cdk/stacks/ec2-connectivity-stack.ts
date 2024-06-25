import { InstanceConnectEndpoint } from '@open-constructs/aws-cdk/lib/aws-ec2';
import { App, Stack } from 'aws-cdk-lib';
import { SecurityGroup, Vpc } from 'aws-cdk-lib/aws-ec2';

interface EC2ConectivityStackProperties {
    vpc: Vpc;
}

export class EC2ConectivityStack extends Stack {
    public readonly ec2InstanceConnectEndpoint: InstanceConnectEndpoint;

    constructor(parent: App, props: EC2ConectivityStackProperties) {
        super(parent, "MyEC2ConectivityStack");

        this.ec2InstanceConnectEndpoint = new InstanceConnectEndpoint(this, 'MyInstanceConnectEndpoint', {
            vpc: props.vpc
        });
    }
}