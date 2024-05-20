const { User, Admin } = require("../../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { sendMail } = require("../../utils/helper");
const utils = require("../../utils/helper");
const crypto = require("crypto");
const { Op } = require("sequelize");
const {
  ACTIVE,
  BLOCKED,
  CREDENTIAL,
  FORGOT_PASSWORD,
} = require("../../utils/constants");
const Response = require("../../utils/response");
const Joi = require("joi");

exports.signup = async (req, res, next) => {
  try {
    const reqParam = req.body;
    // Validate request parameters
    console.log("reqParam", reqParam);
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      contact_number: Joi.string().required(),
    });
    const { error } = schema.validate(reqParam);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(`${error.details[0].message}`)
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      where: { email: req.body.email.trim() },
    });
    if (existingUser) {
      return Response.errorResponseWithoutData(
        res,
        res.locals.__("User with this email already exists")
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    let img_url;
    if (req.file) {
      img_url = req.file.filename;
    }
    // Create a new user
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email.trim(),
      password: hashedPassword,
      contact_number: req.body.contact_number,
      img_url: img_url || "",
    });

    // Generate a token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.SECRET,
      { expiresIn: "365d" }
    );

    // Update the user with the generated token
    await User.update({ token: token }, { where: { id: newUser.id } });

    return Response.successResponseData(
      res,
      newUser,
      res.locals.__("User registered successfully")
    );
  } catch (err) {
    return Response.errorResponseWithoutData(
      res,
      res.locals.__("An error occurred during registration")
    );
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(401)
        .json({ status: "failed", message: "All fields are required 😃🍻" });
    }

    const user = await User.findOne({ where: {email:email} });

    if (!user) {
      return res.status(401).json({
        status: "failed",
        message: "YOU ARE NOT A REGISTERED USER 😃",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign(
        { id: user.id, email: user.email, role_id: user.role_id },
        process.env.SECRET,
        { expiresIn: "365d" }
      );

      return res.status(200).json({
        status: "success",
        message: "LOGIN SUCCESSFULLY WITH WEB TOKEN 😃🍻",
        Authorization: `${token}`,
        user,
      });
    } else {
      return res.status(401).json({
        status: "failed",
        message: "EMAIL AND PASSWORD DOES NOT MATCH 😓🍻",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (email && password) {
      const admin = await Admin.findOne({ email: email });
      console.log(admin);
      if (admin != null) {
        const isMatch = await bcrypt.compare(password, admin.password);
        if (admin.email === email && isMatch) {
          let token = jwt.sign(
            { id: admin.id, email: admin.email, role_id: admin.role_id },
            process.env.SECRET,
            { expiresIn: "365d" }
          );
          res.cookie("token", token);
          console.log("token----------------------", token);
          res.status(200).json({
            status: "success",
            message: "LOGIN SUCCESSFULLY WITH WEB TOKEN 😃🍻",
            Token: token,
            admin,
          });
        } else {
          res.status(401).json({
            status: "failed",
            message: "EMAIL AND PASSWORD DOES NOT MATCH  😓🍻",
          });
        }
      } else {
        res.status(401).json({
          status: "failed",
          message: "YOU ARE NOT A REGISTERED USER 😃",
        });
      }
    } else {
      res
        .status(401)
        .json({ status: "failed", message: "all feilds are required 😃🍻" });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    res.status(200).json({ success: true, message: "LOGGED OUT SUCCESSFULLY" });
  } catch (err) {
    console.log(error);
  }

  // try {
  //   const reqParam = req.body;
  //   // Validate request parameters
  //   console.log("reqParam",reqParam);
  //   const schema = Joi.object({
  //     email: Joi.string().email().required(),
  //     password: Joi.string().required()
  //   });
  //   const { error } = schema.validate(reqParam);
  //   if (error) {
  //     return Response.validationErrorResponseData(
  //       res,
  //       res.__(`${error.details[0].message}`)
  //     );
  //   }
  //   const user = await User.findOne({
  //     where: { email: req.body.email.trim() },
  //   });
  //   console.log("user----------",user);
  //   if (!user) {
  //     return Response.errorResponseWithoutData(
  //       res,
  //       res.locals.__("User Credentials doesn't Exist")
  //     );
  //   }
  //   let result = await bcrypt.compare(req.body.password, user.password);
  //   if (result) {
  //     let token = jwt.sign(
  //       { id: user.id, email: user.email },
  //       process.env.SECRET,
  //       { expiresIn: "365d" }
  //     );
  //     console.log("token", token);
  //     await User.update({ token: token }, { where: { id: user.id } });
  //     res.cookie("dd-token", token, { maxAge: 1000 * 60 * 60 * 24 * 365 });
  //     res.clearCookie("dd-user");
  //     return Response.successResponseData(
  //       res,
  //       user,
  //       res.locals.__("Logged In Successfully")
  //     );
  //   } else {
  //     res.status(401).json({
  //       status: "failed",
  //       message: "EMAIL AND PASSWORD DOES NOT MATCH",
  //     });
  //   }
  // } catch (err) {
  //   return Response.errorResponseWithoutData(
  //     res,
  //     res.locals.__("An error occurred during login")
  //   );
  // }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email, contact_number, img_url } = req.body;
    const userToUpdate = await User.findByPk(req.user.id);

    if (!userToUpdate) {
      return res.status(404).json({ message: "User not found" });
    }
    if (req.file) {
      console.log("req.file--------", req.file);
      userToUpdate.img_url = req.file.filename;
    }
    console.log("userToUpdate--------", userToUpdate);
    userToUpdate.name = name;
    userToUpdate.email = email;
    userToUpdate.contact_number = contact_number;
    console.log("userToUpdate--------", userToUpdate.name);
    await userToUpdate.save();
    return res.status(200).json({
      message: "PROFILE UPDATED SUCCESSFULLY",
      user: {
        id: userToUpdate.id,
        name: userToUpdate.name,
        email: userToUpdate.email,
        contact_number: userToUpdate.contact_number,
        img_url: userToUpdate.img_url,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error updating profile" });
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (oldPassword && newPassword && confirmPassword) {
      const user = await User.findByPk(req.user.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "OLD PASSWORD IS INCORRECT" });
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "PASSWORD DOES NOT MATCH" });
      }

      const newHashPassword = await bcrypt.hash(newPassword, 10);
      user.password = newHashPassword;
      await user.save();

      return res.status(200).json({ message: "PASSWORD CHANGED SUCCESSFULLY" });
    } else {
      return res.status(400).json({ message: "All Fields are Required" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error updating password" });
  }
};

exports.forgetPassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error updating password" });
  }
};

exports.getUserDetail = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
      attributes: ["id", "name", "email", "contact_number", "img_url"],
    });
    res
      .status(200)
      .json({ success: true, status: "sucess", message: "SUCCESSFULLY", user });
  } catch (err) {
    next(err);
  }
};

exports.getAllUserData = async (req, res, next) => {
  try {
    const user = await User.findAll();
    if (!user) {
      return res.status((500).json({ success: false, message: "FAILED" }));
    }
    res.status(200).json({ success: true, message: "SUCCESSFULLY", user });
  } catch (error) {
    next(err);
  }
};
