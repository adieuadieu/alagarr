import parseRequest, {
  normalizeHeaders,
  parseCookies,
  parseJsonBody,
  setHostname,
} from './apiGatewayRequest'

const testEventFixture = {
  headers: {
    Host: 'test.foobar.com',
    'X-Forwarded-For': '192.168.99.1',
    'X-Request-Id': '2b679dc2f44f7ab21a8c473033d52211',
    'Cache-Control': 'max-age=0',
    'Upgrade-Insecure-Requests': '1',
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    Dnt: '1',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-US,en;q=0.8,zh-CN;q=0.6,zh;q=0.4,de;q=0.2',
    Cookie: 'foo=bar; bar=foo',
  },
  path: '/foobar',
  pathParameters: null,
  requestContext: {
    accountId: 'offlineContext_accountId',
    resourceId: 'offlineContext_resourceId',
    apiId: 'offlineContext_apiId',
    stage: 'dev',
    requestId: 'offlineContext_requestId_',
    identity: {
      cognitoIdentityPoolId: 'offlineContext_cognitoIdentityPoolId',
      accountId: 'offlineContext_accountId',
      cognitoIdentityId: 'offlineContext_cognitoIdentityId',
      caller: 'offlineContext_caller',
      apiKey: 'offlineContext_apiKey',
      sourceIp: '172.18.0.8',
      cognitoAuthenticationType: 'offlineContext_cognitoAuthenticationType',
      cognitoAuthenticationProvider: 'offlineContext_cognitoAuthenticationProvider',
      userArn: 'offlineContext_userArn',
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
      user: 'offlineContext_user',
    },
    authorizer: { principalId: 'offlineContext_authorizer_principalId' },
    resourcePath: '/foobar',
    httpMethod: 'GET',
  },
  resource: '/foobar',
  httpMethod: 'GET',
  queryStringParameters: null,
  body: null,
  stageVariables: null,
  isOffline: true,
}

it('headers are normalized', () => {
  const normalized = normalizeHeaders({
    foo: 'bar',
    headers: { 'X-Foo-Bar': 'foobar' },
  })
  const expected = { foo: 'bar', headers: { 'x-foo-bar': 'foobar' } }

  expect(normalized).toEqual(expected)
})

it('cookies are parsed', () => {
  const testEvent = {
    foo: 'bar',
    headers: {
      cookie: 'PHPSESSID=e61d68c319d12269c6af8cd939298857; REMEMBERME=yah; locale=de_DE',
    },
  }
  const expected = {
    ...testEvent,
    cookies: {
      PHPSESSID: 'e61d68c319d12269c6af8cd939298857',
      REMEMBERME: 'yah',
      locale: 'de_DE',
    },
  }

  const request = parseCookies(testEvent)

  expect(request).toEqual(expected)
})

it('hostname is set', () => {
  const testEvent = {
    foo: 'bar',
    headers: {
      host: 'foobar.foo.bar',
    },
  }
  const expected = {
    ...testEvent,
    hostname: 'foobar.foo.bar',
  }

  const request = setHostname(testEvent)

  expect(request).toEqual(expected)
})

it('parse JSON body only if content-type application/json', () => {
  const testEvent = {
    headers: {
      'content-length': 14,
      'content-type': 'application/json',
    },
    body: '{"foo": "bar"}',
  }
  const expected = {
    ...testEvent,
    body: {
      foo: 'bar',
    },
  }

  const jsonRequest = parseJsonBody(testEvent)
  expect(jsonRequest).toEqual(expected)

  testEvent.body = 'foobar'
  delete testEvent.headers['content-type']
  const nonJsonRequest = parseJsonBody(testEvent)
  expect(nonJsonRequest).toEqual(testEvent)
})

it('correctly handle shitty JSON', () => {
  const testEvent = {
    headers: {
      'content-length': 1,
      'content-type': 'application/json',
    },
    body: '{"huurr hurr:" derp. can\'t parse this on purpose}',
  }
  const expected = {
    ...testEvent,
    body: {},
  }

  const request = parseJsonBody(testEvent)
  expect(request).toEqual(expected)
})

it('request middleware is applied correctly', () => {
  const {
    headers, cookies, hostname, body,
  } = parseRequest(testEventFixture)

  expect(headers['user-agent']).toBe(testEventFixture.headers['User-Agent'])
  expect(Object.keys(cookies).length).toBe(2)
  expect(hostname).toBe(testEventFixture.headers.Host)
  expect(body).toBeNull()
})

it('Base64 encoded body is correctly decoded when isBase64Encoded is true', () => {
  const testBody = 'foobar test body'
  const testBodyBuffer = Buffer.from(testBody, 'utf8')
  const { body } = parseRequest({
    ...testEventFixture,
    body: testBodyBuffer.toString('base64'),
    isBase64Encoded: true,
  })

  expect(body).toBe(testBody)
})
