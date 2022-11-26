const mongoose = require("mongoose");
const DB = process.env.DB;
mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
},

()=>{
    console.log("Connected sucessfully to mango db")
});
module.exports = mongoose;
