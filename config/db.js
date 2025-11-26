import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectionMongoDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO);
    console.log("conexion a mongo exitosa");
  } catch (error) {
    console.log(`EROOR: ${error.message}`);
    process.exit(1);
  }
};

export default connectionMongoDB;
