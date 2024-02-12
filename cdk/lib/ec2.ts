import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class EC2Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const stackName: string = props!.stackName!;
    const awsRegion: string = props!.env!.region!;
    const vpcId: string = props!.tags!['vpcId'];
    const amiId: string = props!.tags!['amiId'];
  
    // Search VPC by VPC ID.
    const vpc = ec2.Vpc.fromLookup(this, 'getVPC', { vpcId });

    // Setup Subnet Selection.
    const SubnetSelection: ec2.SubnetSelection = {
      subnetType: ec2.SubnetType.PUBLIC
    };

    // Setup AMI MAP.
    //  * Description  : Amazon Linux 2023 AMI 2023.1.20230906.1 x86_64 HVM kernel-6.1
    //  * Architecture : 64-bit (x86)
    const amiMap: Record<string, string> = {}
    amiMap[awsRegion] = amiId

    // Create Security Group.
    const securityGroup = new ec2.SecurityGroup(this, 'createSecurityGroup', {
      securityGroupName: stackName,
      vpc: vpc,
      allowAllOutbound: true,
    });

    // Allow SSH, HTTP, HTTPS access from anywhere.
    [
      { port: 22, name: 'SSH' },
      { port: 80, name: 'HTTP' },
      { port: 443, name: 'HTTPS' },
      { port: 3389, name: 'RDP' },
    ].forEach((v) => {
      securityGroup.addIngressRule(
        ec2.Peer.ipv4('0.0.0.0/0'),
        ec2.Port.tcp(v.port),
        `Allow ${v.name} Access`,
      );
    });

    // Setup root volume
    //  * Size                : 30GB
    //  * Type                : GP3
    //  * DeleteOnTermination : false
    // const volume: ec2.BlockDevice = {
    //   deviceName: '/dev/xvda',
    //   volume: ec2.BlockDeviceVolume.ebs(30, {
    //     deleteOnTermination: false,
    //     encrypted: true,
    //     volumeType: ec2.EbsDeviceVolumeType.GP3
    //   })
    // };

    // Create EC2 Instance with following specs: 
    //  * OS             : AWS Linux 2023 AMI (64-bit, x86)
    //  * Instance Type  : t2.micro (1 vCPU, 1 GB Memory)
    //  * Storage        : 30GB (GP3, deleteOnTermination: false)
    const instance = new ec2.Instance(this, 'createInstance', {
      instanceName: stackName,
      machineImage: ec2.MachineImage.genericLinux(amiMap),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.LARGE),
      keyName: 'ims-dev',
      vpc: vpc,
      vpcSubnets: SubnetSelection,
      associatePublicIpAddress: true,
      securityGroup: securityGroup,
      // blockDevices: [volume],
      ssmSessionPermissions: true,
    });

    // Print instance public IP.
    new cdk.CfnOutput(this, 'printPublicIP', {
      value: instance.instancePublicIp,
    });
  }
}
