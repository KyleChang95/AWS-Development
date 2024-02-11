FROM node:18

RUN apt update
RUN apt install -y python3-pip
RUN pip3 install awscli
RUN npm install -g aws-cdk

WORKDIR /cdk

ADD . /cdk/

RUN npm install

RUN cdk bootstrap

CMD [ "cdk", "deploy" ]