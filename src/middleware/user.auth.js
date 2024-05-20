var jwt = require("jsonwebtoken");
const { User, Admin, Delivery_Boy } = require("../models");
const Response = require("../services/Response");

var checkUserAuth = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token) {
      return Response.errorResponseWithoutData(
        res,
        "Unauthorized access"
      );
    }

    token = token.split(" ")[1]; // Split the token from the "Bearer " prefix

    await jwt.verify(token, process.env.SECRET, async function (err, decoded) {
      if (err) {
        console.log("tokennotverifiedinvalidateuser", err);
        return res.status(401).json({ error: "Unauthorized access" });
      } else {
        req.user = await User.findOne({
          where: { id: decoded.id },
          attributes: ["id", "email", "password", "role_id"],
        });
        next();
      }
    });
  } catch (error) {
    console.log("errorinmiddleware", error);
  }
};

var checkDeliveryUserAuth = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) {
      return Response.errorResponseWithoutData(
        res,
        "Unauthorized access",
      );
    }
    token = token.split(" ")[1];
    await jwt.verify(
      token,
      process.env.SECRET,
      async function (err, decoded) {
        if (err) {
          console.log("tokennotverifiedinvalidateuser", err);
          return res.status(401).json({ error: "Unauthorized access" });
        } else {
          req.user = await Delivery_Boy.findOne({
            where: { id: decoded.id },
            attributes: ["id", "email", "password"],
          });
          next();
        }
      }
    );
  } catch (error) {
    console.log("errorinmiddleware", error);
  }
  
  //const { token }  = req.cookies;
  // const { token } = req.header("Authorization");
  // //console.log(token)
  // if (!token) {
  //   res
  //     .status(401)
  //     .send({ status: " FAILED ", message: "UNAUTHORIZED USER, NO TOKEN" });
  // } else {
  //   const decodedData = jwt.verify(token, process.env.SECRET);
  //   //console.log(decodedData)
  //   req.user = await User.findOne({
  //     where: { id: decodedData.id },
  //     attributes: ["id", "email", "password", "role_id"],
  //   });
  //   //console.log(req.user.id)
  //   next();
  // }
};

var checkAdminAuth = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) {
      return Response.errorResponseWithoutData(
        res,
        "Unauthorized access",
      );
    }
    token = token.split(" ")[1];
    await jwt.verify(
      token,
      process.env.SECRET,
      async function (err, decoded) {
        if (err) {
          console.log("tokennotverifiedinvalidateuser", err);
          return res.status(401).json({ error: "Unauthorized access" });
        } else {
          req.admin = await Admin.findOne({
            where: { id: decoded.id },
            attributes: ["id", "email", "password", "role_id"],
          });
          next();
        }
      }
    );
  } catch (error) {
    console.log("errorinmiddleware", error);
  }
  //const { token }  = req.cookies;
  // const { token } = req.cookies;
  // //console.log(token)
  // if (!token) {
  //   res
  //     .status(401)
  //     .send({ status: " FAILED ", message: "UNAUTHORIZED USER, NO TOKEN" });
  // } else {
  //   const decodedData = jwt.verify(token, process.env.SECRET);
  //   //console.log(decodedData)
  //   req.admin = await Admin.findOne({
  //     where: { id: decodedData.id },
  //     attributes: ["id", "email", "password", "role_id"],
  //   });
  //   //console.log(req.user.id)
  //   next();
  // }
};

var authorizeRoles = (roles) => {
  return (req, res, next) => {
    //console.log(req.user.role)
    if (!roles.includes(req.user.role)) {
      return res
        .status(401)
        .send({
          status: " FAILED ",
          message: " YOU ARE NOT ALLOWED TO ACCESS THIS RESOURCE ",
        });
    }
    next();
  };
};

module.exports = {
  checkUserAuth,
  checkAdminAuth,
  checkDeliveryUserAuth,
  authorizeRoles,
};
