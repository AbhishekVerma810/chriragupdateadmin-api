const {Notification} = require("../../models");
const utils = require("../../utils/helper");
const { Op } = require("sequelize");
const Joi = require("joi");
const {
  ACTIVE,
  BLOCKED,
  CREDENTIAL,
  FORGOT_PASSWORD,
  ERROR_MESSAGES,
  PAGE_PER_LIMIT,
  SUCCESS_MESSAGES,
} = require("../../utils/constants");
const Response = require("../../utils/response");
exports.shootNotification = async (req, res) => {
    try {
        let notification = {
          title: "Test notf",
          message: "Testing chalu",
        };

        let firebaseToken =
        "fQzVwPVORhOF8-B70lJvK6:APA91bHrMx2wVzY2lKxyDDeiWgA_kNPIHl8rjygB7VVJJCkJpu_ZZAic0qOJ8F66bHeRjC7nQvDOOsKXE6Q69-41I67EQiwAFaGmrVwI18xsMu2rZ8ZmXDrhGefgFLCkddWUu11jHCnm";
        utils.pushNotification(notification, firebaseToken);
        return res.status(200).json({ notification });
      } catch (error) {
        console.log("error=>", error);
        return Response.errorResponseData(res, res.__("Something went wrong"));
      }
};

exports.unreadNotificationCount = async (req, res) => {
  try {
    const unreadNotification = await Notification.count({
      where: {
        user_id: req.user.id,
        is_read: false,
      },
    });

    return Response.successResponseData(
      res,
      SUCCESS_MESSAGES["NOTIFICATION_COUNT"],
      unreadNotification
    );
  } catch (error) {
    console.log("error=>", error);
    return res.status(500).json({ error: ERROR_MESSAGES["CLIENT_ERROR"] });
  }
};

exports.getUserNotifications = async (req, res) => {
  try {
    const { authUserId } = req;

    let page = parseInt(req.query.page) || 1;
    let limit = PAGE_PER_LIMIT;
    let offset = (page - 1) * limit;

    const userNotification = await Notification.findAndCountAll({
      where: {
        user_id: authUserId,
      },
      limit: limit,
      offset: offset,
      order: [['id', 'DESC']]
    });

    let extras = {
      pageNo: page,
      perPage: limit,
      totalData: userNotification.count,
      totalPages: Math.ceil(userNotification.count / limit)
     };

    if (userNotification.length === 0) {
      return Response.successResponseData(
        res,
        SUCCESS_MESSAGES["NOTIFICATION_FETCH"],
        userNotification
      );
    } else {
     const data=  await Notification.update(
        { is_read: true },
        {
          where: {
            user_id: authUserId,
            is_read: false,
          },
        }
      );

      return Response.successResponseData(
        res,
        SUCCESS_MESSAGES["NOTIFICATION_FETCH"],
        userNotification,
        extras
      );
    }
  } catch (error) {
    console.log("error=>", error);
    return res.status(500).json({ error: ERROR_MESSAGES["CLIENT_ERROR"] });
  }
};
