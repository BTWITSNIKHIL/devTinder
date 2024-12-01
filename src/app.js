import express from "express";
import { adminAuth, userAuth } from "./Middlewares/Auth.js";

const app = express();

app.get("/admin/allData", adminAuth, (req, res) => {
  res.send("response successfully");
});

// app.post("/User", userAuth, (req, res, next) => {
//   res.send("User deleted successfully.");
// });

app.get("/User", userAuth, (req, res, next) => {
  res.send("User logged in successfully.");
  console.log("logged in successfully");
});
app.listen(3000, () => console.log("Server connected on port 3000"));
