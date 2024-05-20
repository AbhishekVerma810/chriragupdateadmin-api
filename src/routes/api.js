const express = require('express');
const router = express.Router();
const {checkUserAuth,checkAdminAuth,checkDeliveryUserAuth} = require("../middleware/user.auth");
const multer = require('../middleware/file.upload.js');
const controller = require('../controller/api/index.js');
const singleImage = multer.upload.single("img_url");
const logoImage = multer.upload.single("logo");

// authcontroller
router.post('/auth/signup',singleImage, controller.AuthController.signup);
router.post('/auth/admin/login',controller.AuthController.adminLogin);
router.post('/auth/login',controller.AuthController.login);
router.post('/auth/logout',checkUserAuth,controller.AuthController.logout);
router.get('/user/detail',checkUserAuth,controller.AuthController.getUserDetail);
router.post('/user/profile/update',checkUserAuth,singleImage,controller.AuthController.updateProfile);
router.post('/user/password/update',checkUserAuth,controller.AuthController.updatePassword);
router.post('/user/forget/password',controller.AuthController.forgetPassword);


// notificationController
router.get("/shootNotification",checkUserAuth, controller.NotificationController.shootNotification);
router.get("/unread-notifications-count",checkUserAuth,controller.NotificationController.unreadNotificationCount);
router.get("/notifications",checkUserAuth,controller.NotificationController.getUserNotifications);

// ServiceController
router.post('/service/create',checkAdminAuth,singleImage, controller.ServiceController.addService);
router.get('/service/list',controller.ServiceController.getServiceList);
router.get('/service/detail/:id', controller.ServiceController.getServiceDetail);
router.post('/service/category',checkAdminAuth, controller.ServiceController.createServiceCategory);
router.post('/service/category/item',checkAdminAuth,singleImage, controller.ServiceController.createServiceCategoryItem);
router.post('/service/delete/:id',checkAdminAuth, controller.ServiceController.deleteService);
router.put('/service/update/:id',checkAdminAuth, controller.ServiceController.updateService);

// BannerController
router.post('/banner/create',checkAdminAuth,singleImage, controller.BannerController.addBanner);
router.get('/banner/list', controller.BannerController.getBannerList);

//CartController
router.post('/cart/create',checkUserAuth, controller.CartController.addCart);//modified remove user_id
router.get('/cart/list',checkUserAuth, controller.CartController.getAllCartData);
router.get('/cart/user',checkUserAuth, controller.CartController.getUserCartData);
router.get('/cart/:id',checkUserAuth, controller.CartController.getCartDataById);
router.put('/cart/update/:id',checkUserAuth, controller.CartController.updatCartData);
router.post('/cart/delete/:id',checkUserAuth, controller.CartController.deleteCartData);

// ordercontroller
router.post('/order/create',checkUserAuth, controller.OrderController.createOrder)
router.post('/order/single/:id',checkUserAuth, controller.OrderController.getSingleOrder)
router.get('/order/my',checkUserAuth, controller.OrderController.myOrder)
router.get('/order/getall',checkUserAuth, controller.OrderController.getAllOrder)
router.post('/order/delete/:id',checkUserAuth, controller.OrderController.deleteOrder)
router.get('/order/history',checkUserAuth, controller.OrderController.userOrderHistory)

// AddressController
router.post('/address/create',checkUserAuth, controller.AddressController.addAddress);
router.get('/address/user',checkUserAuth, controller.AddressController.getUserAddress);
router.get('/address/edit/:id',checkUserAuth, controller.AddressController.editAddress);
router.post('/address/update/:id',checkUserAuth, controller.AddressController.updateAddress);
router.post('/address/delete/:id',checkUserAuth, controller.AddressController.deleteAddress);

// SupportController
router.post('/support/ticket/create',checkUserAuth, controller.SupportController.createSupportTicket);

// DeliveryController
router.post('/delivery/user/create',singleImage, controller.DeliveryController.createDeliveryBoy);
router.post('/delivery/user/login',controller.DeliveryController.login);
router.post('/auth/logout',checkDeliveryUserAuth,controller.DeliveryController.logout);
router.get('/delivery/user/detail',checkDeliveryUserAuth,controller.DeliveryController.getUserDetail);
router.post('/delivery/user/profile/update',checkDeliveryUserAuth,singleImage,controller.DeliveryController.updateProfile);
router.post('/delivery/user/password/update',checkDeliveryUserAuth,controller.DeliveryController.updatePassword);
router.post('/delivery/user/forget/password',controller.DeliveryController.forgetPassword);

//AssignOrderController
router.post('/assign/order',checkAdminAuth,controller.AssignOrderController.assignOrderToDeliveryBoy);
router.post('/delivery/order',checkAdminAuth,controller.AssignOrderController.assignDeliveryOrderToDeliveryBoy);
router.get('/assign/order/list',checkAdminAuth,controller.AssignOrderController.getAllAdminAssignOrder);
router.get('/delivery/boy/assign/order/list',checkDeliveryUserAuth,controller.AssignOrderController.getAllAssignOrderToDeliveryBoy)
router.get('/delivery/boy/delivery/order/list',checkDeliveryUserAuth,controller.AssignOrderController.getAllDeliveryOrderToDeliveryBoy);
router.get('/delivery/boy/completed/order/list',checkDeliveryUserAuth,controller.AssignOrderController.getAllCompletedOrderToDeliveryBoy);


module.exports = router;