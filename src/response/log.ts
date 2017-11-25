import logger from './logger'

// Logs request/response info for CloudWatch/Kibana
export const logResponse = (response, request) => {
  if (process.env.LOGGING) {
    logger(request, response).info()
  }

  return { ...response }
}
