![](docs/title-logo.png)

Alagarr is a request-response helper library for serverless/faas functions<sup>\*</sup> invoked via HTTP events (e.g. via API Gateway). Alagarr makes your code portable: it abstracts the event-context-callback function signatures of various serverless-providers so that you can spend less time writing boring function-as-a-service-related boilerplate.

Alagarr is a higher-order function which abstracts the the programming models of various serverless-cloud providers and adds a standardized request-response model extensible through composable middleware functions. It's API is concise and will be familiar to anyone who's worked with Express.js. It comes with built-in error handling which makes it trivial to implement error-recovery strategies.

<sup>\*</sup>Currently: AWS Lambda/API Gateway. Next: GCP & Azure

[![CircleCI](https://img.shields.io/circleci/project/github/adieuadieu/alagarr/master.svg?style=flat-square)](https://circleci.com/gh/adieuadieu/alagarr)
[![Coveralls](https://img.shields.io/coveralls/adieuadieu/alagarr/master.svg?style=flat-square)](https://coveralls.io/github/adieuadieu/alagarr)
[![David](https://img.shields.io/david/adieuadieu/alagarr.svg?style=flat-square)]()
[![David](https://img.shields.io/david/dev/adieuadieu/alagarr.svg?style=flat-square)]()

Without Alagarr:

```js
// AWS Lambda / API Gateway
module.exports.myHandler = function(event, context, callback) {
  callback(null, {
    statusCode: 200,
    body: JSON.stringify({ foo: 'bar' }),
    headers: {
      'content-type': 'application/json',
    },
  })
}
```

With Alagarr:

```js
const alagarr = require('alagarr')

module.exports.myHandler = alagarr(() => ({ foo: 'bar' }))
```

## Contents

1.  [Features](#features)
1.  [Full Example](#full-example)
1.  [Installation & Usage](#installation--usage)
1.  [Configuration](#configuration)
    1.  [Options](#configuration-options)
1.  [API](#api)
1.  [Error Handling](#error-handling)
1.  [Logging](#logging)
1.  [Middleware](#middleware)
    1.  [Request Middleware](#request-middleware)
    1.  [Response Middleware](#response-middleware)
    1.  [Custom Middleware](#custom-middleware)
1.  [Contributing](#contributing)
1.  [Similar Projects](#similar-projects)
1.  [Related Thingies](#related-thingies)
1.  [License](#license)

## Features

* Concise & familiar API
* Zero dependencies
* Fully tested
* Built-in error handling makes catching and throwing errors a breeze
* Kibana-ready request logging
* Middleware for common tasks included
* Request cookie parsing
* Normalized request headers
* Includes request body parsers
* Response CSP headers
* Response gzipping/deflate
* Easily respond with images/binary data
* Support for custom middleware

## Full Example

Alagarr helps you cut out all the boilerplate involved with handling HTTP requests in serverless functions. Albeit somewhat contrived, here is a before-and-after example of a common pattern frequently found in AWS Lambda function's:

#### Without Alagarr 😭

```javascript
const got = require('got')

module.exports.handler = function(event, context, callback) {
  const { queryStringParameters: { currency } } = event

  if (!currency) {
    callback(null, {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Please provide the "currency" query parameter.',
      }),
      headers: {
        'content-type': 'application/json',
      },
    })
  }

  got(`https://api.coinmarketcap.com/v1/ticker/${currency}`)
    .then(response => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(response),
        headers: {
          'content-type': 'application/json',
        },
      })
    })
    .catch(error => {
      callback(null, {
        statusCode: error.statusCode,
        body: JSON.stringify({
          error: error.response,
        }),
        headers: {
          'content-type': 'application/json',
        },
      })
    })
}
```

#### With Alagarr 😁

```javascript
const { alagarr, ClientError } = require('alagarr') // @TODO: this require is wrong
const got = require('got')

module.exports.handler = alagarr((request, response) => {
  const { query: { currency } } = request

  if (!currency) {
    throw new ClientError('Please provide the "currency" query parameter.')
  }

  return got(`https://api.coinmarketcap.com/v1/ticker/${currency}`)
})
```

There are a few things being handled for you in the above Alagarr example:

* The programming model has been normalized. You can run this code without modification on any of the [supported](#supported-providers) cloud/faas/serverless providers. Not just AWS Lambda. Alagarr makes your code portable.
* The `callback()` is being handled for you. Alagarr will set the status code, content-type, and body appropriately. More on this behavior [here](#api-alagarr-handlerFunction).
* Errors are caught for you and turned into something appropriate for the client based on the type of error. If you don't like the default behavior, you can [provide your own](#error-handling) error handler.

## Installation & Usage

Install Alagarr with NPM or Yarn:

```bash
npm install alagarr
```

Then include it in your serverless function:

```js
const alagarr = require('alagarr')

module.exports.exampleHandler = alagarr(request => {
  const { path, provider } = request

  return `You've ended up at ${path} on the ${provider} cloud.`
})
```

## Configuration

Alagarr ships with default configuration that should work for most use-cases. But, it's possible to pass a configuration object as the second parameter to the alagar() function:

```js
const alagarr = require('alagarr')

module.exports.handler = alagarr(() => 'Hello world!', {
  headers: {},
  logger: console.log,
})
```

### Configuration Options

The available configuration options are outlined here:

| Option                 | Default | Description                                                                                                                                                                              |
| ---------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **cspPolicies**        | []      | List of CSP policies to include in the response headers                                                                                                                                  |
| **errorHandler**       |         | Provide a custom error handler. See the section on [Error Handling](#error-handling) for more details                                                                                    |
| **headers**            | {}      | Headers to include in every response                                                                                                                                                     |
| **logger**             |         | Logger to use to log requests. If undefined, Alagarr will use an internal logger. Logging can be disabled by setting to `false`. See the section on [Logging](#logging) for more details |
| **requestMiddleware**  |         | Array of custom request middleware to use. See the section on [Request Middleware](#request-middleware) for more details                                                                 |
| **responseMiddleware** |         | Array of custom response middleware to use. See the section on [Response Middleware](#request-middleware) for more details                                                               |

## API

### Alagarr module

* [`alagarr()`](#api-alagarr-module-default)
* [`requestMiddleware`](#api-alagarr-module-request-middleware)
* [`responseMiddleware`](#api-alagarr-module-response-middleware)
* [`ClientError()`](#api-alagarr-module-client-error)
* [`ServerError()`](#api-alagarr-module-server-error)

### Request methods

* [`request.body`](#api-request-body)
* [`request.context`](#api-request-context)
* [`request.cookies`](#api-request-cookies)
* [`request.headers`](#api-request-headers)
* [`request.hostname`](#api-request-hostname)
* [`request.meta`](#api-request-meta)
* [`request.method`](#api-request-method)
* [`request.path`](#api-request-path)
* [`request.provider`](#api-request-provider)
* [`request.query`](#api-request-query)
* [`request.source`](#api-request-source)
* [`request.timestamp`](#api-request-timestamp)

### Response methods

* [`response.json()`](#api-response-json)
* [`response.html()`](#api-response-html)
* [`response.text()`](#api-response-text)
* [`response.svg()`](#api-response-svg)
* [`response.png()`](#api-response-png)
* [`response.jpeg()`](#api-response-jpeg)
* [`response.respondTo()`](#api-response-respondTo)
* [`response.raw()`](#api-response-raw)

---

<a name="api-alagarr-module-default" />

### alagarr(handlerFunction, configurationOptions?): void

@TODO

```javascript
const alagarr = require('alagarr')

const configurationOptions = {
  logger: false,
}

const handlerFunction = function(request, response) {
  const { query: { name } } = request
  return response.html(`Hello ${name}.`)
}

module.exports.handler = alagar(handlerFunction, configurationOptions)
```

<a name="api-alagarr-handlerFunction" />

The `handlerFunction` has a function signature of:

```typescript
export type HandlerFunction = (
  request: any,
  response: any,
) => string | object | void | Promise<string | object | void>
```

If your `handlerFunction` returns falsey, then it's your responsibility to call the appropriate response method to end the invocation (e.g. `response.json()`). For convenience, if the `handlerFunction` returns a string, the result will be passed to `response.html()` or `response.text()` for you. Alternatively, if the handler returns an object, it will be passed to `response.json()`. You may also return a Promise (or make your handler `async`).

---

<a name="api-alagarr-module-request-middleware" />

### requestMiddleware

@TODO

---

<a name="api-alagarr-module-response-middleware" />

### responseMiddleware

@TODO

---

<a name="api-alagarr-module-client-error" />

### ClientError(message, statusCode = 400)

@TODO

---

<a name="api-alagarr-module-server-error" />

### ServerError(message, statusCode = 500)

@TODO

---

<a name="api-request-body" />

### request.body

@TODO

---

<a name="api-request-context" />

### request.context

@TODO

---

<a name="api-request-cookies" />

### request.cookies

@TODO

---

<a name="api-request-headers" />

### request.headers

@TODO

---

<a name="api-request-hostname" />

### request.hostname

@TODO

---

<a name="api-request-meta" />

### request.meta

@TODO

---

<a name="api-request-method" />

### request.method

@TODO

---

<a name="api-request-path" />

### request.path

@TODO

---

<a name="api-request-provider" />

### request.provider

@TODO

---

<a name="api-request-query" />

### request.query

@TODO

---

<a name="api-request-source" />

### request.source

@TODO

---

<a name="api-request-timestamp" />

### request.timestamp

@TODO

---

<a name="api-response-respondTo" />

### response.respondTo(formats, statusCode = 200, options = {}): void

Respond according to request's Accept header with formats provided in `formats` map. Kind of like a Ruby on Rails `respond_to do |format|` [block](http://api.rubyonrails.org/classes/ActionController/MimeResponds.html#method-i-respond_to).

```js
response.respondTo({
  json: {},
  html: '<html />',
})
```

---

<a name="api-response-raw" />

### response.raw(error: Error | null, result?: object | boolean | number | string): void

Exposes the underlying `callback` method.

```js
response.raw(null, { something: 'custom' })
```

## Error Handling

Throw em. Alagarr will catch them.

@TODO

## Logging

Yes.

@TODO

## Middleware

Alagarr uses a pipeline of middleware functions to process the incoming request and outgoing response objects. This lets you customize how your requests and responses are handled as well as provide custom middleware in addition to those provided by Alagarr.

### Request Middleware

Alagarr includes the following request middleware:

| Provider | Name                                                                                 | Default  | Description                                                                                                                     |
| -------- | ------------------------------------------------------------------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------- |
| All      | [meta](src/request/middleware/meta.ts)                                               | built-in | Adds meta data about the request including whether the invocation is a coldStart, and invocation count                          |
| All      | [normalize-headers](src/request/middleware/normalize-headers.ts)                     | built-in | Normalizes request headers.                                                                                                     |
| All      | [normalize-programming-model](src/request/middleware/normalize-programming-model.ts) | built-in | Normalizes the programming models of different providers.                                                                       |
| All      | [timestamp](src/request/middleware/timestamp.ts)                                     | built-in | Adds a request-start timestamp under `request.timestamp` which can be used to determine the ellapsed duration of the invocation |
| Any      | [cookies](src/request/middleware/cookies.ts)                                         | enabled  | Parses cookies out of request header and makes them accessible under `request.cookies`                                          |
| Any      | [hostname](src/request/middleware/hostname.ts)                                       | enabled  | Sets a convenience `hostname` property on the request object based on the request headers                                       |
| Any      | [json-body](src/request/middleware/json-body.ts)                                     | enabled  | Body parser for request bodies with content-type of application/json                                                            |
| Any      | [url-encoded-body](src/request/middleware/url-encoded-body.ts)                       | enabled  | Body parser for request bodies with content-type of application/x-www-form-urlencoded                                           |
| AWS      | [base64-body](src/request/middleware/base64-body.ts)                                 | enabled  | Decodes base64-encoded request bodies when `isBase64Encoded` on the API Gateway request is truthy                               |

### Response Middleware

Alagarr includes the following response middleware:

| Provider | Name                                                            | Default  | Description                                                                                                   |
| -------- | --------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------- |
| All      | [enforced-headers](src/response/middleware/enforced-headers.ts) | built-in |                                                                                                               |
| All      | [log](src/response/middleware/log.ts)                           | built-in |                                                                                                               |
| Any      | [compress](src/response/middleware/compress.ts)                 | disabled | Compress response body with deflate or gzip when appropriate                                                  |
| Any      | [content-length](src/response/middleware/content-length.ts)     | enabled  | Adds a content-length header to the response                                                                  |
| Any      | [csp](src/response/middleware/csp.ts)                           | enabled  | Adds [Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) headers to the response |
| Any      | [etag](src/response/middleware/etag.ts)                         | disabled | Adds an Entity Tag (ETag) header to the response                                                              |

### Custom Middleware

All middleware are functions. Middleware which is included in Alagarr are all pure, but this is not required for custom middleware. Middleware may return Promises which are resolved before the next middleware is called. Middleware should not mutate state, but instead return new values—but this is not required in custom middleware. However, everytime middleware mutates state, a cute cuddly koala dies somewhere in Australia. So.. Yea.

Request middleware act on a request object and must always return a new request object. Request middleware have the following function signature:

```typescript
type requestMiddleware = (
  request: InterfaceRequest,
  options: InterfaceAlagarrOptions,
) => InterfaceRequest
```

Response middleware act on the response object and must always return a new response object. Response middleware have the following function signature:

```typescript
type responseMiddleware = (
  response: InterfaceResponseData,
  request: InterfaceRequest,
  options: InterfaceAlagarrOptions,
) => InterfaceResponseData
```

#### Example

An example of custom middleware might be middleware which handles user sessions. The request middleware would restore a session from some data store, while the response middleware might ensure a session is updated and a cookie is set.

**Request Middleware**

```javascript
module.exports.restoreSession = async function(request) {
  const { cookies: { sessionId } } = request
  const session = (await getSessionFromDatabase(sessionId)) || undefined

  return {
    ...request,
    session,
  }
}
```

**Response Middleware**

```javascript
module.exports.saveSession = async function(responsePayload, request) {
  const sessionCookie = await saveSessionToDatabase(request.session)

  return {
    ...responsePayload,
    headers: {
      ...responsePayload.headers,
      'Set-Cookie': `session=${sessionCookie}`, // @TODO: refactor once #5 is closed.
    },
  }
}
```

This custom middleware could then be used with Alagarr in a serverless function handler with:

```javascript
const handler = require('alagarr')
const { restoreSession, saveSession } = require('./custom-middleware')

const alagarrConfig = {
  requestMiddleware: ['default', restoreSession],
  responseMiddleware: ['default', saveSession],
}

module.exports.userDashboardHandler = handler((request, response) => {
    const session = request.session

    if (!session) {
      return response.redirect('/login')
    }

    return `<h1>Welcome back, ${session.username}!</h1>`
  }
  alagarrConfig,
)
```

## Contributing

The codebase _tries_ to follow declarative, functional(ish) programming paradigms. Many functional styles are enforced through TSLint linter utilised by the project. These include immutablity rules (`no-let`, `no-object-mutation`) and rules which prohibit imperative code (`no-expression-statement`, `no-loop-statement`). Disabling the linter for code should be avoided. Exceptions are made where satisfying a linting rule is impractical or otherwise untenable. In practice, this tends to be areas where the code touches 3rd party modules and in tests due to Jest's imperative-style.

## Similar Projects

* [Middy](https://github.com/middyjs/middy)
* [corgi](https://github.com/balmbees/corgi)
* [node-lambda-req](https://github.com/doomhz/node-lambda-req)
* [apigateway-utils](https://github.com/silvermine/apigateway-utils)
* [serverless-utils](https://github.com/silvermine/serverless-utils)
* [@graphcool/lambda-helpers](https://www.npmjs.com/package/lambda-helpers)

## Related Thingies

* [aws-kms-thingy](https://github.com/adieuadieu/aws-kms-thingy)
* [aws-s3-thingy](https://github.com/adieuadieu/aws-s3-thingy)

## License

**Alagarr** © [Marco Lüthy](https://github.com/adieuadieu). Released under the [MIT](./LICENSE) license.<br>
Authored and maintained by Marco Lüthy with help from [contributors](https://github.com/adieuadieu/alagarr/contributors).

> [github.com/adieuadieu](https://github.com/adieuadieu) · GitHub [@adieuadieu](https://github.com/adieuadieu) · Twitter [@adieuadieu](https://twitter.com/adieuadieu) · Medium [@marco.luethy](https://medium.com/@marco.luethy)
