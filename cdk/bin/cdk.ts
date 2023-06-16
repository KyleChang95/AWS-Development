#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { Ec2Stack } from '../lib/ec2Stack';
import { VpcStack } from '../lib/vpcStack';
import * as dotenv from 'dotenv'

dotenv.config({ path: process.env.MYSELF_ENV_PATH })

const app = new cdk.App();

const vpcStack = new VpcStack(app, 'VpcStack', {
  env: {
    account: process.env.AWS_ACCOUNT_ID,
    region: process.env.AWS_REGION
  },
  tags: {
    vpcId: 'vpc-022060a8b156e641e',
    amiId: 'ami-03f65b8614a860c29',
    keyPairName: 'myKeypair'
  }
});

cdk.Tags.of(vpcStack).add('owner', 'changyuchun159630@gmail.com')
cdk.Tags.of(vpcStack).add('deploy', 'cdk')

// const ec2Stack = new Ec2Stack(app, 'Ec2Stack', {
//   env: {
//     account: process.env.AWS_ACCOUNT_ID,
//     region: process.env.AWS_REGION
//   },
//   tags: {
//     vpcId: 'vpc-022060a8b156e641e',
//     amiId: 'ami-03f65b8614a860c29',
//     keyPairName: 'myKeypair'
//   }
// });

// cdk.Tags.of(ec2Stack).add('owner', 'changyuchun159630@gmail.com')
// cdk.Tags.of(ec2Stack).add('deploy', 'cdk')
