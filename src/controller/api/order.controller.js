const {Order,Cart,Order_Item,Address,Service_Category_Item} = require('../../models');
const { Op } = require("sequelize");
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');


exports.createOrder = async (req, res, next) => {
    try {
      const { address_id, total_amount, quantity } = req.body;
  
      // Create new order
      const today = moment().format('YYYY-MM-DD');
      console.log(":today", today);
      const order = new Order({
        user_id: req.user.id,
        address_id: address_id,
        order_date: today,
        total_amount: total_amount,
        payment_method: "COD",
        status: "pending"
      });
  
      // Save order to the database
      await order.save();
  
      // Retrieve cart items for the user
      const cartItems = await Cart.findAll({ user_id: req.user.id });
  
      // Create order items from cart items
      for (const cartItem of cartItems) {
        const orderItem = new Order_Item({
          service_category_item_id: cartItem.id,
          order_id: order.id,
          quantity: quantity
        });
        await orderItem.save();
      }
       // console.log("paymentIntent",paymentIntent);
        // const payment = new Payment({
        //   user_id: order.id,
        //   order_id: order.id,
        //   payment_date: today,
        //   payment_method: "card",
        //   transaction_id: uuidv4()
        // });
        // await payment.save();
        // Handle payment method
        // if (payment_method === 'cod') {
        //   return res.redirect('/');
        // } else if (payment_method === 'paytm') {
        //   const data_for_request = handlePaytmRequest(order.order_id, grand_total);
        //   const paytm_txn_url = 'https://securegw-stage.paytm.in/theia/processTransaction';
        //   const paramList = data_for_request.paramList;
        //   const checkSum = data_for_request.checkSum;
        //   return res.render('paytm-merchant-form', { paytm_txn_url, paramList, checkSum });
        // }
      // Return success response
      res.status(200).json({
        message: 'Order created successfully',
        order
      });
    } catch (err) {
      // Return failure response
      res.status(500).json({
        message: 'Error creating order',
        error: err.message
      });
      next(err);
    }
};

// Get all orders
exports.getAllOrder = async (req, res) => {
    try {
        const orders = await Order.findAll();
        res.status(200).json({ status: 'success', data: orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

// Get an order by ID
exports.getSingleOrder = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);
        if (!order) {
            return res.status(404).json({ status: 'error', message: 'Order not found' });
        }
        res.status(200).json({ status: 'success', data: order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

exports.myOrder = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);
        if (!order) {
            return res.status(404).json({ status: 'error', message: 'Order not found' });
        }
        res.status(200).json({ status: 'success', data: order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

// Delete an order by ID
exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);
        if (!order) {
            return res.status(404).json({ status: 'error', message: 'Order not found' });
        }
        await order.destroy();
        res.status(204).json({ status: 'success', message: 'Order deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

exports.userOrderHistory = async (req, res) => {
    try {
      const userId = req.user.id; // Assuming you have the user ID from the authenticated user
      const orders = await Order.findAll({
        where: { user_id: userId },
        include: [
          {
            model: Address,
            attributes: ['state', 'city', 'pincode', 'phone_number', 'house_no', 'country', 'address_line']
          },
          {
            model: Order_Item,
            include: {
              model: Service_Category_Item,
              attributes: ['name', 'img_url', 'price', 'quantity']
            }
          }
        ],
        order: [['createdAt', 'DESC']] // Order by createdAt in descending order (latest first)
      });
      if (!orders || orders.length === 0) {
        return res.status(404).json({
          status: 'error',
          message: 'No orders found for the user'
        });
      }
      res.status(200).json({
        status: 'success',
        data: orders
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error'
      });
    }
};

// Update an order by ID
exports.updateOrder = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);
        if (!order) {
            return res.status(404).json({ status: 'error', message: 'Order not found' });
        }
        await order.update(req.body);
        res.status(200).json({ status: 'success', data: order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};
