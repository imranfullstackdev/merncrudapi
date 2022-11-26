const jwt = require("jsonwebtoken");
const USER = require("../userSchema/userSchema");

const Auth = async (req, res, next) => {
  const token = req.headers.autherization;
  console.log(typeof token);
  if (token === "null") {
    res.status(404).send({ err: "token not found" });
  } else {
    console.log(token);
    const verifyjwt = jwt.verify(token, process.env.SECRETKEY);
    console.log("first", verifyjwt);
    const theUser = await USER.find({ id: verifyjwt._id });
    console.log("theUser", theUser);
    req.token = token;
    req.user = theUser;
    res.id = verifyjwt._id;
  }
  next();
};
module.exports = Auth;
