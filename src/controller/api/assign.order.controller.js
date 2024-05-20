const {
  Order,
  Cart,
  Order_Item,
  Order_Assign,
  Delivery_Boy,
  Address,
  Service_Category_Item,
} = require("../../models");
const { Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");

exports.assignOrderToDeliveryBoy = async (req, res, next) => {
  try {
    const { order_id, delivery_boy_id } = req.body;

    // Find the order
    const order = await Order.findByPk(order_id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if delivery boy exists
    const deliveryBoy = await Delivery_Boy.findByPk(delivery_boy_id);
    if (!deliveryBoy) {
      return res.status(404).json({ message: "Delivery boy not found" });
    }

    // Create a new order assignment
    const orderAssignment = await Order_Assign.create({
      order_id,
      delivery_boy_id,
      admin_id: req.admin.id,
      status: "assigned",
    });
    await order.update({ status: "assigned" });

    res
      .status(200)
      .json({
        message: "Order assigned to delivery boy successfully",
        order,
        orderAssignment,
      });
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Error assigning order to delivery boy",
        error: err.message,
      });
    next(err);
  }
};

exports.assignDeliveryOrderToDeliveryBoy = async (req, res, next) => {
  try {
    const { order_id, delivery_boy_id } = req.body;

    // Find the order
    const order = await Order.findByPk(order_id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if delivery boy exists
    const deliveryBoy = await Delivery_Boy.findByPk(delivery_boy_id);
    if (!deliveryBoy) {
      return res.status(404).json({ message: "Delivery boy not found" });
    }

    // Create a new order assignment
    const orderAssignment = await Order_Assign.create({
      order_id,
      delivery_boy_id,
      admin_id: req.admin.id,
      status: "delivery",
    });
    await order.update({ status: "delivery" });

    res
      .status(200)
      .json({
        message: "Order assigned to delivery boy successfully",
        order,
        orderAssignment,
      });
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Error assigning order to delivery boy",
        error: err.message,
      });
    next(err);
  }
};

// Get All Assign Order
exports.getAllAssignOrderToDeliveryBoy = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have the user ID from the authenticated user
    const orders = await Order.findAll({
      where: {
        user_id: userId,
        status: "assigned", // Filter orders with status assigned
      },
      include: [
        {
          model: Address,
          attributes: [
            "state",
            "city",
            "pincode",
            "phone_number",
            "house_no",
            "country",
            "address_line",
          ],
        },
        {
          model: Order_Item,
          include: {
            model: Service_Category_Item,
            attributes: ["name", "img_url", "price", "quantity"],
          },
        },
      ],
      order: [["createdAt", "DESC"]], // Order by createdAt in descending order (latest first)
    });
    if (!orders || orders.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No assigned orders found for the user",
      });
    }
    res.status(200).json({
      status: "success",
      data: orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.getAllDeliveryOrderToDeliveryBoy = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have the user ID from the authenticated user
    const orders = await Order.findAll({
      where: {
        user_id: userId,
        status: "delivery", // Filter orders with status assigned
      },
      include: [
        {
          model: Address,
          attributes: [
            "state",
            "city",
            "pincode",
            "phone_number",
            "house_no",
            "country",
            "address_line",
          ],
        },
        {
          model: Order_Item,
          include: {
            model: Service_Category_Item,
            attributes: ["name", "img_url", "price", "quantity"],
          },
        },
      ],
      order: [["createdAt", "DESC"]], // Order by createdAt in descending order (latest first)
    });
    if (!orders || orders.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No delivery orders found for the user",
      });
    }
    res.status(200).json({
      status: "success",
      data: orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
}

exports.getAllAdminAssignOrder = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have the user ID from the authenticated user
    const orders = await Order.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Address,
          attributes: [
            "state",
            "city",
            "pincode",
            "phone_number",
            "house_no",
            "country",
            "address_line",
          ],
        },
        {
          model: Order_Item,
          include: {
            model: Service_Category_Item,
            attributes: ["name", "img_url", "price", "quantity"],
          },
        },
      ],
      order: [["createdAt", "DESC"]], // Order by createdAt in descending order (latest first)
    });
    if (!orders || orders.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No orders found for the user",
      });
    }
    res.status(200).json({
      status: "success",
      data: orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.getAllCompletedOrderToDeliveryBoy = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have the user ID from the authenticated user
    const orders = await Order.findAll({
      where: {
        user_id: userId,
        status: "completed", // Filter orders with status assigned
      },
      include: [
        {
          model: Address,
          attributes: [
            "state",
            "city",
            "pincode",
            "phone_number",
            "house_no",
            "country",
            "address_line",
          ],
        },
        {
          model: Order_Item,
          include: {
            model: Service_Category_Item,
            attributes: ["name", "img_url", "price", "quantity"],
          },
        },
      ],
      order: [["createdAt", "DESC"]], // Order by createdAt in descending order (latest first)
    });
    if (!orders || orders.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No completed orders found for the user",
      });
    }
    res.status(200).json({
      status: "success",
      data: orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
}

exports.myOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
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

// Delete an order by ID
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
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

exports.userOrderHistory = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have the user ID from the authenticated user
    const orders = await Order.findAll({
      where: {
        user_id: userId,
      },
      order: [["createdAt", "DESC"]], // Order by createdAt in descending order (latest first)
    });

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No orders found for the user",
      });
    }

    res.status(200).json({
      status: "success",
      data: orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

// Update an order by ID
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
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
