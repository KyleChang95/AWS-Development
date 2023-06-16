import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class Ec2Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const awsRegion: string = props!.env!.region!;
    const vpcId: string = props!.tags!['vpcId'];
    const amiId: string = props!.tags!['amiId'];
    const keyPairName: string = props!.tags!['keyPairName'];
  
    // search VPC
    const vpc = ec2.Vpc.fromLookup(this, 'getMyVPC', { vpcId });

    // setup AMI
    const amiMap: Record<string, string> = {}
    amiMap[awsRegion] = amiId

    // setup Security Group
    const securityGroup = new ec2.SecurityGroup(this, 'mySecurityGroup', {
      securityGroupName: 'mySecurityGroup',
      vpc: vpc,
      allowAllOutbound: true,
    });

    // setup ingress rule of Security Group
    [
      { port: 22, name: 'SSH' },
      { port: 80, name: 'HTTP' },
      { port: 443, name: 'HTTPS' },
    ].forEach((v) => {
      securityGroup.addIngressRule(
        ec2.Peer.ipv4('0.0.0.0/0'),
        ec2.Port.tcp(v.port),
        `Allow ${v.name} Access`,
      );
    });

    // setup EC2 instance
    const ec2Instance = new ec2.Instance(this, 'myInstance', {
      instanceName: 'myInstance',
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
      machineImage: ec2.MachineImage.genericLinux(amiMap),
      vpc: vpc,
      vpcSubnets: { subnets: vpc.privateSubnets },
      securityGroup: securityGroup,
      keyName: keyPairName,
      ssmSessionPermissions: true
    });
  }
}
