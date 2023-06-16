# AWS CDK development with TypeScript

* Install CDK in global scope  
  `npm install -g aws-cdk`
* Create empty project  
  `cdk init app --language typescript`
* Deploys the CDK toolkit stack into an AWS environment  
  `cdk bootstrap --profile myAWS`
* Synthesizes and prints the CloudFormation template for this stack
  `cdk synth --json --profile myAWS`
* Deploy  
  `cdk deploy --profile myAWS` or `cdk deploy --profile myAWS --all`
* Teardown  
  `cdk destroy --profile myAWS`