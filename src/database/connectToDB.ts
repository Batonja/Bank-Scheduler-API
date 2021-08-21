import mongoose from "mongoose";
import config from "../../config.json";

async function connectToDB() {
  try {
    const connectionPath: string = config.connectionString;

    const connection = await mongoose.connect(connectionPath, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`Connected to the database: ${connection.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
export default connectToDB;
