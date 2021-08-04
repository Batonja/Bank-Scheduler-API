import InternalErrorTypes from "../common/enums/internalErrorType";

class BasicError extends Error {
  message: string;
  statusCode: number;
  internalStatusCode?: InternalErrorTypes;
  constructor(message: string, statusCode: number = 500) {
    super(message);

    this.message = message;
    this.statusCode = statusCode;
  }
}

export default BasicError;
