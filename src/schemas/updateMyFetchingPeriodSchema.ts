import { Schema } from "jsonschema";

const schema: Schema = {
  type: "object",
  properties: {
    username: { type: "string", required: true },
    password: { type: "string", required: true },
    fetchingPeriondInHours: { type: "number", minimum: 0, required: true },
  },
};
export default schema;
