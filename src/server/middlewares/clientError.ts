class ClientError extends Error {
  errorCode: number;
  httpStatusCode: number;
  constructor(message: string, httpStatusCode = 400, errorCode = -1) {
    super(message);
    this.name = "ClientError";
    this.errorCode = errorCode;
    if (
      Number.isInteger(httpStatusCode) &&
      httpStatusCode >= 400 &&
      httpStatusCode < 500
    ) {
      this.httpStatusCode = httpStatusCode;
    } else {
      this.httpStatusCode = 400;
    }
  }
}

export { ClientError };
