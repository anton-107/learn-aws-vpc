import { App, CfnOutput, Stack } from "aws-cdk-lib";
import { AuthorizationType, EndpointType, MockIntegration, PassthroughBehavior, RestApi } from "aws-cdk-lib/aws-apigateway";
import { InterfaceVpcEndpoint, InterfaceVpcEndpointAwsService, SubnetType, Vpc } from "aws-cdk-lib/aws-ec2";
import { AnyPrincipal, Effect, PolicyDocument, PolicyStatement } from "aws-cdk-lib/aws-iam";

interface APIGatewayStackProperties {
  allowedSourceVPC: Vpc;
}

export class APIGatewayStack extends Stack {
  constructor(parent: App, props: APIGatewayStackProperties) {
    super(parent, `MyTestAPIGateway`);

    const api = new RestApi(this, 'MyTestAPIGateway', {
      restApiName: 'MyTestAPIGateway',
      description: 'This is my API for demonstration purposes',
      endpointTypes: [EndpointType.PRIVATE],
      defaultMethodOptions: {
        authorizationType: AuthorizationType.NONE, // No authorization required
        apiKeyRequired: false, // API key not required
      },
      policy: new PolicyDocument({
        statements: [
          // ALLOW all requests by default
          new PolicyStatement({
            principals: [new AnyPrincipal()],
            actions: ['execute-api:Invoke'],
            resources: ['execute-api:/*'],
            effect: Effect.ALLOW
          }),
          // DENY all requests that are not coming from a specified VPC:
          new PolicyStatement({
            principals: [new AnyPrincipal()],
            actions: ['execute-api:Invoke'],
            resources: ['execute-api:/*'],
            effect: Effect.DENY,
            conditions: {
              StringNotEquals: {
                'aws:SourceVpc': [props.allowedSourceVPC.vpcId]
              }
            }
          })
        ]
      }),
    });

    // Add a resource and a method
    const helloResource = api.root.addResource('hello');
    helloResource.addMethod('GET', new MockIntegration({
      integrationResponses: [{
        statusCode: '200',
        responseTemplates: {
          'application/json': JSON.stringify({ message: 'Hello, World!' }),
        },
      }],
      passthroughBehavior: PassthroughBehavior.NEVER,
      requestTemplates: {
        'application/json': '{ "statusCode": 200 }',
      }
    }), {
      methodResponses: [{ statusCode: '200' }]
    });

    new InterfaceVpcEndpoint(this, 'ApiGatewayVpcEndpoint', {
      vpc: props.allowedSourceVPC,
      service: InterfaceVpcEndpointAwsService.APIGATEWAY,
      privateDnsEnabled: true,
      subnets: {
        subnetType: SubnetType.PRIVATE_ISOLATED,
      },
    });
    

    // Output the API URL
    new CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'API Gateway URL',
    });
  }
}