// const {
//   Subscription,
//   Organization,
//   Organization_User,
//   Super_Admin_Cashier,
//   Admin_Subscription
// } = require("../../models");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const utils = require("../../utils/helper");
// const { Op } = require("sequelize");
// const { ACTIVE, BLOCKED, CREDENTIAL } = require("../../utils/constants");
// const crypto = require('crypto');
// const moment = require("moment");
// const { log } = require("util");
// // const admin = require(".");
// const {currentDate} = require('../../utils/currentdate.gmt6');
// function generateHexacode() {
//   const randomBytes = crypto.randomBytes(3);
//   return randomBytes.toString('hex').toUpperCase();
// }



// exports.editAdmin = async (req, res, next) => {
//   try {
//     const { error, message, formValue } = req.query;
//     const data = await Super_Admin_Cashier.findOne({
//       where: { id: req.params.id },
//       attributes: ["id", "email", "password"],
//       include: [
//         {
//           model: Organization,
//           attributes: [
//             "id",
//             "business_name",
//             "logo",
//             "theme_color",
//             "instagram_handle",
//             "facebook_handle",
//             "welcome_message",
//           ],
//         },
//       ],
//     });
//     // return res.send(data)
//     // const subscriptionList = await Subscription.findAll();
//     res.render("super_admin/user/admin/edit-admin.ejs", {
//       data: data,
//       error,
//       message,
//       formValue,
//       active:2
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// exports.updateAdmin = async (req, res, next) => {
//   try {
//     const adminId = req.params.id;
//     const {
//       business_name,
//       logo,
//       email,
//       password,
//       theme_color,
//       instagram_handle,
//       facebook_handle,
//       welcome_message,
//     } = req.body;

//     // Check if the admin exists
//     const admin = await Super_Admin_Cashier.findByPk(adminId);
//     console.log("admin------", admin);

//     const existingData = await Super_Admin_Cashier.findOne({
//       where: { id: req.params.id },
//       include: [
//         {
//           model: Organization
//         },
//       ],
//     });

//     // Update Super_Admin_Cashier details
//     if (email) {
//       admin.email = email;
//     }
//     if (password) {
//       const salt = await bcrypt.genSalt(10);
//       const hash = await bcrypt.hash(password, salt);
//       admin.password = hash;
//     }
//     await admin.save();

//     // Update Organization details
//     const organization = await Organization.findOne({
//       where: { id: existingData.Organizations[0].id  },
//     });
//     console.log("organization---", organization);
//     if (organization) {
//       if (business_name) {
//         organization.business_name = business_name.trim();
//       }
//       if (req.file) {
//         organization.logo = req.file.filename;
//       }
//       if (theme_color) {
//         organization.theme_color = theme_color;
//       }
//       if (instagram_handle) {
//         organization.instagram_handle = instagram_handle;
//       }
//       if (facebook_handle) {
//         organization.facebook_handle = facebook_handle;
//       }
//       if (welcome_message) {
//         organization.welcome_message = welcome_message;
//       }
//       // if (subscription_id) {
//       //   organization.subscription_id = subscription_id;
//       // }
//       await organization.save();
//     }
//     req.success = "Successfully Updated.";
//     next("last");
//   } catch (err) {
//     next(err);
//   }
// };

// exports.loginAsAdmin = async (req, res, next) =>{
//   try {
//     const admin = await Super_Admin_Cashier.findOne({
//       where: { id:req.params.admin_id},
//     });
//     // console.log("req.params.admin_id",req.params.admin_id);
   
//     // console.log("superAdmin",superAdmin);
//     if (!admin) {
//       throw new Error("Invalid user name.");
//     }
//     if (admin.status !== ACTIVE) { 
//       throw new Error('Your account is not active or blocked.'); 
//     }
//     if(admin)
//     {
//       const superAdmin = await Super_Admin_Cashier.update(
//         { is_superadmin: true}, 
//         { where: { id: admin.id } }
//       );
//       let token = jwt.sign(
//         { id: admin.id, email: admin.email, role_id: admin.role_id,
//           //  role:"superadmin"
//           },
//         process.env.SECRET,
//         { expiresIn: "365d" }
//       );
//       console.log("token", token);
//       await Super_Admin_Cashier.update(
//         { token: token },
//         { where: { id: admin.id } }
//       );
//       res.cookie("dd-token", token, { maxAge: 1000 * 60 * 60 * 24 * 365 });
//       // res.clearCookie("dd-user");
//       switch (admin.role_id) {
//         case 0:
//           return res.redirect("/admin/superadmin/dashboard");
//         case 1:
//           return res.redirect("/admin/dashboard");
//         case 2:
//           return res.redirect("/cashier/dashboard");
//         default:
//           console.log("Invalid role_id:", super_admin_cashier.role_id);
//       }
//     }
//   } catch (error) {
//     console.log('error',error);
//   }
// }

// exports.ForgetPassword = async (req, res, next)=>{

// }
// exports.deleteAdmin = async (req, res, next) => {
//   try {
//     console.log("del id", req.params.id);
//     const data = await Super_Admin_Cashier.destroy({
//       where: { id: req.params.id },
//     });
//     // req.success = "";
//     next("last");
//   } catch (err) {
//     next(err);
//   }
// };

// exports.blockAdmin = async (req, res, next) => {
//   try {
//     console.log("Block admin ID:", req.params.id);
//     const adminId = req.params.id;
//     // Assuming 'status' is the field representing the admin's status
//     const admin = await Super_Admin_Cashier.findByPk(adminId);
//     if (!admin) {
//       throw new Error("Admin not found.");
//     }
//     if (admin.status === "BLOCKED") {
//       // Update status from "BLOCKED" to "ACTIVE" instead of throwing an error
//       await Super_Admin_Cashier.update(
//         { status: "ACTIVE" }, 
//         { where: { id: adminId } }
//       );
//       req.success = "Admin is now active.";
//       next("last");
//     } else {
//       // If status is not "BLOCKED", block the admin
//       const blockedAdmin = await Super_Admin_Cashier.update(
//         { status: "BLOCKED" }, 
//         { where: { id: adminId } }
//       );
//       req.success = "Successfully Blocked.";
//       next("last");
//     }
//   } catch (err) {
//     next(err);
//   }
// };
