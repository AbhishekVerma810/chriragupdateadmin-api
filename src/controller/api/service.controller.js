const {Service,Service_Category,Service_Category_Item,} = require("../../models");
const { sendMail } = require("../../utils/helper");
const utils = require("../../utils/helper");
const { Op } = require("sequelize");
const { ACTIVE, BLOCKED, CREDENTIAL, FORGOT_PASSWORD } = require("../../utils/constants");
const Response = require("../../utils/response");
const Joi = require("joi");

exports.addService = async (req, res, next) => {
  try {
    const {
      title,
      description,
    } = req.body;

    let img_url;
    if (req.file) {
      img_url = req.file.filename;
    }

    const newService = await Service.create({
      title:title,
      description:description,
      img_url:img_url
    });
    res.status(201).json(newService);
  } catch (err) {
    next(err);
  }
};

exports.getServiceList = async (req, res, next) => {
  try {
    const services = await Service.findAll();
    res.status(200).json(services);
  } catch (err) {
    next(err);
  }
};

exports.editService = async (req, res) => {
  try {
    const data = await Service.findOne({ where: { id: req.params.id } });

    return res.status(200).json({ data });
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateService = async (req, res) => {
  try {
    const { title, description } = req.body;
    let updateFields = { title, description };

    if (req.file) {
      updateFields.image_url = req.file.filename;
    }
    
    const [updated] = await Service.update(updateFields, {
      where: { id: req.params.id },
      returning: true,
    });

    if (!updated) {
      return res.status(404).json({ error: 'Service not found' });
    }

    return res.status(200).json({ message: 'Service updated successfully', data: updated });
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const deleted = await Service.destroy({ where: { id: req.params.id } });

    if (!deleted) {
      return res.status(404).json({ error: 'Service not found' });
    }

    return res.status(200).json({ message: 'Service deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.getServiceDetail = async (req, res, next) => {
  try {
    // const services = await Service.findOne({where:{id:req.params.id}});
    const services = await Service.findOne({
      where: { id: req.params.id },
      include: [{
        model: Service_Category,
        as: 'categories',
        include: [{
          model: Service_Category_Item,
          as: 'items'
        }]
      }]
    });
    res.status(200).json(services);
  } catch (err) {
    next(err);
  }
};

exports.createServiceCategory = async (req, res, next) => {
  try {
    const {
      service_id,
      name,
    } = req.body;
    const serviceCategory = await Service_Category.create({
      service_id,
      name
    });
    res.status(201).json(serviceCategory);
  } catch (err) {
    next(err);
  }
};

exports.createServiceCategoryItem = async (req, res, next) => {
  try {
    const {
      service_category_id,
      name,
      price,
      quantity
    } = req.body;

    let img_url;
    if (req.file) {
      img_url = req.file.filename;
    }
    const serviceCategoryItem = await Service_Category_Item.create({
      service_category_id:service_category_id,
      name:name,
      img_url:img_url,
      price:price,
      quantity:quantity
    });
    res.status(201).json(serviceCategoryItem);
  } catch (err) {
    next(err);
  }
};

// Update a Service
exports.updateService = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    let updateFields = {
      title: title,
      description: description,
    };
    if (req.file) {
      updateFields.img_url = req.file.filename;
    }
    const [affectedRows] = await Service.update(updateFields, {
      where: {
        id: req.params.id,
      }
    });

    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const updatedBanner = await Service.findOne({
      where: {
        id: req.params.id,
      }
    });

    return res.status(200).json({ message: 'Service updated successfully', data: updatedBanner });
  } catch (err) {
    next(err);
  }
};

// Delete a Service
exports.deleteService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedService = await Service.destroy({
      where: {
        id
      }
    });

    if (!deletedService) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (err) {
    next(err);
  }
};

