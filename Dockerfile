FROM node:18-alpine3.19

RUN mkdir -p /home/node/app/node_modules 

RUN chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node package*.json ./

USER node

RUN npm install

COPY --chown=node:node resume.json resume.json

EXPOSE 4000

CMD ["npx", "resume", "serve", "--theme", "kendall", "--port", "4000"]
