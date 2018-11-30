// tslint:disable:no-expression-statement
import setHeader from './setHeader'

describe('setHeader', () => {
  it('should be able to set header', () => {
    const responseData = { headers: {} as any }
    setHeader({} as any, responseData as any, 'x-csrf-token', 'secret')
    expect(responseData.headers['x-csrf-token']).toBe('secret')
  })
})
