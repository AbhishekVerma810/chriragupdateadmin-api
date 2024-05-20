const { Support_Ticket } = require("../../models");
const { sendMail } = require("../../utils/helper");
const utils = require("../../utils/helper");
const { Op } = require("sequelize");
const {
  ACTIVE,
  BLOCKED,
  CREDENTIAL,
  FORGOT_PASSWORD,
} = require("../../utils/constants");
const Response = require("../../utils/response");
const Joi = require("joi");

exports.createSupportTicket = async (req, res, next) => {
    try {
      const { order_id, subject, message } = req.body;
      const user_id = req.user.id; 
      // if (!subject || !message) {
      //   return res.status(400).json({ message: "All fields are required" });
      // }
      const newSupportTicket = await Support_Ticket.create({
        user_id,
        order_id,
        subject,
        message,
      });
      return res.status(201).json(newSupportTicket);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Error creating support ticket" });
    }
};
