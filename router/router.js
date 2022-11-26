const express = require("express");
const USER = require("../userSchema/userSchema");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/Auth");
require("../db/conn");

// for getting all the user
router.get("/", async (req, res) => {
  const AllUser = await USER.find();
  res.send(AllUser);
});

// for posting the data
router.post("/addUser", async (req, res) => {
  const { name, email, password, Cpassword, phone } = req.body;
  //   if anything is missing
  if (!name || !email || !password || !Cpassword || !phone) {
    res.status(400).send({ err: "Please Fill All The Data" });
  }
  const aUser = await USER.find({ email: email });
  if (aUser.length > 0) {
    res.status(400).send({ err: "User Already Exist" });
  } else if (password != Cpassword) {
    res.status(400).send({ err: "password Dont match" });
  } else {
    //   if user already exist
    const salt = await bcrypt.genSalt(10);
    const hassPassword = await bcrypt.hash(password, salt);
    const addUser = new USER({
      name: name,
      email: email,
      password: hassPassword,
      Cpassword: hassPassword,
      phone: phone,
    });
    await addUser.save();
    res.send(addUser);
  }
});

// for login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await USER.find({ email: email });
  console.log("user",user)
  if (user.length > 0) {
    const verifypassword = await bcrypt.compare(
      req.body.password,
      user[0].password
    );
    if (verifypassword) {
      const token = jwt.sign({ _id: user[0]._id }, process.env.SECRETKEY, {
        expiresIn: "1hr",
      });
      res.send({ user, token });
    } else {
      res.status(400).send({ err: "Invalid Credential" });
    }
  }
});

// for edit
router.put("/edit/:id", async (req, res) => {
  const { name, email, password, Cpassword, phone } = req.body;
  if (!name || !email || !password || !Cpassword || !phone) {
    res.status(400).send({ err: "please fill all the data" });
  } else {
    try {
      const { id } = req.params;
      const editDATA = await USER.findByIdAndUpdate(id, req.body, {
        new: true,
        validators: true,
        upsert: true,
      });
      res.send({ mess: "edited Sucessfully" });
    } catch (error) {
      console.log(error);
    }
  }
});

// for delete
router.delete("/dlt/:id", async (req, res) => {
  const { id } = req.params;
  const dltUser = await USER.findByIdAndDelete(id);
  res.send({ mess: "DELETED SUCESSFULLY" });
});

module.exports = router;
