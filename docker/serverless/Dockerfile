FROM node:14

WORKDIR /home/user-auth
COPY . /home/user-auth
RUN ls
RUN yarn
RUN yarn add -D serverless


EXPOSE 5050

CMD tail -f /dev/null
