import { InterfaceRequest } from '../../types'

const state = new Map<string, boolean | number>([['invocationCount', 0]])

// Sets some meta data about the request
export default function meta(request: InterfaceRequest): InterfaceRequest {
  const invocationCount = Number(state.get('invocationCount'))

  return {
    ...request,
    meta: {
      ...request.meta,
      coldStart: !invocationCount,
      invocationCount: state
        .set('invocationCount', invocationCount + 1)
        .get('invocationCount'),
    },
  }
}
