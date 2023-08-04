#!/usr/bin/env node

import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { Stack } from '../lib/stack';
import * as dotenv from 'dotenv'

dotenv.config({ path: process.env.ENV_PATH })

const app = new cdk.App();

const stack = new Stack(app, 'createStack', {
  stackName: 'remote-dev',
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

cdk.Tags.of(stack).add('env', 'dev');
cdk.Tags.of(stack).add('region', 'hq');
cdk.Tags.of(stack).add('div', 'ki1000');
cdk.Tags.of(stack).add('dept', 'ki1040');
cdk.Tags.of(stack).add('deploy', 'cdk');
