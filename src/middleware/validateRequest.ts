import { validate, ValidatorResult } from "jsonschema";
import BasicError from "../errors/BasicError";

function validateRequest(schema: any, objectName: string = "body") {
  return (req: any, res: any, next: any) => {
    if (!req[objectName]) {
      throw new BasicError("Missing parameters", 400);
    }

    const validationResponse: ValidatorResult = validate(
      req[objectName],
      schema
    );

    if (validationResponse.valid) return next();

    let message: string = "";

    for (const error of validationResponse.errors) {
      const instancePlusDot = "instance.";

      const property = error.property.slice(
        instancePlusDot.length,
        error.property.length
      );

      message += property.concat(error.message).concat("\n");
    }

    throw new BasicError(message, 400);
  };
}
export default validateRequest;
