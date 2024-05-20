const { Cart, Service_Category_Item, Service_Category,User } = require("../../models");


exports.addCart = async (req, res) => {
  try {
    const { products } = req.body;

    // If products is not an array, treat it as a single product
    const productsArray = Array.isArray(products) ? products : [products];

    if (productsArray.length === 0) {
      return res.status(400).json({
        status: "error",
        message: 'Invalid request body. "products" must be provided.',
      });
    }

    const orders = await Promise.all(
      productsArray.map(async (product) => {
        const { quantity, service_category_item_id } = product;
        const order = await Cart.create({
          quantity,
          user_id:req.user.id,
          service_category_item_id,
        });
        return order;
      })
    );
    res.status(201).json({ status: "success", data: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// Get all Cart
exports.getAllCartData = async (req, res) => {
  try {
    const orders = await Cart.findAll();
    res.status(200).json({ status: "success", data: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// Get Cart by Id
exports.getCartDataById = async (req, res) => {
  try {
    const order = await Cart.findByPk(req.params.id);
    if (!order) {
      return res
        .status(404)
        .json({ status: "error", message: "Order not found" });
    }
    res.status(200).json({ status: "success", data: order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// Get an UserCartData
exports.getUserCartData = async (req, res) => {
  try {
    const userCart = await Cart.findAll({
        where: {
          user_id: req.user.id,
        },
        attributes: ['id', 'quantity', 'service_category_item_id'],
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email'],
          },
          {
            model: Service_Category_Item,
            as: 'item',
            attributes: ['id', 'name', 'img_url', 'price'],
            include: [
              {
                model: Service_Category,
                as: 'category', // Use the correct alias 'category'
                attributes: ['id', 'name'],
              },
            ],
          },
        ],
      });
    if (!userCart) {
      return res
        .status(404)
        .json({ status: "error", message: "cartData not found" });
    }
    res.status(200).json({ status: "success", data: userCart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// Update an cart
exports.updatCartData = async (req, res) => {
  try {
    const order = await Cart.findByPk(req.params.id);
    if (!order) {
      return res
        .status(404)
        .json({ status: "error", message: "Order not found" });
    }
    await order.update(req.body);
    res.status(200).json({ status: "success", data: order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// Delete an cart by id
exports.deleteCartData = async (req, res) => {
  try {
    const order = await Cart.findByPk(req.params.id);
    if (!order) {
      return res
        .status(404)
        .json({ status: "error", message: "Order not found" });
    }
    await order.destroy();
    res
      .status(204)
      .json({ status: "success", message: "Order deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

exports.placedOrder = async (req, res, next) => {
  try {
    console.log("--------------req.body-----------", req.body);
    const {
      user_id,
      name,
      address,
      state,
      city,
      phone_num,
      pin_code,
      payment_method,
      total_amount,
    } = req.body;
    // Create new order
    const today = moment().format("YYYY-MM-DD");
    console.log(":today", today);
    const order = new Order({
      order_date: today,
      grand_total: grand_total,
      shipping_address: address,
      payment_method: "completed",
    });
    // Save order to the database
    await order.save();
    // Retrieve cart items for the user
    const cartItems = await Cart.findAll({ user_email: user_email });
    // Create order items from cart items
    for (const cartItem of cartItems) {
      const orderItem = new Order_Item({
        product_id: cartItem.id,
        order_id: order.id,
        email: user_email,
        address: address,
        phone: phone_num,
        // user_id:order.user_id,
        // user_email: order.user_email,
        // product_name: cartItem.product_name,
        // product_price: cartItem.product_price,
        // product_quantity: cartItem.product_quantity,
        // product_image: cartItem.product_image,
      });
      await orderItem.save();
    }
    // console.log("paymentIntent",paymentIntent);
    const payment = new Payment({
      user_id: order.id,
      order_id: order.id,
      payment_date: today,
      payment_method: "card",
      transaction_id: uuidv4(),
    });
    await payment.save();
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
  } catch (err) {
    next(err);
  }
};
