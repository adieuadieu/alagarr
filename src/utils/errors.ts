// There's no choice. :-(
// tslint:disable:no-class no-expression-statement no-this no-object-mutation

export class ClientError extends Error {
  public readonly name: string = 'ClientError'

  constructor(message, name, stack) {
    super(String(message))
  }
}

export class ServerError extends Error {
  public readonly name: string = 'ServerError'

  constructor(message, name, stack) {
    super(String(message))
  }
}
