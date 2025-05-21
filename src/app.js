import express from "express";
import bcrypt from "bcrypt";
import { adminAuth, userAuth } from "./Middlewares/Auth.js";
import connectDb from "./config/database.js";
import User from "./Models/user.js";
import { Error } from "mongoose";
import validationSignUp from "./utils/validation.js";
import cookieParser from "cookie-parser";
import  jwt  from "jsonwebtoken";
const app = express();
app.use(express.json());
app.use(cookieParser);

// Find User By EmailID

app.get("/user", async (req, res) => {
  const userEmailID = req.body.emailId;

  try {
    const user = await User.find({ emailId: userEmailID });
    if (user.length === 0) {
      res.status(404).send("user not found");
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(404).send("something Wnrt wrong" + error.message);
  }
});

//get all user in feed

app.get("/feed", async (req, res) => {
  try {
    const allUser = await User.find({}).exec();
    if (allUser.length === 0) {
      res.status(404).send("You have no friends connected");
    } else {
      res.send(allUser);
    }
  } catch (error) {
    res.status(404).send("something went wrong" + error);
  }
});

//-------Delete the user

app.delete("/user", async (req, res) => {
  const userId = req.body.userID;
  try {
    const user = await User.findByIdAndDelete(userId);
    if (user !== userId) {
      res.status(404).send("user not found");
    } else {
      res.send("user deleted successfully");
    }
  } catch (error) {
    res.status("something went wrong");
  }
});
//---------update data of user

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    // Update the user

    const Allowed_Updates = ["skills", "gender", "age"];

    // Validate the update fields
    const isUpdateAllowed = Object.keys(data).every((key) =>
      Allowed_Updates.includes(key)
    );

    if (!isUpdateAllowed) {
      return res.status(400).send("Invalid update fields detected");
    }
    if (data?.skills.length > 50) {
      throw new Error("Skill can't be more then 10");
    }
    const updatedUser = await User.findByIdAndUpdate(userId, data, {
      new: true, // Returns the updated document
      runValidators: true, // Ensures schema validators are applied
    });

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    res.send({ message: "Data updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).send("Something went wrong: " + error.message);
  }
});
//-----------------------Sign Up -----------------------------------------------

app.post("/signup", async (req, res) => {
  const { firstName, lastName, password, emailId, gender, skills } = req.body;

  try {
    const existing = await User.findOne({ emailId });
    if (existing) {
      return res.status(400).send("User already exists with this email ID");
    }
    validationSignUp(req);
    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
      gender,
      skills,
    });

    await user.save();
    console.log(user);
    res.send("data uploaded successfully");
  } catch (err) {
    {
      res.status(400).send("Error in saving data" + err.message);
    }
  }
});

//-------------------------------> Login Page  -----------------------------------
app.get("/signin", async(req, res) => {
  const { emailId, password } = req.body;

  try {
    // Check if both email and password are provided
    if (!emailId || !password) {
      return res
        .status(400)
        .send({ message: "Email and password are required" });
    }

    // Find the user by email
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      return res.status(403).send({ message: "Invalid email or password" });
    }

    // Compare passwords
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return res.status(403).send({ message: "Invalid email or password" });
    }

    // creating a JWT
    const token =  jwt.sign({ _id: user._id }, "devTinder@119");
    res.cookie("token", token); 
    res.status(200).send({ message: "Login Successful" });
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

connectDb()
  .then(() => {
    console.log("connection established");
    app.listen(3000, () => console.log("Server connected on port 3000"));
    console.log("server started");
  })
  .catch((err) => {
    console.log("connection error");
  });
