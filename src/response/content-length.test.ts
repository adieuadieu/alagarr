// tslint:disable:no-expression-statement
import contentLengthHeader from './content-length'

const testTextBody = 'foobar'

describe('Response content-length header', () => {
  test('is set correctly', () => {
    const { headers } = contentLengthHeader({
      body: testTextBody,
      headers: {
        'content-type': 'text/plain',
      },
      statusCode: 200,
    })

    expect(headers['content-length']).toBe(testTextBody.length)
  })
})
