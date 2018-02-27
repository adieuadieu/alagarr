// tslint:disable:no-expression-statement
import {
  get as getRequestFixture,
  mockContext,
} from '../test/fixtures/requests'
import parseRequest from './'

const testRequest = {
  ...getRequestFixture,
  body: null,
  headers: {
    Accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-US,en;q=0.8,zh-CN;q=0.6,zh;q=0.4,de;q=0.2',
    'Cache-Control': 'max-age=0',
    Cookie: 'foo=bar; bar=foo',
    Dnt: '1',
    Host: 'test.foobar.com',
    'Upgrade-Insecure-Requests': '1',
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
    'X-Forwarded-For': '192.168.99.1',
    'X-Request-Id': '2b679dc2f44f7ab21a8c473033d52211',
  },
  httpMethod: 'GET',
  path: '/foobar',
  pathParameters: null,
  queryStringParameters: null,
  requestContext: {
    ...getRequestFixture.requestContext,
    accountId: 'offlineContext_accountId',
    apiId: 'offlineContext_apiId',
    httpMethod: 'GET',
    identity: {
      ...getRequestFixture.requestContext.identity,
      accountId: 'offlineContext_accountId',
      apiKey: 'offlineContext_apiKey',
      caller: 'offlineContext_caller',
      cognitoAuthenticationProvider:
        'offlineContext_cognitoAuthenticationProvider',
      cognitoAuthenticationType: 'offlineContext_cognitoAuthenticationType',
      cognitoIdentityId: 'offlineContext_cognitoIdentityId',
      cognitoIdentityPoolId: 'offlineContext_cognitoIdentityPoolId',
      sourceIp: '172.18.0.8',
      user: 'offlineContext_user',
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
      userArn: 'offlineContext_userArn',
    },
    requestId: 'offlineContext_requestId_',
    resourceId: 'offlineContext_resourceId',
    stage: 'dev',

    authorizer: { principalId: 'offlineContext_authorizer_principalId' },
    resourcePath: '/foobar',
  },
  resource: '/foobar',
  stageVariables: null,
}

describe('Request', () => {
  test('request middleware is applied correctly', async () => {
    const { headers, cookies, hostname, body } = await parseRequest(
      testRequest,
      mockContext,
    )

    expect(headers['user-agent']).toBe(testRequest.headers['User-Agent'])
    expect(Object.keys(cookies || {}).length).toBe(2)
    expect(hostname).toBe(testRequest.headers.Host)
    expect(body).toBeNull()
  })
})
