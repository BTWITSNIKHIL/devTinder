import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://nikhilkumawat24120:7bDR4qhu2Qokuoru@cluster0.7wx1o.mongodb.net/"
    );
    console.log("Database connection established");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1); // Exit the process if the connection fails
  }
};

export default connectDb;
