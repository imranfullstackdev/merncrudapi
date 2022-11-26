const express = require("express");
const app = express();
const cors = require('cors');
app.use(cors())
app.use(express.json());
require('dotenv').config()
app.use("/", require("./router/router"));

app.listen(8000, () => {
  console.log("port is listening at 8000");
});
