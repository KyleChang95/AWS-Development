# Create EC2 Instance with following specs by CDK: 

| Spec          | Value                            |
| ------------- | -------------------------------- |
| Instance Type | t3.large                         |
| CPU           | 2                                |
| Memory        | 8GB                              |
| Architecture  | x86_64                           |
| Storage       | 100GB                            |
| Volume Type   | GP3                              |
| OS            | Ubuntu 22.04 LTS                 |
| Ports         | SSH (22), HTTP (80), HTTPS (443) |

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