// There's no choice. :-(
// tslint:disable:no-class no-expression-statement no-this no-object-mutation

export default class ClientError extends Error {
  public readonly name: string = 'ClientError'
  public readonly statusCode: number = 400

  constructor(message?: string, name?: string, statusCode = 400) {
    super(String(message))

    this.name = name || this.name
    this.statusCode = statusCode
  }
}
