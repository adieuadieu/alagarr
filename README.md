![](docs/title-logo.png)

Alagarr is an **A**WS **L**ambda/**A**PI **Ga**teway **R**equest-**R**esponse helper utility. It
abstracts the Lambda-handler event-context-callback function signature so that you can spend less
time writing boring Lambda/API Gateway-related boilerplate.

Alagarr is a higher-order function which abstracts the the programming models of various serverless-cloud providers and adds a standardized request-response model extensible through composable middleware functions.

Alagarr has zero non-development dependencies. The codebase and middleware follow declarative, functional programming paradigms. Fun fact: you won't find any `if` statements in the codebase.

^ rewrite this w/o using fancy pancy words/phrases so it's easier to understand
@TODO

[![CircleCI](https://img.shields.io/circleci/project/github/adieuadieu/alagarr/master.svg?style=flat-square)](https://circleci.com/gh/adieuadieu/alagarr)
[![Coveralls](https://img.shields.io/coveralls/adieuadieu/alagarr/master.svg?style=flat-square)](https://coveralls.io/github/adieuadieu/alagarr)
[![Codacy grade](https://img.shields.io/codacy/grade/cd743cc370104d49a508cc4b7689c1aa.svg?style=flat-square)](https://www.codacy.com/app/adieuadieu/alagarr)
[![David](https://img.shields.io/david/adieuadieu/alagarr.svg?style=flat-square)]()
[![David](https://img.shields.io/david/dev/adieuadieu/alagarr.svg?style=flat-square)]()

Turns this:

```js
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

Into this:

```js
module.exports.myHandler = require('alagarr')(() => ({ foo: 'bar' }))
```

Typescript:

```typescript
FIXTHIS
APIGatewayEvent
APIGatewayEventRequestContext
//github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/aws-lambda/index.d.ts

import handler, { InterfaceRequest, InterfaceResponse } from 'alagarr'

export default handler(
  (request: InterfaceRequest, response: InterfaceResponse) =>
    response.html('<html/>'),
)
```

## Contents

1.  [Features](#features)
1.  [Configuration](#configuration)
    1.  [Options](#configuration-options)
1.  [Custom Middleware](#custom-middleware)
1.  [Request Middleware](#request-middleware)
1.  [Response Middleware](#response-middleware)
1.  [Error Handling](#error-handling)
1.  [Logging](#logging)
1.  [API](#api)
1.  [Contributing](#contributing)
1.  [Similar Projects](#similar-projects)
1.  [Related Thingies](#related-thingies)
1.  [License](#license)

## Features

* catches thrown errors and handles callback(error, {}) correctly
* catches errors and responds with a pretty error.
* request logging
* request cookie parsing
* normalize request headers
* parse json request body
* response csp headers
* response gzipping (deprecate)
* easily respond with images/binary data (some API Gateway setup required..)
* throwable errors like throw ClientError, ServerError which get caught and pretty
  response.json()'d
* support for custom request and response middleware

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

| Option           | Default | Description                                                                                           |
| ---------------- | ------- | ----------------------------------------------------------------------------------------------------- |
| **cspPolicies**  | []      | List of CSP policies to include in the response headers                                               |
| **errorHandler** |         | Provide a custom error handler. See the section on [Error Handling](#error-handling) for more details |
| **headers**      | {}      | Headers to include in every response                                                                  |
| **logger**       |         | Logger to use to log requests. If undefined, Alagarr will use an internal logger.                     |

@TODO these:

```typescript
interface InterfaceAlagarrOptions {
  readonly cspPolicies?: any // lazy
  readonly enableCompression?: boolean
  readonly enableContentLength?: boolean
  readonly enableCspHeaders?: boolean
  readonly enableLogger?: boolean
  readonly enableEnforcedHeaders?: boolean
  readonly enableETagHeader?: boolean
  readonly enableStrictTransportSecurity?: boolean
  readonly errorHandler?: ErrorHandler
  readonly logger?: Logger
  readonly headers?: object
  readonly requestMiddleware?: any // lazy
  readonly responseMiddleware?: any // lazy
}
```

## Request Middleware

## Response Middleware

## Custom Middleware

Sure thing. Go for it.

## Error Handling

Throw em. Alagarr will catch them.

## Logging

## API

**Request methods**

* [`something(url: string)`](#api-something)

**Response methods**

* [`respondTo()`](#api-response-respondTo)
* [`json()`](#api-response-json)
* [`html()`](#api-response-html)
* [`svg()`](#api-response-svg)
* [`png()`](#api-response-png)
* [`jpeg()`](#api-response-jpeg)
* [`raw()`](#api-response-raw)

---

<a name="api-response-respondTo" />

### respondTo(formats, statusCode = 200, options = {}): void

Respond according to request's Accept header with formats provided in `formats` map. Kind of like a Ruby on Rails `respond_to do |format|` [block](http://api.rubyonrails.org/classes/ActionController/MimeResponds.html#method-i-respond_to).

```js
response.respondTo({
  json: {},
  html: '<html />',
})
```

---

<a name="api-response-raw" />

### raw(error: Error | null, result?: object | boolean | number | string): void

Exposes the underlying `callback` method.

```js
response.raw(null, { something: 'custom' })
```

## Contributing

The codebase _tries_ to follow declarative, functional(ish) programming paradigms. Many functional styles are enforced through TSLint linter utilised by the project. These include immutablity rules (`no-let`, `no-object-mutation`) and rules which prohibit imperative code (`no-expression-statement`, `no-loop-statement`). Disabling the linter for code should be avoided at all cost. Don't cheat. Exceptions are made where satisfying a linting rule is impractical or otherwise untenable. In practice, this tends to be areas where the code touches 3rd party modules and in tests due to Jest's imperative-style.

The benefit to following a declarative, functional coding style is that it becomes much easier to write readable, maintainable, and testable code. As a consequence of immutability (read: having no side-effects), a function will always return the the same value given the same inputs (it is pure in when there is no I/O.). This quality of referential transparency is what makes writing tests simpler. In practice, it results in fewer bugs (and happier devs.)

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
