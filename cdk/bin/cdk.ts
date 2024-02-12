#!/usr/bin/env node

import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { EC2Stack } from '../lib/ec2';

const app = new cdk.App();

const stack = new EC2Stack(app, 'createEc2Stack', {
  stackName: 'kyle-dev',
  env: {
    account: process.env.AWS_ACCOUNT_ID,
    region: 'us-west-2'
  },
  tags: {
    vpcId: 'vpc-04da342fb999000d5',
    amiId: 'ami-09a4692a2aaf5261a',
  }
});

cdk.Tags.of(stack).add('stack', stack.stackName);
cdk.Tags.of(stack).add('deploy', 'cdk');
