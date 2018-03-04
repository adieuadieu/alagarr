// There's no choice. :-(
// tslint:disable:no-class no-expression-statement no-this no-object-mutation

export default class ServerError extends Error {
  public readonly name: string = 'ServerError'
  public readonly statusCode: number = 500

  constructor(message?: string, name?: string, statusCode = 500) {
    super(String(message))

    this.name = name || this.name
    this.statusCode = statusCode
  }
}
