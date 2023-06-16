import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import { IpAddresses, SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';

export class VpcStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new Vpc(this, 'myVPC', {
      vpcName: 'myVPC',
      ipAddresses: IpAddresses.cidr('10.0.0.0/16'),
      maxAzs: 1,
      subnetConfiguration: [
        {
          cidrMask: Number(24),
          name: 'public-subnet',
          subnetType: SubnetType.PUBLIC,
        },
        {
          cidrMask: Number(24),
          name: 'private-subnet',
          subnetType: SubnetType.PRIVATE_WITH_EGRESS,
        },
      ],
    });
  }
}
