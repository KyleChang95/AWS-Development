#!/usr/bin/env node

import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { EC2Stack } from '../lib/ec2';
import * as dotenv from 'dotenv'

dotenv.config({ path: process.env.ENV_PATH })

const app = new cdk.App();

const stack = new EC2Stack(app, 'createEc2Stack', {
  stackName: 'kyle-dev',
  env: {
    account: process.env.AWS_ACCOUNT_ID,
    region: process.env.AWS_REGION
  },
  tags: {
    vpcId: process.env.AWS_VPC_ID!,
    amiId: process.env.AWS_AMI_ID!,
  }
});

cdk.Tags.of(stack).add('stack', stack.stackName);
cdk.Tags.of(stack).add('deploy', 'cdk');
