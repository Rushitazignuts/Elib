/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const uuid = require("uuid");
// const { beforeCreate } = require("../models/User");

module.exports = {
  // User Signup
  userSignup: async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, msg: "Please in the required field" });
    }
    let user = await User.findOne({ email: email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, msg: "Email already in use" });
    }
    const hash = await bcrypt.hash(password, 10);
    if (!hash) {
      return res
        .status(500)
        .json({ success: false, msg: "Something Went Wrong" });
    }
    user = await User.create({ name: name, email: email, password: hash });
    const subject = "subject";
    const message = "message"
    // await mailer.sendEmailToAllUsers(subject, message)
    await sails.helpers.nodemailer(subject, message)
    return res.status(201).json({ success: true, msg: "User Created" });
  },

  //   User Login
  userLogin: async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, msg: "Please Enter Valid Credential" });
    }
    const matchPass = await bcrypt.compare(password, user.password);
    if (!matchPass) {
      return res
        .status(400)
        .json({ success: false, msg: "Please Enter Valid Credentials" });
    }
    const genToken = await jwt.sign({ id: user.id, role : user.role }, "krupali11", {
      expiresIn: "3d",
    });
    if (!genToken) {
      return res
        .status(500)
        .json({ success: false, msg: "Something Went Wrong" });
    }
    const token = await User.update({ id: user.id }).set({ token: genToken });
    return res.status(200).json({ success: true, token: genToken });
  },

  //   User Logout
  userLogout: async (req, res) => {
    const { id } = req.userData;
    let user = await User.findOne({ id: id });
    if (!user) {
      return res
        .status(500)
        .json({ success: false, msg: "Something Went Wrong" });
    }
    user = await User.update({ id: id }).set({ token: "" });
    return res.status(200).json({ success: true, msg: "User Logout" });
  },
};
