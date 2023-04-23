## Overview

API production link: https://jl0qxmh3o5.execute-api.ap-southeast-1.amazonaws.com/v1/

Postman Collections: https://api.postman.com/collections/25891575-2e91225e-00a2-4c77-a404-20bed50dce70?access_key=PMAT-01GYQXKDZ76PTZ4D9CDJFM3ZN5

Envoriment Require: Node 14+

1. Install dependency

```
npm install
```

2. Run NestJS code in local machine

```
npm run start:dev
```

3. Techstack used

- Node.js, Nest.js framework
- AWS Lambda, DynamoDB (noSQL)
- Serverless Framework for deploy

4. Deploy to cloud

4.1 Create .env file base from .env.example and fill access_key and secret_key to .env file

4.2 Install serverless-cli

ref: https://www.serverless.com/framework/docs/getting-started

4.3. Deploy to cloud by using 

```
sls deploy
```
