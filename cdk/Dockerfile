FROM node:18

ARG AWS_ACCOUNT_ID
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY

RUN apt update
RUN apt install -y python3-pip
RUN pip3 install --upgrade pip
RUN pip3 install awscli
RUN npm install -g aws-cdk

WORKDIR /cdk

ADD . /cdk/

RUN npm install

RUN cdk bootstrap

CMD [ "/bin/bash" ]