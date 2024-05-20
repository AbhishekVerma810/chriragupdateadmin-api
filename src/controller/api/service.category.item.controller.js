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

exports.createServiceCategoryItem = async (req, res, next) => {
  try {
    const { service_category_id, name, price, quantity } = req.body;

    let img_url;
    if (req.file) {
      img_url = req.file.filename;
    }
    const serviceCategoryItem = await Service_Category_Item.create({
      service_category_id: service_category_id,
      name: name,
      img_url: img_url,
      price: price,
      quantity: quantity,
    });
    res.status(201).json(serviceCategoryItem);
  } catch (err) {
    next(err);
  }
};

exports.getAllServiceCategoryItem = async (req, res, next) => {
  try {
    const serviceCategoryItems = await Service_Category_Item.findAll();
    res.status(200).json(serviceCategoryItems);
  } catch (err) {
    next(err);
  }
};

exports.editServiceCategoryItem = async (req, res, next) => {
  try {
    const serviceCategoryItem = await Service_Category_Item.findByPk(
      req.params.id
    );
    if (!serviceCategoryItem) {
      return res.status(404).json({ error: "Service category item not found" });
    }
    res.status(200).json(serviceCategoryItem);
  } catch (err) {
    next(err);
  }
};

exports.updateServiceCategoryItem = async (req, res, next) => {
  try {
    const { service_category_id, name, price, quantity } = req.body;
    let img_url;
    if (req.file) {
      img_url = req.file.filename;
    }

    const [updated] = await Service_Category_Item.update(
      { service_category_id, name, img_url, price, quantity },
      { where: { id: req.params.id }, returning: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Service category item not found" });
    }

    res
      .status(200)
      .json({
        message: "Service category item updated successfully",
        data: updated[0],
      });
  } catch (err) {
    next(err);
  }
};

exports.deleteServiceCategoryItem = async (req, res, next) => {
  try {
    const deleted = await Service_Category_Item.destroy({
      where: { id: req.params.id },
    });

    if (!deleted) {
      return res.status(404).json({ error: "Service category item not found" });
    }

    res
      .status(200)
      .json({ message: "Service category item deleted successfully" });
  } catch (err) {
    next(err);
  }
};
