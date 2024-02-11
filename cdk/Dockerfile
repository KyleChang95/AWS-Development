FROM node:18

ARG AWS_ACCOUNT_ID
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY

RUN npm install -g aws-cdk

ADD . /aws/

WORKDIR /aws/cdk

RUN npm install

RUN cdk bootstrap

CMD [ "cdk", "deploy" ]