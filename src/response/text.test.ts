// tslint:disable:no-expression-statement
import text from './text'

const testBody = 'text'

it('create response object with text/plain content type', async () => {
  const response = text({} as any, {} as any, testBody)
  expect(response.body).toEqual(testBody)
  expect(response.headers['content-type']).toEqual('text/plain')
})
