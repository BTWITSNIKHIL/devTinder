import mongoose from "mongoose";

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://nikhilkumawat24120:7bDR4qhu2Qokuoru@cluster0.7wx1o.mongodb.net/"
  );
};
export default connectDb;
