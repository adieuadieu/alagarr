it('CSP headers set correctly', () => {
  const response = makeResponse(testRequest, (error, { headers }) => {
    expect(error).toBeNull()
    expect(headers['referrer-policy']).toBeTruthy()
    expect(headers['x-content-type-options']).toBeTruthy()
    expect(headers['x-xss-protection']).toBeTruthy()
    expect(headers['content-security-policy']).toBeTruthy()
    expect(headers['x-frame-options']).toBeTruthy()
  })

  response.html('')
})
