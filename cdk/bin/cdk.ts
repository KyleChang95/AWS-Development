#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkStack } from '../lib/cdk-stack';
import * as dotenv from 'dotenv'

dotenv.config({ path: process.env.MYSELF_ENV_PATH })

const app = new cdk.App();
const stack = new CdkStack(app, 'CdkStack', {
  env: {
    account: process.env.AWS_ACCOUNT_ID,
    region: process.env.AWS_REGION
  },
  tags: {
    vpcId: 'vpc-022060a8b156e641e',
    securityGroupName: 'mySecurityGroup',
    instanceName: 'myInstance',
    keyPairName: 'myKeypair'
  }
});

cdk.Tags.of(stack).add('owner', 'changyuchun159630@gmail.com')
cdk.Tags.of(stack).add('deploy', 'cdk')
