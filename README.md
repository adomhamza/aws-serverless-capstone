# Serverless EBOOKSHELF

App for uploading pdf to an S3 bucket.

# Functionality of the application

This appliation will allow to add/delete/download Books. Each Book title can optionally have an attachment pdf. Each user only has access to Books that he/she has created. 

# Functions to be implemented

To implement this project you need to implement the following functions and configure them in the `serverless.yml` file:

* `Auth` - this function should implement a custom authorizer for API Gateway that should be added to all other functions.
* `GetBooks` - should return all Books for a current user. 
* `CreateBook` - should create a new Book for a current user. A shape of data send by a client application to this function can be found in the `CreateBookRequest.ts` file
* `DeleteBook` - should delete a Book item created by a current user. Expects an id of a Book to remove.
* `GenerateUploadUrl` - returns a presigned url that can be used to upload an attachment file for a Book item. 

All functions are already connected to appropriate events from API gateway

An id of a user can be extracted from a JWT token passed by a client

You also need to add any necessary resources to the `resources` section of the `serverless.yml` file such as DynamoDB table and and S3 bucket.

# Frontend

The `client` folder contains a web application that can use the API that should be developed in the project.

To use it please edit the `config.ts` file in the `client` folder:

```ts
const apiId = '...' API Gateway id
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: '...',    // Domain from Auth0
  clientId: '...',  // Client id from an Auth0 application
  callbackUrl: 'http://localhost:3000/callback'
}
```



# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless TODO application.

