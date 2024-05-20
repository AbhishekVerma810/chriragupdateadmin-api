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

exports.editBanner = async (req, res) => {
  try {
    const data = await Banner.findOne({ where: { id: req.params.id } });

    return res.status(200).json({ data });
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};



// exports.updateBanner = async (req, res) => {
//   try {
//     const { title, description } = req.body;
//     let updateFields = { title, description };

//     // Handle file upload
//     if (req.file) {
//       updateFields.img_url = req.file.filename;
//     } else if (req.files && req.files.length > 0) {
//       // If the file information is in an array
//       updateFields.img_url = req.files[0].filename;
//     }

//     const [updated] = await Banner.update(updateFields, {
//       where: { id: req.params.id },
//       returning: true,
//     });

//     if (!updated) {
//       return res.status(404).json({ error: 'Banner not found' });
//     }

//     return res.status(200).json({ message: 'Banner updated successfully', data: updated });
//   } catch (err) {
//     return res.status(500).json({ error: 'Internal Server Error' });
//   }
// };
exports.updateBanner = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    let updateFields = {
      title: title,
      description: description,
    };
    if (req.file) {
      updateFields.img_url = req.file.filename;
    }
    const [affectedRows] = await Banner.update(updateFields, {
      where: {
        id: req.params.id,
      }
    });

    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    const updatedBanner = await Banner.findOne({
      where: {
        id: req.params.id,
      }
    });

    return res.status(200).json({ message: 'Banner updated successfully', data: updatedBanner });
  } catch (err) {
    next(err);
  }
};

exports.deleteBanner = async (req, res) => {
  try {
    const deleted = await Banner.destroy({ where: { id: req.params.id } });

    if (!deleted) {
      return res.status(404).json({ error: 'Banner not found' });
    }
    return res.status(200).json({ message: 'Banner deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};