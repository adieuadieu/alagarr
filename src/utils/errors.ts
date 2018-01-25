// There's no choice. :-(
// tslint:disable:no-class no-expression-statement no-this no-object-mutation

export class ClientError extends Error {
  public readonly name: string = 'ClientError'
  statusCode: number = 400

  constructor(message?: string, name?: string, statusCode = 400, stack?) {
    super(String(message))

    if (name) {
      this.name = name
    }

    this.statusCode = statusCode
  }
}

export class ServerError extends Error {
  public readonly name: string = 'ServerError'
  statusCode: number = 500

  constructor(message?: string, name?: string, statusCode = 500, stack?) {
    super(String(message))

    if (name) {
      this.name = name
    }

    this.statusCode = statusCode
  }
}
