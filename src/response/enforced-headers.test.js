

headers: {
  'strict-transport-security': 'max-age=31536000; includeSubDomains; preload',
}



it('enforced headers are set correctly', () => {
  const response = makeResponse(testRequest, (error, { headers }) => {
    expect(error).toBeNull()
    expect(headers['strict-transport-security']).toBeTruthy()
  })

  response.html('')
})
