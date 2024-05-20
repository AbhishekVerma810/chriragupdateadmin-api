const formidable = require('formidable');
const moment = require('moment')
const pluck = require('arr-pluck');

const Response = require('../services/Response');
const { ACCESS_DENIED, ACTIVE, BLOCKED, USER_ROLES, INTERNAL_SERVER, YES } = require('../services/Constant');
const JwtToken = require('../services/JwtToken');

const { User, Admin, SubscribedUser } = require('../models')
const { Op } = require("sequelize");

module.exports = {
  // for separating the file and body content
  uploadMiddleware: (req, res, next) => {
    const form = formidable({ multiples: true });
    form.parse(req, (err, fields, files) => {
      if (err) {
        console.log('error ', err);
        return res.status(INTERNAL_SERVER).send('Error uploading file(s)');
      }
      req.body = fields;
      req.files = files;
      next();
    });
  },

  // auth for all users
  authUser: async (req, res, next) => {
    try {

      const token = req.headers.authorization;

      if (!token) {
        return Response.errorResponseWithoutData(
          res,
          res.locals.__("Authorization error"),
          ACCESS_DENIED
        );
      }

      const tokenData = await JwtToken.decode(token);
      if (tokenData) {
        JwtToken.verify(tokenData, async (err, decoded) => {
          if (err) {
            return Response.errorResponseWithoutData(
              res,
              res.locals.__("Invalid token"),
              ACCESS_DENIED
            );
          }

          if (decoded.id) {

            req.authUserId = decoded.id;
            req.email = decoded.email;
            req.role = decoded.role

            let result = await User.findOne({ where: { id: req.authUserId } })
            console.log("result",result);
            if (!result) {
              return Response.errorResponseWithoutData(
                res,
                res.locals.__("Invalid token"),
                ACCESS_DENIED
              );
            }

            if (result && result.status === BLOCKED) {
              return Response.errorResponseWithoutData(
                res,
                res.locals.__("Account is blocked"),
                ACCESS_DENIED
              );
            }
            else return next();

          } else {
            return Response.errorResponseWithoutData(
              res,
              res.locals.__("Invalid token"),
              ACCESS_DENIED
            );
          }
        });
      } else {
        return Response.errorResponseWithoutData(
          res,
          res.locals.__("Invalid token"),
          ACCESS_DENIED
        );
      }
    } catch (error) {
      console.log("errorinmiddleware", error);
    }
  },

  // validating the admin
  validateAdmin: async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
      return Response.errorResponseWithoutData(res, res.locals.__('Authorization error'), ACCESS_DENIED)
    } else {
      const tokenData = await JwtToken.decode(token)
      if (tokenData) {
        JwtToken.verify(tokenData, (err, decoded) => {
          if (err) {
            return Response.errorResponseWithoutData(res, res.locals.__('Invalid Token'), ACCESS_DENIED)
          }
          if (decoded.id) {
            req.authUserId = decoded.id
            Admin.findOne({
              where: {
                id: req.authUserId,
              },
            }).then((result) => {
              if (!result) {
                return Response.errorResponseWithoutData(
                  res,
                  res.locals.__('Invalid Token'),
                  ACCESS_DENIED
                )
              } else {
                if (result) {
                  return next()
                } else {
                  return Response.errorResponseWithoutData(
                    res,
                    res.locals.__('Account Blocked'),
                    ACCESS_DENIED
                  )
                }
              }
            })
          } else {
            return Response.errorResponseWithoutData(res, res.locals.__('Invalid Token'), ACCESS_DENIED)
          }
        })
      } else {
        return Response.errorResponseWithoutData(res, res.locals.__('Invalid Token'), ACCESS_DENIED)
      }
    }
  },

  // validating corporate admin
  validateCorporateAdmin: async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
      return Response.errorResponseWithoutData(
        res,
        res.locals.__("Authorization error"),
        ACCESS_DENIED
      );
    }

    const tokenData = await JwtToken.decode(token);
    const verifiedData = JwtToken.verify(tokenData);

    if (verifiedData.id && verifiedData.role == USER_ROLES.CORPORATE) {
      req.authUserId = verifiedData.id;
      req.email = verifiedData.email;
      req.role = verifiedData.role

      let result = await User.findOne({ where: { id: req.authUserId } })
      if (!result) {
        return Response.errorResponseWithoutData(
          res,
          res.locals.__("Access denied , invalid token."),
          ACCESS_DENIED
        );
      }


      if (result && result.status === BLOCKED) {
        return Response.errorResponseWithoutData(
          res,
          res.locals.__("Account is blocked"),
          ACCESS_DENIED
        );
      }
      else return next();


    } else {
      return Response.errorResponseWithoutData(
        res,
        res.locals.__("Access denied , invalid token."),
        ACCESS_DENIED
      );
    }

  },

  subscriptionCheck: async (req, res, next) => {
    const { authUserId, role } = req;
    let existingUserData = await User.findByPk(authUserId);

    let adminDetails;
    if (role == USER_ROLES.CORPORATE_USER) {
      adminDetails = await User.findAll({
        where: {
          role: USER_ROLES.CORPORATE,
          company_domain: existingUserData.company_domain
        }
      })
      adminDetails = pluck(adminDetails, 'id')
    }
    let userSubscriptionDetails;
    if (adminDetails) {
      userSubscriptionDetails = await SubscribedUser.findOne({ where: { user_id: { [Op.in]: [adminDetails] }, active: YES }, order: [['id', 'desc']] })
    } else {
      userSubscriptionDetails = await SubscribedUser.findOne({ where: { user_id: authUserId, active: YES }, order: [['id', 'desc']] })
    }

    // if (userSubscriptionDetails) {
    //   if (moment(userSubscriptionDetails.expiry_date).add(userSubscriptionDetails.extended_days, 'days').isAfter(moment())) { next() }
    //   else { return Response.errorResponseWithoutData(res, res.locals.__("No active subcription, please purchase susbcription to avail all features")) }
    // }
    // else return Response.errorResponseWithoutData(res, res.locals.__("No active subcription, please purchase susbcription to avail all features"))

    if (userSubscriptionDetails) {
      const expiryDate = moment(userSubscriptionDetails.expiry_date).add(userSubscriptionDetails.extended_days, 'days');
      const formattedExpiryDate = expiryDate.format('YYYY-MM-DD');
      if (expiryDate.isAfter(moment())) {
        next();
      } else {
        // return Response.errorResponseWithoutData(res, res.locals.__("No active subscription, please purchase a subscription to avail all features"));
        return Response.errorResponseData(res, {
          message: res.locals.__("Your subscription expires today."),
          expiryDate: formattedExpiryDate,
          is_subscription_expired: true
        });
      }
    } else {
      return Response.errorResponseWithoutData(res, res.locals.__("No active subscription, please purchase a subscription to avail all features"));
    }

  }

}