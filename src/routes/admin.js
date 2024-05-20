const express = require('express');
const router = express.Router();
const checkAuth = require("../middleware/admin.auth.js");
const multer = require('../middleware/file.upload.js');
const controller = require('../controller/admin/index');
const singleImage = multer.upload.single("image");
const logoImage = multer.upload.single("logo");
// router.get('/', (req, res) => {
//     // res.send("HII")
//     // res.sendFile(join(__dirname, 'index.html'));
// });

// authcontroller
router.get("/login", controller.AuthController.getLogin);
router.post("/login", controller.AuthController.login);
router.get("/log-out",checkAuth,controller.AuthController.logOut);
// router.get("/emails/forgot-password", controller.AuthController.GetforgotPasswordPage);
// router.get("/emails/sendToken", controller.AuthController.SendforgotPasswordToken);
// router.get("/reset/:token", controller.AuthController.resetPasswordApi);  //user confirmation
// router.get("/emails/reset-password", controller.AuthController.resetAdminPasswordApi);  //user confirmation
// router.get("/emails/reset/:token", controller.AuthController.NavigateToresetPassword);
router.get("/forget-password", controller.AuthController.forgotPassword);
router.post("/forget-password",controller.AuthController.userForgotPassword)
router.get("/reset-password",controller.AuthController.resetPassword)
router.post("/reset-password",controller.AuthController.userResetPassword)

// dashboardcontroller
router.get('/superadmin/dashboard',checkAuth,controller.DashboardController.superAdminDashboard);
router.get('/dashboard',checkAuth,controller.DashboardController.adminDashboard);

// admincontroller
router.get('/create', checkAuth,controller.AdminController.getCreateAdmin);
router.post('/create',checkAuth,logoImage,checkAuth, controller.AdminController.createAdmin);
router.get('/list',checkAuth, controller.AdminController.getAdmin);
router.get('/edit/:id',checkAuth, controller.AdminController.editAdmin);
router.post('/update/:id',checkAuth, logoImage, controller.AdminController.updateAdmin);
router.get('/delete/:id',checkAuth, controller.AdminController.deleteAdmin);

module.exports = router;