import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const stackName: string = props!.stackName!;
    const awsRegion: string = props!.env!.region!;
    const vpcId: string = props!.tags!['vpcId'];
    const amiId: string = props!.tags!['amiId'];
    const keyPairName: string = props!.tags!['keyPairName'];
  
    // Search VPC by VPC ID
    const vpc = ec2.Vpc.fromLookup(this, 'getVPC', { vpcId });

    // Setup AMI MAP
    const amiMap: Record<string, string> = {}
    amiMap[awsRegion] = amiId

    // Create Security Group
    const securityGroup = new ec2.SecurityGroup(this, 'createSecurityGroup', {
      securityGroupName: stackName + '-security-group',
      vpc: vpc,
      allowAllOutbound: true,
    });

    // Add SSH, HTTP, HTTPS access
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

    // Setup root volume
    const volume: ec2.BlockDevice = {
      deviceName: '/dev/sda1',
      volume: ec2.BlockDeviceVolume.ebs(100, {
        deleteOnTermination: true,
        encrypted: true,
        volumeType: ec2.EbsDeviceVolumeType.GP3,
      }),
    };

    /**
     * Create EC2 Instance with following specs: 
     * 
     * - Instance Type  : t3.large 
     * - CPU            : 2
     * - Memory         : 8GB
     * - Architecture   : x86_64
     * - Storage        : 100GB
     * - Volume Type    : GP3
     * - OS             : Ubuntu 22.04 LTS
     */
    new ec2.Instance(this, 'createInstance', {
      instanceName: stackName,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.LARGE),
      machineImage: ec2.MachineImage.genericLinux(amiMap),
      vpc: vpc,
      vpcSubnets: { subnets: vpc.publicSubnets },
      securityGroup: securityGroup,
      keyName: keyPairName,
      ssmSessionPermissions: true,
      blockDevices: [volume],
      associatePublicIpAddress: true,
    });
  }
}
