/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var authGeotidespwa2444b4e1UserPoolId = process.env.AUTH_GEOTIDESPWA2444B4E1_USERPOOLID

Amplify Params - DO NOT EDIT */

var express = require("express");
var bodyParser = require("body-parser");
var awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");

// declare a new express app
var app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

/**********************
 * Example get method *
 **********************/

var axios = require("axios");

const api_key = "09f4b958-0cbf-4fcd-aad7-95b75092a060";

app.get("/tides/:lat-:lon", function(req, res) {
  const query_string = `https://www.worldtides.info/api?extremes&lat=${req.params.lat}&lon=${req.params.lon}&key=${api_key}`;
  axios
    .get(query_string)
    .then(response => res.json({ error: null, tides: response.data }))
    .catch(err => res.json({ error: err, tides: {...req.params, query: query_string} }));
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
