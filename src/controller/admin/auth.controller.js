const { Admin,Otp } = require("../../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
let {sendMail} =require("../../utils/helper");
const utils = require("../../utils/helper");
const crypto = require('crypto');
const { Op } = require("sequelize");
const { ACTIVE, BLOCKED, CREDENTIAL,FORGOT_PASSWORD } = require("../../utils/constants");

exports.getLogin = async (req, res, next) => {
  try {
    const { message, error, formValue } = req.query;
    return res.render("admin/auth/login.ejs", { message, error, formValue });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const admin = await Admin.findOne({
      where: { email: req.body.email.trim()},
    });
    if (!admin) {
      throw new Error("Invalid user name.");
    }
    let result = await bcrypt.compare(req.body.password, admin.password);
    if (result) {
      let token = jwt.sign(
        { id: admin.id, email: admin.email, role_id: admin.role_id },
        process.env.SECRET,
        { expiresIn: "365d" }
      );
      console.log("token", token);
      await Admin.update(
        { token: token },
        { where: { id: admin.id } }
      );
      res.cookie("dd-token", token, { maxAge: 1000 * 60 * 60 * 24 * 365 });
      // res.clearCookie("dd-user");
      return res.redirect("/admin/dashboard");
      // switch (admin.role_id) {
      //   case 0:
      //     return res.redirect("/admin/list");
      //   case 1:
      //     return res.redirect("/admin/dashboard");
      //   default:
      //     return res.redirect("/admin/login");
      // }
    } else {
      throw new Error("Invalid password.");
    }
  } catch (err) {
    next(err);
  }
};

exports.logOut = async (req, res, next) => {
  try {
    const { error, message, formValue } = req.query;
    res.clearCookie("dd-token");
    req.success = "Successfully LogOut.";
    // return res.redirect("/admin/login")
    next("last");
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { message, error, formValue, isLoggedIn } = req.query;
    return res.render("admin/auth/forget_password", {
      message,
      error,
      formValue,
      isLoggedIn
    });
  } catch (err) {
    next(err);
  }
};

exports.userForgotPassword = async (req, res, next) => {
  try {
    const admin = await Admin.findOne({
      where: { email: req.body.email.trim() },
    });
    console.log("admin--------", admin);
    if (admin) {
      const random_number = (
        Math.floor(Math.random() * 1000000 + 1) + 100000
      ).toString();
      const data = {
        user_id: admin.id,
        otp: random_number,
        type: FORGOT_PASSWORD,
        status: false,
      };
      await Otp.create(data);
      await utils.sendMail(admin, FORGOT_PASSWORD, random_number);
      req.flash("success", "successfully send otp on mail.");
      return res.redirect("/admin/reset-password");
    } else {
      throw new Error("Email does not exist..");
    }
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { error, message, formValue, isLoggedIn } = req.query;
    return res.render("admin/auth/reset_password", {
      error,
      message,
      formValue,
      isLoggedIn
    });
  } catch (err) {
    next(err);
  }
};

exports.userResetPassword = async (req, res, next) => {
  try {
    const { error, message, formValue, isLoggedIn } = req.query;
    console.log("req.body---------", req.body);
    if (req.body.new_password !== req.body.confirm_password) {
      throw new Error("New password and confirm password does not match.");
    }
    let otp = await Otp.findOne({
      otp: req.body.otp,
      type: FORGOT_PASSWORD,
      status: false,
    });
    if (otp) {
      let salt = await bcrypt.genSalt(10);
      let hash = await bcrypt.hash(req.body.new_password, salt);
      await Admin.update({ password: hash }, { where: { id: otp.user_id } });
      otp.status = true;
      await otp.save();
      req.success = "Password update successfully.";
      next("last");
    } else {
      throw new Error("Invalid otp.");
    }
  } catch (err) {
    next(err);
  }
};