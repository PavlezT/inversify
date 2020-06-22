FROM node:10.16.0-jessie-slim

ENV NODE_ENV=development

COPY . /app/

WORKDIR /app/
RUN npm install 

ENTRYPOINT [ "npm", "run", "start" ]
#ENTRYPOINT [ "npm", "run", "start:prod" ]

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
             CMD curl -f http://localhost:3001/api/auth/helthchech || exit 1