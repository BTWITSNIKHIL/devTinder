const express = require("express");

const app = express();

app.get( "/user",(req, res) => {
  res.send({Name :"Nikhil",age :"20"});
});
app.listen(3000, () => console.log("server Connected"));
