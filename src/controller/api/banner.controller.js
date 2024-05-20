const {Banner} = require("../../models");
const { sendMail } = require("../../utils/helper");
const utils = require("../../utils/helper");
const { Op } = require("sequelize");
const { ACTIVE, BLOCKED, CREDENTIAL, FORGOT_PASSWORD } = require("../../utils/constants");
const Response = require("../../utils/response");
const Joi = require("joi");

exports.addBanner = async (req, res, next) => {
  try {
    const {
      title,
      description,
    } = req.body;

    let img_url;
    if (req.file) {
      img_url = req.file.filename;
    }

    const newBanner = await Banner.create({
      title:title,
      description:description,
      img_url:img_url
    });
    res.status(201).json(newBanner);
  } catch (err) {
    next(err);
  }
};

exports.getBannerList = async (req, res, next) => {
  try {
    const services = await Banner.findAll();
    res.status(200).json(services);
  } catch (err) {
    next(err);
  }
};

