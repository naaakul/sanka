FROM node:21.slim

RUN apt-get update && apt-get install -y curl && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY compile_play.sh /compile_play.sh
RUN chmod +x /compile_play.sh

WORKDIR /home/user/nextjs-app

RUN npx --yes create-next-app@15.3.3 . --yes

RUN npx --yes shadcn@2.6.3 init --yes -b neutral --force
RUN npx --yes shadcn@2.6.3 add --add -yes

RUN mv /home/user/nextjs-app/* /home/user/ && rm -rf /home/user/nextjs-app