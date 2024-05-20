const {
  Service,
  Service_Category,
  Service_Category_Item,
} = require("../../models");
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

exports.createServiceCategory = async (req, res, next) => {
  try {
    const { service_id, name } = req.body;
    const serviceCategory = await Service_Category.create({
      service_id,
      name,
    });
    res.status(201).json(serviceCategory);
  } catch (err) {
    next(err);
  }
};

exports.getAllServiceCategory = async (req, res, next) => {
  try {
    const serviceCategories = await Service_Category.findAll({
      attributes: ['id', 'name', 'service_id'],
        include: {
          model: Service,
          attributes: ['id', 'title', 'description','rating','status'] 
        }
      });
    res.status(200).json(serviceCategories);
  } catch (err) {
    next(err);
  }
};
exports.editServiceCategory = async (req, res, next) => {
  try {
    // const serviceCategory = await Service_Category.findByPk(req.params.id);
    const serviceCategory = await Service_Category.findByPk(req.params.id, {
      attributes: ['id', 'name', 'service_id'],
      include: {
        model: Service,
        attributes: ['id', 'title', 'description','rating','status'] 
      }
    });
    if (!serviceCategory) {
      return res.status(404).json({ error: "Service category not found" });
    }
    res.status(200).json(serviceCategory);
  } catch (err) {
    next(err);
  }
};
exports.updateServiceCategory = async (req, res, next) => {
  try {
    const { service_id, name } = req.body;
    const [updated] = await Service_Category.update(
      { service_id, name },
      { where: { id: req.params.id }, returning: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Service category not found" });
    }

    res
      .status(200)
      .json({
        message: "Service category updated successfully",
        data: updated[0],
      });
  } catch (err) {
    next(err);
  }
};
exports.deleteServiceCategory = async (req, res, next) => {
  try {
    const deleted = await Service_Category.destroy({
      where: { id: req.params.id },
    });

    if (!deleted) {
      return res.status(404).json({ error: "Service category not found" });
    }

    res.status(200).json({ message: "Service category deleted successfully" });
  } catch (err) {
    next(err);
  }
};
