export class HttpError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message)
    this.name = 'HttpError'
  }
}

export function httpError(statusCode: number, message: string): never {
  throw new HttpError(statusCode, message)
}
