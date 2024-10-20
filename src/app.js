const express = require("express");

const app = express();

app.use((req, res) => {
  res.send("Hello from the serer");
});
app.listen(3000, () => console.log("server Connected"));
