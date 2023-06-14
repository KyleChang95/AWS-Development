import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

interface Config {
  vpcName: string;
  vpcCidr: string;
  subnetCidrMask: string;
  privateSubnetName: string;
  publicSubnetName: string;
  securityGroupName: string;
  instanceName: string;
  keyPairName: string;
}

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const config = JSON.parse(JSON.stringify(props!.tags!)) as Config

    // setup VPC and Subnets
    const vpc = new ec2.Vpc(this, config.vpcName, {
      vpcName: config.vpcName,
      ipAddresses: ec2.IpAddresses.cidr(config.vpcCidr),
      subnetConfiguration: [
        {
          cidrMask: Number(config.subnetCidrMask),
          name: config.publicSubnetName,
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: Number(config.subnetCidrMask),
          name: config.privateSubnetName,
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
      ],
    });

    // setup Security Group
    const securityGroup = new ec2.SecurityGroup(this, config.securityGroupName, {
      securityGroupName: config.securityGroupName,
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
    const ec2Instance = new ec2.Instance(this, config.instanceName, {
      instanceName: config.instanceName,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
      machineImage: ec2.MachineImage.latestAmazonLinux2023({ kernel: ec2.AmazonLinux2023Kernel.DEFAULT }),
      vpc: vpc,
      vpcSubnets: { subnets: vpc.publicSubnets },
      securityGroup: securityGroup,
      keyName: config.keyPairName,
      // role: runnerRole,
      ssmSessionPermissions: true
    });

    // print EC2 Instance Private IP
    new cdk.CfnOutput(this, 'PrintEC2InstancePrivateIp', {
      value: ec2Instance.instancePrivateIp,
    });

    // print EC2 Instance Private DNS Name
    new cdk.CfnOutput(this, 'PrintEC2InstancePrivateDnsName', {
      value: ec2Instance.instancePrivateDnsName,
    });

    // print EC2 Instance Public IP
    new cdk.CfnOutput(this, 'PrintEC2InstancePublicIp', {
      value: ec2Instance.instancePublicIp,
    });

    // print EC2 Instance Public DNS Name
    new cdk.CfnOutput(this, 'PrintEC2InstancePublicDnsName', {
      value: ec2Instance.instancePublicDnsName,
    });
  }
}
