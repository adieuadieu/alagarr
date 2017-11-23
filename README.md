# Alagarr

Alagarr is an **A**WS **L**ambda/**A**PI **Ga**teway **R**equest-**R**esponse
helper utility. It abstracts the Lambda-handler event-context-callback function
signature so that you can spend less time writing boring Lambda/API
Gateway-related boilerplate.

@TODO: add event/request json body parsing.

Turns this:

```js
export default handler(event, context, callback) {
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
import handler from 'alagarr'

export default handler((request, response) => {
  response.json({ foo: 'bar' })
})
```

Typescript:

```ts
APIGatewayEvent
APIGatewayEventRequestContext
//github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/aws-lambda/index.d.ts

import handler from 'alagarr'
import { Request, Response } from 'alagarr/types'

export default handler(async (request: Request, response: Response) => {
  response.html('<html/>')
})
```

Features:

* TODO catches thrown errors and handles callback(error, {}) correctly
* TODO catches errors and responds with a pretty error.
* request logging
* request cookie parsing
* normalize request headers
* parse json request body
* response csp headers
* response gzipping

# API

**Request methods**

* [`something(url: string)`](#api-something)

**Response methods**

* [`accordingly(formats: map)`](#api-response-accordingly)
* [`json(json: object)`](#api-response-json)
* [`html(html: string)`](#api-response-html)
* [`svg(image: buffer | stream | string)`](#api-response-svg)
* [`png(image: buffer | stream | base64-encoded-string)`](#api-response-png)
* [`jpeg(image: buffer | stream | base64-encoded-string)`](#api-response-jpeg)

---

<a name="api-response-accordingly" />

### accordingly(formats: object): Promise\<T>

Respond according to Accepts request header with formats provided in `formats`
map.

```js
response.accordingly({
  json: '{}',
  html: '<html />',
})
```

# Similar Projects

* [corgi](https://github.com/balmbees/corgi)
* [node-lambda-req](https://github.com/doomhz/node-lambda-req)
* [apigateway-utils](https://github.com/silvermine/apigateway-utils)
* [serverless-utils](https://github.com/silvermine/serverless-utils)
* [@graphcool/lambda-helpers](https://www.npmjs.com/package/lambda-helpers)
