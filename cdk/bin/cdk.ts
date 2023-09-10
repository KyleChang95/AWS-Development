#!/usr/bin/env node

import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { EC2Stack } from '../lib/ec2';
import * as dotenv from 'dotenv'

dotenv.config({ path: process.env.ENV_PATH })

const app = new cdk.App();

const stack = new EC2Stack(app, 'createEc2Stack', {
  stackName: 'ec2-stack',
  env: {
    account: process.env.AWS_ACCOUNT_ID,
    region: process.env.AWS_REGION
  },
  tags: {
    vpcId: process.env.AWS_VPC_ID!,
    amiId: process.env.AWS_AMI_ID!,
    keyPairName: process.env.AWS_KEY_PAIR_NAME!
  }
});

cdk.Tags.of(stack).add('stack', 'ec2-stack');
cdk.Tags.of(stack).add('deploy', 'cdk');
