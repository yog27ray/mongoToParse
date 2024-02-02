declare interface MongoToParseErrorType {
  message: string;
  code: number;
  type: string;
  logMessage?: string;
  skipSentry?: boolean;
  params?: { [key: string]: unknown };
}

class MongoToParseError extends Error {
  readonly skipSentry: boolean;

  readonly code: number;

  private readonly type: string;

  private readonly logMessage: string;

  private readonly params: { [key: string]: unknown };

  constructor(error: MongoToParseErrorType) {
    super(error.message);
    Object.setPrototypeOf(this, MongoToParseError.prototype);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MongoToParseError);
    }
    this.name = error.type;
    this.code = error.code;
    this.type = error.type;
    this.params = error.params;
    this.logMessage = error.logMessage;
    this.skipSentry = error.skipSentry;
  }

  toJSON(): { [key: string]: unknown } {
    const jsonObj: { [key: string]: unknown } = { code: this.code, type: this.type, message: this.message };
    ['logMessage', 'skipSentry', 'params'].forEach((key: string) => {
      if (!this[key]) {
        return;
      }
      jsonObj[key] = this[key];
    });
    return jsonObj;
  }
}

export { MongoToParseError };
