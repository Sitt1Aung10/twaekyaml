export class HttpError extends Error {
  constructor(status, error, message, field) {
    super(message);
    this.status = status;
    this.error = error;
    this.field = field;
  }
}
