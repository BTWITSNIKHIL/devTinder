import express from "express";
import { adminAuth, userAuth } from "./Middlewares/Auth.js";
import connectDb from "./config/database.js";
import User from "./Models/user.js";
import { Error } from "mongoose";
const app = express();
app.use(express.json());

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

app.post("/signUp", async (req, res) => {
  const { emailId } = req.body;

  try {
    const existing = await User.findOne({ emailId });
    if (existing) {
      return res.status(400).send("User already exists with this email ID");
    }
    const user = new User(req.body);

    await user.save();
    console.log(user);
    res.send("data uploaded successfully");
  } catch (err) {
    {
      res.status(400).send("Error in saving data" + err.message);
    }
  }
});
connectDb()
  .then(() => {
    console.log("connection established");
    app.listen(3000, () => console.log("Server connected on port 3000"));
  })
  .catch((err) => {
    console.log("connection error");
  });
