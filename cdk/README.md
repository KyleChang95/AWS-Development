# AWS CDK development with TypeScript

* Install CDK in global scope  
  `npm install -g aws-cdk`
* Create empty project  
  `cdk init app --language typescript`
* Deploys the CDK toolkit stack into an AWS environment  
  `cdk bootstrap`
* Synthesizes and prints the CloudFormation template for this stack
  `cdk synth --json`
* Deploy  
  `cdk deploy` or `cdk deploy --all`
* Teardown  
  `cdk destroy`