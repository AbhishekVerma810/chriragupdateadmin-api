const { Op } = require("sequelize");
const Joi = require("joi").extend(require("@joi/date"));
const bcrypt = require("bcrypt");
const moment = require("moment");
const path = require("path");
const pluck = require("arr-pluck");

const {
  User,
  Notification,
  MeetOptions,
  UserMeetOptions,
  UserOtp,
  sequelize,
  UserSexualOrientation,
  UserInterest,
  Interest,
  SexualOrientation,
  UserPictures,
  StaticData,
  Subscription,
  SubscribedUser,
  SubscriptionPackage,
  AgeGroup,
  UserAgeGroup,
  UserItselfAgeGroup,
  UserFollower,
  Profile_View,
} = require("../../models");

const Response = require("../../services/Response");
const JwtToken = require("../../services/JwtToken");
const Helper = require("../../services/Helper");
const Mailer = require("../../services/Mailer");

const {
  ACTIVE,
  DELETE,
  BLOCKED,
  YES,
  NO,
  USER_ROLES,
  GENDER,
  NOT_FOUND,
  PER_PAGE_LIMIT,
  INACTIVE,
  INTERNAL_SERVER,
  SOCIAL_LOGIN_TYPE,
  SUCCESS,
  OTP_TYPE,
  MAIL_SUBJECT,
  FAIL,
  IMAGE_FORMAT,
  DOMAINS_NOT_ALLOWED_FOR_CORPORATE,
  STATIC_DATA_KEYS,
  // GET_STATIC_DATA,
  SUBSCRIPTION_TYPE,
} = require("../../services/Constant");

module.exports = {
  signUp: async (req, res) => {
    // creating new transaction
    // const signUpTransaction = await sequelize.transaction();
    try {
      const reqParam = { ...req.body, ...req.files };

      // if (reqParam.interest && typeof reqParam.interest === 'string') {
      //   try {
      //     reqParam.interest = JSON.parse(reqParam.interest);
      //     reqParam.interest
      //       ? (reqParam.interest = [...new Set(reqParam.interest)])
      //       : null;
      //   } catch (error) {
      //     console.error("Invalid JSON format for 'interest'.", error);
      //   }
      // }

      // if (reqParam.meeting_option && typeof reqParam.meeting_option === 'string') {
      //   try {
      //     // reqParam.meeting_option = JSON.parse(reqParam.meeting_option);
      //     reqParam.meeting_option = [reqParam.meeting_option]
      //     reqParam.meeting_option
      //       ? (reqParam.meeting_option = [...new Set(reqParam.meeting_option)])
      //       : null;
      //   } catch (error) {
      //     console.error("Invalid JSON format for 'interest'.", error);
      //   }
      // }

      let userPictureLimit = Number(
        await Helper.GET_STATIC_DATA(STATIC_DATA_KEYS.USER_PICTURE_LIMIT)
      );

      // console.log("userPictureLimit",userPictureLimit);

      // if (reqParam.pictures && !(Array.isArray(reqParam.pictures))) {
      //   reqParam.pictures = [reqParam.pictures];
      // }
      // console.log("reqParam.meeting_option::", reqParam.meeting_option);
      const reqObj = {
        first_name: Joi.string().trim().max(50).required(),
        last_name: Joi.string().trim().max(50),
        email: Joi.string().email().required().label("Email Address"),
        mobile_no: Joi.string()
          .pattern(/^[0-9]{10}$/)
          .optional()
          .options({
            messages: {
              "string.pattern.base":
                'Phone number "{#value}" is invalid. Please enter a 10-digit phone number without any spaces or special characters.',
            },
          }),
        password: Joi.string().required(),
        confirm_password: Joi.any()
          .valid(Joi.ref("password"))
          .required()
          .label("Password")
          .messages({
            "any.only": "Password and Confirm Password must be same",
          }),
        role: Joi.string()
          .valid(...Object.values(USER_ROLES))
          .required(),
        referred_by: Joi.string().allow("").optional(),
        profile_picture: Joi.object({
          mimetype: Joi.string()
            .valid(...Object.values(IMAGE_FORMAT))
            .required(),
          originalFilename: Joi.string().required(),
          size: Joi.number().min(1).required(),
        })
          .optional()
          .unknown(),

        dob: Joi.date().format("YYYY-MM-DD").label("Date of birth"),
        // gender required only for user
        orientation: Joi.when("role", {
          is: [USER_ROLES.USER, USER_ROLES.CORPORATE_USER],
          then: Joi.number().required(),
          otherwise: Joi.forbidden(),
        }),

        logo: Joi.when("role", {
          is: [USER_ROLES.VENUE, USER_ROLES.CORPORATE],
          then: Joi.object({
            mimetype: Joi.string()
              .valid(...Object.values(IMAGE_FORMAT))
              .required(),
            originalFilename: Joi.string().required(),
            size: Joi.number().min(1).required(),
          })
            .optional()
            .unknown()
            .required(),
          otherwise: Joi.forbidden(),
        }),

        website: Joi.when("role", {
          is: [USER_ROLES.VENUE, USER_ROLES.CORPORATE],
          then: Joi.string()
            .uri({ scheme: ["http", "https"] })
            .required(),
          otherwise: Joi.forbidden(),
        }),

        domain: Joi.when("role", {
          is: [USER_ROLES.CORPORATE, USER_ROLES.CORPORATE_USER],
          then: Joi.string()
            .regex(/^(?!(https?|www)\b)(?!.*\/\/)(?!.*\\|:|@)(?=.*\.)[^\s]+$/)
            .required()
            .messages({
              "string.pattern.base":
                "Invalid domain , enter a plain text like domain.org",
            }),
          otherwise: Joi.forbidden(),
        }),

        current_location: Joi.when("role", {
          is: [USER_ROLES.VENUE, USER_ROLES.CORPORATE],
          then: Joi.string().required(),
          otherwise: Joi.forbidden(),
        }),

        longitude: Joi.string(),
        latitude: Joi.string(),
        language_id: Joi.number(),
        nationality_id: Joi.number(),
        meeting_option: Joi.array()
          .items(Joi.number().integer())
          .label("Meeting options"),
        interest: Joi.array()
          .items(Joi.number().integer())
          .max(10)
          .min(1)
          .label("Interest"),
        age_group: Joi.number(),
        user_own_age_group: Joi.number(),
        address: Joi.string(),
        pictures: Joi.array()
          .items(
            Joi.object({
              mimetype: Joi.string()
                .valid(...Object.values(IMAGE_FORMAT))
                .required(),
              originalFilename: Joi.string().required(),
              size: Joi.number().min(1).required(),
            })
              .optional()
              .unknown()
          )
          .optional()
          .max(userPictureLimit)
          .min(1)
          .label("Pictures array"),
      };

      // bad request error generation
      const schema = Joi.object(reqObj);
      const { error } = schema.validate(reqParam);
      if (error) {
        return Response.validationErrorResponseData(
          res,
          res.__(`${error.details[0].message}`)
        );
      }

      // return;
      // refer code check
      let referredUserDetails;
      if (reqParam.referred_by) {
        referredUserDetails = await User.findOne({
          where: {
            referral_code: reqParam.referred_by,
          },
        });

        if (!referredUserDetails)
          return Response.errorResponseWithoutData(
            res,
            res.__("Incorrect referral code used")
          );
      }

      // duplicate email check
      if (reqParam.email && reqParam.email !== "") {
        const userEmailExist = await User.findOne({
          where: {
            email: reqParam.email,
          },
          paranoid: false,
        });

        // if it is a duplicate email
        if (userEmailExist) {
          return Response.errorResponseWithoutData(
            res,
            res.locals.__("Email address already in use .")
          );
        }

        // if the account has been deleted
        const DeletduserEmailExist = await User.findOne({
          where: {
            email: reqParam.email,
          },
          paranoid: false,
        });

        if (DeletduserEmailExist) {
          return Response.errorResponseWithoutData(
            res,
            res.locals.__(
              "The Email requested to create account has been deleted from our platform."
            )
          );
        }
      }

      // mobile_no check
      if (reqParam.mobile_no) {
        const userMobileExist = await User.findOne({
          where: {
            mobile_no: reqParam.mobile_no,
          },
        });

        // if it is a duplicate mobile no
        if (userMobileExist) {
          return Response.errorResponseWithoutData(
            res,
            res.locals.__("Contact number entered is already in use.")
          );
        }
      }

      let imageName;
      if (reqParam.profile_picture) {
        reqParam.profile_picture.originalFilename =
          reqParam.profile_picture.originalFilename.split(" ").join("-");
        imageName = `${
          reqParam.profile_picture.originalFilename.split(".")[0]
        }${moment().unix()}${path.extname(
          reqParam.profile_picture.originalFilename
        )}`;
        imageName = await Helper.ImageUpload(
          reqParam.profile_picture.filepath,
          res,
          imageName
        );
      }

      let companyLogo;
      if (reqParam.logo) {
        reqParam.logo.originalFilename = reqParam.logo.originalFilename
          .split(" ")
          .join("-");
        companyLogo = `${
          reqParam.logo.originalFilename.split(".")[0]
        }${moment().unix()}${path.extname(reqParam.logo.originalFilename)}`;
        companyLogo = await Helper.ImageUpload(
          reqParam.logo.filepath,
          res,
          companyLogo
        );
      }

      const passwordHash = bcrypt.hashSync(reqParam.password, 10);
      let userObj = {
        first_name: reqParam.first_name,
        last_name: reqParam.last_name,
        email: reqParam.email,
        mobile_no: reqParam.mobile_no ? reqParam.mobile_no : null,
        password: passwordHash,
        status: ACTIVE,
        language_id: reqParam.language_id,
        nationality_id: reqParam.nationality_id,
        referral_code: await Helper.generateReferralCode(),
        email_verified: NO,
        referred_by: reqParam.referred_by ? reqParam.referred_by : null,
        role: reqParam.role,
        profile_picture: imageName ? imageName : null,
        company_logo: companyLogo,
        company_website: reqParam.website,
        company_domain: reqParam.domain,
        current_location: reqParam.current_location,
        longitude: reqParam.longitude,
        latitude: reqParam.latitude,
        dob: reqParam.dob,
      };

      // check if its the first account of the domain
      if (reqParam.role === USER_ROLES.CORPORATE) {
        if (DOMAINS_NOT_ALLOWED_FOR_CORPORATE.includes(reqParam.domain))
          return Response.errorResponseWithoutData(
            res,
            res.locals.__(
              'The domain entered is invalid, don"t use standard domains for creating account.'
            )
          );

        let userDetails = await User.findOne({
          where: {
            company_domain: reqParam.domain,
            role: USER_ROLES.CORPORATE,
          },
          paranoid: false,
        });

        if (!reqParam.email.includes(reqParam.domain))
          return Response.errorResponseWithoutData(
            res,
            res.locals.__(
              "Please enter a valid email to register for the given domain."
            )
          );

        if (userDetails) userObj.role = USER_ROLES.CORPORATE_USER;
      }

      let result = await User.create(userObj);

      if (!result) {
        console.log("Usernotabletocreate");
        return Response.errorResponseData(res, res.__("Something went wrong"));
      }

      const token = JwtToken.issueUser({
        id: result.id,
        email: result.email,
        role: result.role,
      });

      result.reset_token = token;
      result.save();

      // creating user sexual orientation
      if (reqParam.orientation) {
        let sexualorientation = await UserSexualOrientation.create({
          user_id: result.id,
          sexual_orientation_id: reqParam.orientation,
        });
        // console.log("sexualorientation", sexualorientation);
      }
      // age group
      if (reqParam.age_group) {
        let useragegrp = await UserAgeGroup.create({
          user_id: result.id,
          age_group_id: reqParam.age_group,
        });
        // console.log("useragegrp", useragegrp);
      }

      // user itself age group
      if (reqParam.user_own_age_group) {
        let useritselfagegrp = await UserItselfAgeGroup.create({
          user_id: result.id,
          age_group_id: reqParam.age_group,
        });
        console.log("useritselfagegrp", useritselfagegrp);
      }
      // meeting_option | UserMeetOptions
      if (reqParam.meeting_option) {
        let obj = [];
        reqParam.meeting_option.forEach((data) => {
          obj.push({ user_id: result.id, meet_option_id: data });
        });
        let meetingopt = await UserMeetOptions.bulkCreate(obj);
        // console.log("meetingopt", meetingopt);
      }

      // interest | UserMeetOptions
      if (reqParam.interest) {
        let obj = [];
        reqParam.interest.forEach((data) => {
          obj.push({ user_id: result.id, interest_id: data });
        });
        let userintererst = await UserInterest.bulkCreate(obj);
        // console.log("userintererst", userintererst);
      }

      // extra pictures
      if (reqParam.pictures && reqParam.pictures.length) {
        let picturesArray = [];
        let imageName;
        for (let index = 0; index < reqParam.pictures.length; index++) {
          const element = reqParam.pictures[index];
          element.originalFilename = element.originalFilename
            .split(" ")
            .join("-");
          imageName = `${
            element.originalFilename.split(".")[0]
          }${moment().unix()}${path.extname(element.originalFilename)}`;
          imageName = await Helper.ImageUpload(
            element.filepath,
            res,
            imageName
          );
          picturesArray.push({
            user_id: result.id,
            picture_path: imageName,
          });
        }

        await UserPictures.bulkCreate(picturesArray);
      }

      // console.log("heloooo", reqParam['role']);

      if (reqParam["role"] != USER_ROLES.CORPORATE_USER) {
        // assign free subsciption plan to the user
        let subscriptionDetails = await Subscription.findOne({
          where: {
            role: result.role,
            type: SUBSCRIPTION_TYPE.FREE,
          },
          include: {
            model: SubscriptionPackage,
          },
        });
        // assign free plan to the user
        if (subscriptionDetails) {
          let planObj = {
            user_id: result.id,
            subscription_id: subscriptionDetails.id,
            subscription_package_id:
              subscriptionDetails.SubscriptionPackages[0].id,
            expiry_date: moment().add(
              subscriptionDetails.SubscriptionPackages[0].days,
              "days"
            ),
            assigned_by_admin: NO,
            transaction_id: null,
            in_app_console_plan_id: null,
            active: YES,
            extended_days: 0,
          };
          console.log("planObj", planObj);
          await SubscribedUser.create(planObj);
        }

        if (referredUserDetails) {
          console.log("referredUserDetailsAvail", referredUserDetails);
          // referredUserDetails
          let details = await SubscribedUser.findOne({
            where: { active: YES, user_id: referredUserDetails.id },
          });

          if (details) {
            console.log("INSIDEDETAILS", details);
            console.log(
              "staticData",
              await Helper.GET_STATIC_DATA(
                STATIC_DATA_KEYS.INVITED_BY_USER_PERIOD_EXTENSION_TIME
              )
            );
            details.extended_days =
              details.extended_days +
              Number(
                await Helper.GET_STATIC_DATA(
                  STATIC_DATA_KEYS.INVITED_BY_USER_PERIOD_EXTENSION_TIME
                )
              );
            await details.save();
          }
        }
      }

      await module.exports.notifyMatchingUsers(result);

      return Response.successResponseData(
        res,
        result,
        res.__("User added successfully")
      );
    } catch (error) {
      console.log("errorencountered", error);
      return Response.errorResponseWithoutData(
        res,
        res.__("Something went wrong")
      );
    }
  },

  notifyMatchingUsers: async (userDetails) => {
    console.log("insidenotifiiiiymatchinguser", userDetails);
    try {
      let createdUser = await User.findByPk(userDetails.id, {
        include: [
          {
            model: Interest,
            through: { attributes: [] },
            require: false,
          },
          {
            model: MeetOptions,
            through: { attributes: [] },
            require: false,
          },
          {
            model: AgeGroup,
            as: "ageGroup",
            through: { attributes: [] },
            require: false,
          },
        ],
      });

      const allInterestsOfCurrentUser = pluck(createdUser.Interests, "id");
      const allMeetingOptionsOfCurrentUser = pluck(
        createdUser.MeetOptions,
        "id"
      );
      const allSelectedAgeGroupOptions = pluck(createdUser.ageGroup, "id");

      // console.log("allInterestsOfCurrentUser", allInterestsOfCurrentUser);
      // console.log("allMeetingOptionsOfCurrentUser", allMeetingOptionsOfCurrentUser);
      // console.log("allSelectedAgeGroupOptions", allSelectedAgeGroupOptions);

      // console.log("createdUser.id", createdUser.id, typeof createdUser.id);

      const matchingUsers = await User.findAll({
        where: {
          id: {
            [Op.ne]: createdUser.id,
          },
        },
        include: [
          {
            model: Interest,
            where: {
              id: { [Op.in]: allInterestsOfCurrentUser },
            },
          },
          {
            model: MeetOptions,
            where: {
              id: { [Op.in]: allMeetingOptionsOfCurrentUser },
            },
          },
          {
            model: AgeGroup,
            as: "ageGroup",
            through: { attributes: [] },
            where: {
              id: { [Op.in]: allSelectedAgeGroupOptions },
            },
          },
        ],
      });

      let notfMatchingUserData = [];
      let fcmTokens = [];
      let userMails = [];
      matchingUsers.forEach((user) => {
        if (user.email !== null) {
          userMails.push(user.email);
        }

        if (user.fcm_token !== null) {
          fcmTokens.push(user.fcm_token);
          notfMatchingUserData.push({
            title: "Match found!",
            content: `${userDetails.first_name} is a match`,
            user_id: user.id,
            json_data: JSON.stringify(new Array({ user_id: user.id })),
            is_read: false,
          });
        }
      });

      // console.log("notfMatchingUserData", notfMatchingUserData);

      if (userMails.length > 0) {
        const locals = {
          appName: Helper.AppName,
          match_name: userDetails.first_name,
        };
        const mail = Mailer.sendMail(
          userMails,
          MAIL_SUBJECT.MATCH_FOUND,
          Helper.matchFound,
          locals
        );
      }

      if (notfMatchingUserData.length > 0) {
        let notification = {
          title: "Match found!",
          message: `${userDetails.first_name} is a match`,
        };
        Helper.pushNotification(notification, fcmTokens);
      }
    } catch (error) {
      console.log("error=>", error);
    }
  },

  logIn: async (req, res) => {
    const reqParam = req.body;
    const reqObj = {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    };

    const schema = Joi.object(reqObj);
    const { error } = schema.validate(reqParam);
    if (error) {
      console.log(error);
      return Response.validationErrorResponseData(
        res,
        res.__(`${error.details[0].message}`)
      );
    } else {
      let userDetails = await User.findOne({
        where: {
          email: reqParam.email,
        },
      });

      if (!userDetails) {
        return Response.errorResponseWithoutData(
          res,
          res.locals.__("Email doesn't Exist")
        );
      }

      if (userDetails.status == BLOCKED) {
        return Response.errorResponseWithoutData(
          res,
          res.locals.__("User is blocked .")
        );
      }

      if (userDetails.status == DELETE) {
        return Response.errorResponseWithoutData(
          res,
          res.locals.__("Deleted user")
        );
      }

      // campare password for truthness
      bcrypt.compare(
        reqParam.password,
        userDetails.password,
        async (err, result) => {
          if (err) {
            return Response.errorResponseWithoutData(
              res,
              res.locals.__("Some error occured")
            );
          }

          if (!result) {
            return Response.errorResponseWithoutData(
              res,
              res.locals.__("Email and Password doesn't match.")
            );
          }

          const token = JwtToken.issueUser({
            id: userDetails.id,
            email: userDetails.email,
            role: userDetails.role,
          });

          userDetails.reset_token = token;
          if (userDetails.role == USER_ROLES.VENUE && userDetails.status == 0) {
            userDetails.status = ACTIVE;
            // await userDetails.save()
          }

          userDetails.save().then(
            async (updateData) => {
              if (updateData) {
                console.log();
                return Response.successResponseData(
                  res,
                  updateData,
                  res.locals.__("Logged in successfully")
                );
              } else {
                return Response.errorResponseData(
                  res,
                  res.__("Something went wrong")
                );
              }
            },
            (e) => {
              console.log("error : ", e);
              Response.errorResponseData(res, res.__("Something went wrong"));
            }
          );
          return null;
        }
      );
    }
  },

  socialLogin: async (req, res) => {
    const reqParam = req.body;
    const reqObj = {
      social_login_type: Joi.number()
        .valid(...Object.values(SOCIAL_LOGIN_TYPE))
        .required(),
      first_name: Joi.string().trim(),
      last_name: Joi.string().trim(),
      email: Joi.string().email().optional(),
      social_login_id: Joi.string().required(),
      role: Joi.string()
        .valid(...Object.values(USER_ROLES))
        .optional(),
      profile_picture: Joi.string().optional(),
    };

    const schema = Joi.object(reqObj);
    const { error } = schema.validate(reqParam);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(`${error.details[0].message}`)
      );
    } else {
      whereOptions = {
        social_login_id: reqParam.social_login_id,
        status: {
          [Op.ne]: BLOCKED,
        },
      };

      if (reqParam.email) {
        whereOptions["email"] = reqParam.email;
      }

      console.log("reqParam.social_login_id : ", reqParam.social_login_id);

      let userDetails = await User.findOne({ where: whereOptions });

      try {
        // login
        if (userDetails) {
          console.log(userDetails);
          const token = JwtToken.issueUser({
            id: userDetails.id,
            email: userDetails.email,
            role: userDetails.role,
          });

          userDetails.reset_token = token;
          userDetails.save().then(
            async (updateData) => {
              if (updateData) {
                updateData = {
                  id: updateData.id,
                  first_name: updateData.first_name,
                  last_name: updateData.last_name,
                  email: updateData.email,
                  status: updateData.status,
                  reset_token: updateData.reset_token,
                  profile_picture: updateData.profile_picture,
                  role: updateData.role,
                };
                return Response.successResponseData(
                  res,
                  updateData,
                  res.locals.__("Logged in successfully")
                );
              } else {
                return Response.errorResponseData(
                  res,
                  res.__("Something went wrong")
                );
              }
            },
            (e) => {
              return Response.errorResponseData(
                res,
                res.__("Something went wrong"),
                INTERNAL_SERVER
              );
            }
          );
        }
        // create the user
        else {
          if (!(reqParam.email && reqParam.name)) {
            return Response.errorResponseData(
              res,
              res.__("Email Or Name missing")
            );
          }

          let emailExistData = await User.findOne({
            where: {
              email: reqParam.email,
            },
          });

          // if email already exists
          if (emailExistData) {
            const token = JwtToken.issueUser({
              id: emailExistData.id,
              email: emailExistData.email,
              role: reqParam.role,
            });
            emailExistData.reset_token = token;
            const updateObj = {
              social_login_id: reqParam.social_login_id,
              social_login_type: reqParam.social_login_type,
              reset_token: token,
              email_verified: YES,
              profile_picture: reqParam.profile_picture,
            };
            await emailExistData
              .update(updateObj, { where: { email: reqParam.email } })
              .catch((error) => {
                console.log(" Error in Updating user details ", error);
              });
            var data = {
              id: emailExistData.id,
              email: emailExistData.email,
              token: token,
              role: emailExistData.role,
              profile_picture: emailExistData.profile_picture,
              status: emailExistData.status,
              first_name: emailExistData.first_name,
              last_name: emailExistData.last_name,
            };
            return Response.successResponseData(
              res,
              data,
              res.locals.__("Logged in successfully.")
            );
          }

          if (!reqParam.role) {
            return Response.errorResponseData(res, res.__("Role is missing"));
          }

          console.log(" :: into the controller :: ", emailExistData);

          const reqObj = {
            email: reqParam.email,
            first_name: reqParam.first_name,
            last_name: reqParam.last_name,
            status: ACTIVE,
            email_verified: YES,
            social_login_id: reqParam.social_login_id,
            social_login_type: reqParam.social_login_type,
            profile_picture: reqParam.profile_picture
              ? reqParam.profile_picture
              : null,
            role: reqParam.role,
          };
          await User.create(reqObj)
            .then(async (result) => {
              if (result) {
                const token = JwtToken.issueUser({
                  id: result.id,
                  email: result.email,
                  role: result.role,
                });
                result.reset_token = token;
                result
                  .save()

                  .then(
                    async (updateData) => {
                      if (updateData) {
                        updateData = {
                          id: updateData.id,
                          first_name: updateData.first_name,
                          last_name: updateData.last_name,
                          email: updateData.email,
                          status: updateData.status,
                          reset_token: updateData.reset_token,
                          profile_picture: updateData.profile_picture,
                          role: updateData.role,
                        };

                        return Response.successResponseData(
                          res,
                          updateData,
                          res.locals.__("User Added Successfully")
                        );
                      } else {
                        return Response.errorResponseData(
                          res,
                          res.__("Something went wrong")
                        );
                      }
                    },
                    (e) => {
                      console.log("error ", e);
                      Response.errorResponseData(
                        res,
                        res.__("Something went wrong")
                      );
                    }
                  );
              }
            })
            .catch((e) => {
              console.log("enter", e);
              return Response.errorResponseData(
                res,
                res.__("Something went wrong")
              );
            });
          //end else
        }
      } catch (error) {
        console.log("error ", error);
        return Response.errorResponseWithoutData(
          res,
          res.__("Something went wrong")
        );
      }
    }
  },

  userProfile: async (req, res) => {
    try {
      // console.log("userProfilehittt", req.authUserId);
      let { authUserId } = req;
      const { user_id } = req.query;

      user_id ? (authUserId = user_id) : null;

      let userDetails = await User.findByPk(authUserId, {
        attributes: [
          "id",
          "first_name",
          "last_name",
          "email",
          "password",
          "country_id",
          "state_id",
          "city_id",
          "gender",
          "profile_picture",
          "social_login_type",
          "social_login_id",
          "dob",
          "reset_token",
          "email_verified",
          "status",
          "fcm_token",
          "facebook_id",
          "instagram_id",
          "twitter_id",
          "linkedIn_id",
          "referral_code",
          "referred_by",
          "role",
          "about_me",
          "mobile_no",
          "current_location",
          "company_logo",
          "company_website",
          "company_domain",
          "meet_for_coffee",
          "meet_for_coffee_updatedAt",
          "match_distance",
          "latitude",
          "longitude",
          "createdAt",
          "updatedAt",
          "deletedAt",
          [
            sequelize.literal(`
              (
                SELECT COUNT(*)
                FROM user_follower
                WHERE
                  user_follower.user_id = ${authUserId} AND
                  NOT EXISTS (
                    SELECT *
                    FROM block_user
                    WHERE
                      block_user.user_id = ${authUserId} AND
                      block_user.blocked_user_id = user_follower.followed_to OR
                      block_user.user_id = user_follower.followed_to AND
                      block_user.blocked_user_id = ${authUserId}
                  )
              )
            `),
            "followingCount",
          ],
          [
            sequelize.literal(`
              (
                SELECT COUNT(*)
                FROM user_follower
                WHERE
                  user_follower.followed_to = ${authUserId} AND
                  NOT EXISTS (
                    SELECT *
                    FROM block_user
                    WHERE
                      block_user.user_id = user_follower.user_id AND
                      block_user.blocked_user_id = ${authUserId} OR
                      block_user.user_id = ${authUserId} AND
                      block_user.blocked_user_id =  user_follower.user_id
                  )
              )
            `),
            "followersCount",
          ],
        ],
        include: [
          {
            model: Interest,
            through: { attributes: [] },
          },
          {
            model: SexualOrientation,
            through: { attributes: [] },
          },
          {
            model: MeetOptions,
            through: { attributes: [] },
          },
          {
            model: UserPictures,
          },
          {
            model: UserFollower,
            as: "followers",
            //If I am a logged in user and i have entered id of other user so I want to see wheater I have followed him or not
            where: { user_id: req.authUserId },
            required: false,
          },
          {
            model: SubscribedUser,
            where: {
              user_id: authUserId,
              active: "Y",
              [Op.and]: [
                sequelize.literal(
                  `DATE_ADD(expiry_date, INTERVAL extended_days DAY) > NOW()`
                ),
              ],
            },
            required: false,
          },
          // {
          // 	model : AgeGroup,
          // 	as : 'userItselfAgeGroup',
          // 	through : { attributes:[]},
          // }
          {
            model: AgeGroup,
            as: "ageGroup",
            through: { attributes: [] },
          },
        ],
      });

      if (!userDetails) {
        console.log("userDetails not found");
        return Response.successResponseWithoutData(
          res,
          res.__("No user found"),
          NOT_FOUND
        );
      }

      return Response.successResponseData(
        res,
        userDetails,
        res.__("User details found successfully")
      );
    } catch (error) {
      console.log("errorEncountered=>", error);
      return res.send(error);
      // return Response.errorResponseData(res, res.__('Something went wrong'));
    }
  },

  recordProfileView: async (req, res) => {
    try {
      const currentTime = new Date();
      const twentyFourHoursAgo = new Date(currentTime - 24 * 60 * 60 * 1000);

      const { authUserId } = req;
      const { viewed_user_id } = req.body;

      const existingView = await Profile_View.findOne({
        where: {
          user_id: authUserId,
          viewed_user_id: viewed_user_id,
          createdAt: {
            [Op.gte]: twentyFourHoursAgo,
          },
        },
      });
      if (existingView) {
        // Update the existing view's timestamp to the current time
        existingView.updatedAt = currentTime;
        await existingView.save();
      } else {
        // Create a new record
        await Profile_View.create({
          user_id: authUserId,
          viewed_user_id: viewed_user_id,
        });
      }
      // Now we have to implement send notification
      res
        .status(200)
        .json({ message: "Profile view recorded successfully", existingView });
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // not complete api
  getProfileViews: async (req, res) => {
    const { authUserId } = req;
    try {
      const currentTime = new Date();
      const twentyFourHoursAgo = new Date(currentTime - 24 * 60 * 60 * 1000); // 24 hours ago

      // Query the database for profile views within the time frame
    const profileViews = await ProfileView.findAll({
      where: {
        user_id: authUserId,
        createdAt: {
          [Op.gte]: twentyFourHoursAgo,
        },
      },
      order: [['createdAt', 'DESC']], // Optional: Order the results by timestamp
    });
    res.status(200).json({ profileViews });
    
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  editUserProfile: async (req, res) => {
    // creating new transaction
    const editTransaction = await sequelize.transaction();

    // combining the multimedia and the body content to validate together
    const reqParam = { ...req.body, ...req.files };

    const { authUserId } = req;
    // removing the duplicates from array

    // reqParam.interest
    //   ? (reqParam.interest = [...new Set(JSON.parse(reqParam.interest))])
    //   : null;

    if (reqParam.interest && typeof reqParam.interest === "string") {
      try {
        reqParam.interest = JSON.parse(reqParam.interest);
        reqParam.interest
          ? (reqParam.interest = [...new Set(reqParam.interest)])
          : null;
      } catch (error) {
        console.error("Invalid JSON format for 'interest'.", error);
      }
    }

    // reqParam.meeting_option
    //   ? (reqParam.meeting_option = [
    //     ...new Set(JSON.parse(reqParam.meeting_option)),
    //   ])
    //   : null;

    if (
      reqParam.meeting_option &&
      typeof reqParam.meeting_option === "string"
    ) {
      try {
        reqParam.meeting_option = JSON.parse(reqParam.meeting_option);
        reqParam.meeting_option
          ? (reqParam.meeting_option = [...new Set(reqParam.meeting_option)])
          : null;
      } catch (error) {
        console.error("Invalid JSON format for 'interest'.", error);
      }
    }

    // reqParam.orientation
    //   ? (reqParam.orientation = [...new Set(JSON.parse(reqParam.orientation))])
    //   : null;

    if (reqParam.orientation && typeof reqParam.orientation === "string") {
      try {
        reqParam.orientation = JSON.parse(reqParam.orientation);
        reqParam.orientation
          ? (reqParam.orientation = [...new Set(reqParam.orientation)])
          : null;
      } catch (error) {
        console.error("Invalid JSON format for 'orientation'.", error);
      }
    }

    const reqObj = {
      first_name: Joi.string().trim().max(50).label("First name"),
      last_name: Joi.string().trim().max(50).label("Last name"),
      gender: Joi.string()
        .valid(...Object.values(GENDER))
        .label("Gender"),
      dob: Joi.date().format("YYYY-MM-DD").label("Date of birth"),
      mobile_no: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .options({
          messages: {
            "string.pattern.base":
              'Phone number "{#value}" is invalid. Please enter a 10-digit phone number without any spaces or special characters.',
          },
        }),
      about_me: Joi.string().label("About"),

      profile_picture: Joi.object({
        mimetype: Joi.string()
          .valid(...Object.values(IMAGE_FORMAT))
          .required(),
        originalFilename: Joi.string().required(),
        size: Joi.number().min(1).required(),
      }).unknown(),
      language_id: Joi.number(),
      nationality_id: Joi.number(),

      company_logo: Joi.object({
        mimetype: Joi.string()
          .valid(...Object.values(IMAGE_FORMAT))
          .required(),
        originalFilename: Joi.string().required(),
        size: Joi.number().min(1).required(),
      }).unknown(),

      facebook_id: Joi.string()
        .uri()
        .label("Facebook profile link")
        .allow(null, ""),
      instagram_id: Joi.string()
        .uri()
        .label("Instagram profile link")
        .allow(null, ""),
      twitter_id: Joi.string()
        .uri()
        .label("Twitter profile link")
        .allow(null, ""),
      linkedIn_id: Joi.string()
        .uri()
        .label("LinkedIn profile link")
        .allow(null, ""),

      orientation: Joi.array()
        .items(Joi.number().integer())
        .label("Orientation"),
      meeting_option: Joi.array()
        .items(Joi.number().integer())
        .label("Meeting options"),
      interest: Joi.array()
        .items(Joi.number().integer())
        .max(10)
        .min(1)
        .label("Interest"),

      user_own_age_group: Joi.number().integer().label('User"s own age group'),
    };

    const schema = Joi.object(reqObj);
    const { error } = schema.validate(reqParam);
    if (error) {
      console.log(" error ", error.details[0].message);
      return Response.validationErrorResponseData(
        res,
        res.__(error.details[0].message)
      );
    }

    try {
      let data = await User.findByPk(authUserId);

      if (!data) {
        return Response.successResponseWithoutData(
          res,
          res.__("No user details found"),
          NOT_FOUND
        );
      }

      let imageName;
      let companyLogoName;
      if (reqParam.profile_picture) {
        if (data.profile_picture !== null) {
          Helper.RemoveImage(res, data.profile_picture);
        }
        reqParam.profile_picture.originalFilename =
          reqParam.profile_picture.originalFilename.split(" ").join("-");
        imageName = `${
          reqParam.profile_picture.originalFilename.split(".")[0]
        }${moment().unix()}${path.extname(
          reqParam.profile_picture.originalFilename
        )}`;
        imageName = await Helper.ImageUpload(
          reqParam.profile_picture.filepath,
          res,
          imageName
        );
      }

      if (reqParam.company_logo && data.role == "CO") {
        if (data.company_logo) {
          Helper.RemoveImage(res, data.company_logo);
        }
        reqParam.company_logo.originalFilename =
          reqParam.company_logo.originalFilename.split(" ").join("-");
        companyLogoName = `${
          reqParam.company_logo.originalFilename.split(".")[0]
        }${moment().unix()}${path.extname(
          reqParam.company_logo.originalFilename
        )}`;
        companyLogoName = await Helper.ImageUpload(
          reqParam.company_logo.filepath,
          res,
          companyLogoName
        );
      }

      reqParam.first_name
        ? (data.first_name = reqParam.first_name)
        : (data.first_name = data.first_name);
      reqParam.last_name
        ? (data.last_name = reqParam.last_name)
        : (data.last_name = data.last_name);
      reqParam.gender
        ? (data.gender = reqParam.gender)
        : (data.gender = data.gender);
      reqParam.dob ? (data.dob = reqParam.dob) : (data.dob = data.dob);
      reqParam.mobile_no
        ? (data.mobile_no = reqParam.mobile_no)
        : (data.mobile_no = data.mobile_no);
      reqParam.about_me
        ? (data.about_me = reqParam.about_me)
        : (data.about_me = data.about_me);
      imageName
        ? (data.profile_picture = imageName)
        : (data.profile_picture = data.profile_picture);
      companyLogoName
        ? (data.company_logo = companyLogoName)
        : (data.company_logo = data.company_logo);
      reqParam.facebook_id
        ? (data.facebook_id = reqParam.facebook_id)
        : (data.facebook_id = data.facebook_id);
      reqParam.instagram_id
        ? (data.instagram_id = reqParam.instagram_id)
        : (data.instagram_id = data.instagram_id);
      reqParam.twitter_id
        ? (data.twitter_id = reqParam.twitter_id)
        : (data.twitter_id = data.twitter_id);
      reqParam.linkedIn_id
        ? (data.linkedIn_id = reqParam.linkedIn_id)
        : (data.linkedIn_id = data.linkedIn_id);
      reqParam.language_id
        ? (data.language_id = reqParam.language_id)
        : (data.language_id = data.language_id);
      reqParam.nationality_id
        ? (data.nationality_id = reqParam.nationality_id)
        : (data.nationality_id = data.nationality_id);

      //if corp user and un_verified (created by entering only profile) so we will show him the screens to update his profile and set his status to active so that he does not get those screens when he logs in again
      data.status = data.status == 3 && data.role == "COU" ? 1 : data.status;

      // updating user details with the transaction in place
      await data.save({ transaction: editTransaction });

      // orientation | UserSexualOrientation
      if (reqParam.orientation) {
        await UserSexualOrientation.destroy(
          { where: { user_id: authUserId } },
          { transaction: editTransaction }
        );
        let obj = [];
        reqParam.orientation.forEach((data) => {
          obj.push({ user_id: authUserId, sexual_orientation_id: data });
        });
        await UserSexualOrientation.bulkCreate(obj, {
          transaction: editTransaction,
        });
      }

      // meeting_option | UserMeetOptions
      if (reqParam.meeting_option) {
        await UserMeetOptions.destroy(
          { where: { user_id: authUserId } },
          { transaction: editTransaction }
        );
        let obj = [];
        reqParam.meeting_option.forEach((data) => {
          obj.push({ user_id: authUserId, meet_option_id: data });
        });
        await UserMeetOptions.bulkCreate(obj, { transaction: editTransaction });
      }

      // interest | UserMeetOptions
      if (reqParam.interest) {
        await UserInterest.destroy(
          { where: { user_id: authUserId } },
          { transaction: editTransaction }
        );
        let obj = [];
        reqParam.interest.forEach((data) => {
          obj.push({ user_id: authUserId, interest_id: data });
        });
        await UserInterest.bulkCreate(obj, { transaction: editTransaction });
      }

      // user itself age group
      if (reqParam.user_own_age_group) {
        let userData = await UserItselfAgeGroup.findOne({
          where: { user_id: authUserId },
        });
        if (userData) {
          (userData.age_group_id = reqParam.user_own_age_group),
            await userData.save();
        } else {
          await UserItselfAgeGroup.create({
            user_id: result.id,
            age_group_id: reqParam.age_group,
          });
        }
      }

      // commit if everything worked fine
      await editTransaction.commit();

      // fetching all updated details
      data = await User.findByPk(authUserId, {
        include: [
          { model: Interest, through: { attributes: [] } },
          { model: MeetOptions, through: { attributes: [] } },
          { model: SexualOrientation, through: { attributes: [] } },
          // {model : AgeGroup,as : 'userItselfAgeGroup',through : { attributes:[]},}
        ],
      });

      return Response.successResponseData(
        res,
        data,
        res.__("User details Updated successfully")
      );
    } catch (error) {
      await editTransaction.rollback();
      console.log("errorEncountered", error);
      return Response.errorResponseData(res, res.__("Something went wrong"));
    }
  },

  addUserPictures: async (req, res) => {
    const { authUserId } = req;
    const reqParam = req.files;

    reqParam.pictures.length ? null : (reqParam.pictures = [reqParam.pictures]);

    let userPictureLimit = Number(
      await Helper.GET_STATIC_DATA(STATIC_DATA_KEYS.USER_PICTURE_LIMIT)
    );

    const reqObj = {
      pictures: Joi.array()
        .items(
          Joi.object({
            mimetype: Joi.string()
              .valid(...Object.values(IMAGE_FORMAT))
              .required(),
            originalFilename: Joi.string().required(),
            size: Joi.number().min(1).required(),
          })
            .required()
            .unknown()
        )
        .max(userPictureLimit)
        .min(1),
    };
    const schema = Joi.object(reqObj);
    const { error } = schema.validate(reqParam);
    // bad request error generation
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(`${error.details[0].message}`)
      );
    }

    let noOfImagesAlreadyExist = await UserPictures.count({
      where: { user_id: authUserId },
    });
    if (noOfImagesAlreadyExist >= userPictureLimit) {
      return Response.errorResponseWithoutData(
        res,
        res.__(
          `You have reached the maximum limit of pictures addition. Only ${userPictureLimit} pictures can be added .`
        )
      );
    }

    let remainingImageLimit = userPictureLimit - noOfImagesAlreadyExist;
    if (remainingImageLimit < reqParam.pictures.length) {
      return Response.errorResponseWithoutData(
        res,
        res.__(
          `Only ${remainingImageLimit} pictures can be added , you have already added ${noOfImagesAlreadyExist}.`
        )
      );
    }

    let picturesArray = [];
    let imageName;
    for (let index = 0; index < reqParam.pictures.length; index++) {
      const element = reqParam.pictures[index];
      element.originalFilename = element.originalFilename.split(" ").join("-");
      imageName = `${
        element.originalFilename.split(".")[0]
      }${moment().unix()}${path.extname(element.originalFilename)}`;
      imageName = await Helper.ImageUpload(element.filepath, res, imageName);
      picturesArray.push({
        user_id: authUserId,
        picture_path: imageName,
      });
    }

    await UserPictures.bulkCreate(picturesArray);

    return Response.successResponseWithoutData(
      res,
      res.locals.__("Pictures added successfully.")
    );
  },

  deleteUserImage: async (req, res) => {
    const { authUserId } = req;
    const reqParam = req.body;
    const reqObj = {
      user_picture_id: Joi.array().items(Joi.number()).required().min(1),
    };
    const schema = Joi.object(reqObj);
    const { error } = schema.validate(reqParam);
    // bad request error generation
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(`${error.details[0].message}`)
      );
    }

    try {
      // finding and removing the image from the directory and also from the db
      for (let index = 0; index < reqParam.user_picture_id.length; index++) {
        const picture_id = reqParam.user_picture_id[index];
        let userPictureDetails = await UserPictures.findOne({
          where: {
            id: picture_id,
            user_id: authUserId,
          },
        });

        userPictureDetails
          ? Helper.RemoveImage(res, userPictureDetails.picture_path)
          : null;
        await userPictureDetails.destroy();
      }

      return Response.successResponseWithoutData(
        res,
        res.__("Image deleted Successfully")
      );
    } catch (error) {
      console.log("err :: ", error);
      return Response.errorResponseWithoutData(
        res,
        res.__("Something went wrong")
      );
    }
  },

  changePassword: async (req, res, next) => {
    const reqParam = req.body;
    const { authUserId } = req;
    const reqObj = {
      previous_password: Joi.string().required(),
      password: Joi.string().required(),
      confirm_password: Joi.string()
        .required()
        .valid(Joi.ref("password"))
        .required(),
    };
    const schema = Joi.object(reqObj);
    const { error } = schema.validate(reqParam);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(`${error.details[0].message}`)
      );
    } else {
      let userData = await User.findByPk(authUserId);
      if (!userData) {
        return Response.errorResponseWithoutData(
          res,
          res.locals.__("User doesn't exist")
        );
      } else {
        bcrypt.compare(
          reqParam.previous_password,
          userData.password,
          async (err, result) => {
            if (err) {
              return Response.errorResponseWithoutData(
                res,
                res.locals.__("Some error occured")
              );
            }
            if (result) {
              const passwordHash = bcrypt.hashSync(reqParam.password, 10);
              await userData.update({
                password: passwordHash,
              });

              return Response.successResponseWithoutData(
                res,
                res.locals.__("Password updated successfully"),
                SUCCESS
              );
            } else {
              Response.errorResponseWithoutData(
                res,
                res.locals.__("Previous password is incorrect")
              );
            }
          }
        );
      }
    }
  },

  forgotPassword: async (req, res) => {
    const reqParam = req.body;
    const schema = Joi.object({
      email: Joi.string().trim().email().max(150).required(),
    });
    const { error } = schema.validate(reqParam);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(`${error.details[0].message}`)
      );
    } else {
      let user = await User.findOne({
        where: {
          email: reqParam.email.toLowerCase(),
          status: {
            [Op.and]: {
              [Op.ne]: BLOCKED,
              [Op.ne]: DELETE,
            },
          },
        },
      });

      try {
        if (user) {
          const minutesLater = new Date();
          const restTokenExpire = minutesLater.setMinutes(
            minutesLater.getMinutes() + 20
          );
          const otp = Helper.makeRandomNumber(6);
          const updatedUser = {
            otp: otp,
            otp_type: OTP_TYPE.FORGOT_PASSWORD,
            otp_expiry: restTokenExpire,
            email: reqParam.email,
            user_id: user.id,
          };

          await UserOtp.create(updatedUser).then(
            async (result) => {
              if (!result) {
                return Response.errorResponseWithoutData(
                  res,
                  res.locals.__("Something went wrong")
                );
              } else {
                const locals = {
                  username: user.first_name,
                  appName: Helper.AppName,
                  otp,
                };
                try {
                  console.log(":::checking:::");
                  console.log(
                    reqParam.email,
                    "Forgot Password!",
                    Helper.forgotPassword,
                    locals
                  );
                  const mail = Mailer.sendMail(
                    reqParam.email,
                    MAIL_SUBJECT.FORGOT_PASSWORD,
                    Helper.forgotPassword,
                    locals
                  );
                  if (mail) {
                    return Response.successResponseWithoutData(
                      res,
                      res.locals.__("Forgot password email send successfully"),
                      SUCCESS
                    );
                  } else {
                    return Response.errorResponseWithoutData(
                      res,
                      res.locals.__("Error while sending mail"),
                      INTERNAL_SERVER
                    );
                  }
                } catch (e) {
                  console.log(e);
                  return Response.errorResponseWithoutData(
                    res,
                    res.__("Something went wrong"),
                    INTERNAL_SERVER
                  );
                }
              }
              return null;
            },
            (e) => {
              console.log(e);
              Response.errorResponseWithoutData(
                res,
                res.__("Something went wrong"),
                INTERNAL_SERVER
              );
            }
          );
        } else {
          Response.errorResponseWithoutData(
            res,
            res.locals.__("Email not exist or the user is blocked"),
            NOT_FOUND
          );
        }
      } catch (error) {
        console.log("error : ", error);
        Response.errorResponseWithoutData(
          res,
          res.__("Something went wrong"),
          INTERNAL_SERVER
        );
      }
    }
  },

  //otp verify after forget password
  verifyOtp: async (req, res, next) => {
    try {
      const reqParam = req.body;
      const reqObj = {
        otp: Joi.string().required(),
        email: Joi.string().email().required(),
      };
      const schema = Joi.object(reqObj);

      const { error } = schema.validate(reqParam);
      if (error) {
        return Response.validationErrorResponseData(
          res,
          res.__(`${error.details[0].message}`)
        );
      } else {
        const isOtpExist = await UserOtp.findOne({
          where: {
            email: reqParam.email,
            otp_expiry: {
              [Op.gte]: new Date(),
            },
          },
          order: [["createdAt", "DESC"]],
        });

        if (!isOtpExist || isOtpExist["otp"] != reqParam.otp) {
          return Response.errorResponseWithoutData(
            res,
            res.locals.__("Otp not found or expired")
          );
        }

        return Response.successResponseWithoutData(
          res,
          res.locals.__("Otp verified successfully"),
          SUCCESS
        );
      }
    } catch (error) {
      console.log("error=>", error);
    }
  },

  resetPassword: async (req, res) => {
    const reqParam = req.body;
    const reqObj = {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      confirm_password: Joi.any()
        .valid(Joi.ref("password"))
        .required()
        .messages({
          "any.only": '"Confirm Password" does not match password',
          "any.required": '"Confirm Password" is required',
        }),
    };
    const schema = Joi.object(reqObj);
    const { error } = schema.validate(reqParam);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(`${error.details[0].message}`)
      );
    } else {
      const userEmailExist = await User.findOne({
        where: {
          email: reqParam.email,
          status: {
            [Op.not]: DELETE,
          },
        },
      }).then((userEmailData) => userEmailData);

      if (userEmailExist) {
        const passwordHash = bcrypt.hashSync(reqParam.password, 10);
        await User.update(
          { password: passwordHash },
          {
            where: {
              id: userEmailExist.id,
            },
          }
        )
          .then(async (result) => {
            if (result) {
              console.log("result", result);
              return Response.successResponseWithoutData(
                res,
                res.locals.__("Password Reset successfully"),
                SUCCESS
              );
            }
          })
          .catch((e) => {
            console.log(":::: errro :: ., ", e);
            return Response.errorResponseData(
              res,
              res.__("Something went wrong")
            );
          });
      } else {
        return Response.errorResponseData(res, res.__("Email does not exist"));
      }
    }
  },

  deleteUser: async (req, res) => {
    const { authUserId } = req;

    let userInfo = await User.findByPk(authUserId, {
      where: {
        status: {
          [Op.not]: DELETE,
        },
      },
    });

    if (!userInfo)
      return Response.errorResponseWithoutData(
        res,
        res.__(`No User details found or account already deleted!`)
      );

    try {
      userInfo.status = DELETE;
      await userInfo.save();
      await userInfo.destroy();
      return Response.successResponseWithoutData(
        res,
        res.__(`User deleted successfully !`)
      );
    } catch (error) {
      console.log(" :: error :: ", error);
      return Response.errorResponseWithoutData(
        res,
        res.__(`Something went wrong !`)
      );
    }
  },

  addFcmToken: async (req, res) => {
    const reqParam = req.body;
    const { authUserId } = req;
    const schema = Joi.object({
      fcm_token: Joi.string().required().allow(null, ""),
    });
    const { error } = schema.validate(reqParam);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(`${error.details[0].message}`)
      );
    } else {
      let userData = await User.findOne({
        where: {
          id: authUserId,
          status: {
            [Op.not]: BLOCKED,
          },
        },
      });

      try {
        if (userData) {
          userData.fcm_token = (await reqParam.fcm_token)
            ? reqParam.fcm_token
            : null;
          userData
            .save()
            .then(async (result) => {
              if (result) {
                Response.successResponseWithoutData(
                  res,
                  res.__("Fcm token added"),
                  SUCCESS
                );
              }
            })
            .catch(async () => {
              Response.errorResponseData(
                res,
                res.__("Something went wrong"),
                INTERNAL_SERVER
              );
            });
        } else {
          return Response.successResponseWithoutData(
            res,
            res.locals.__("User not available"),
            NOT_FOUND
          );
        }
      } catch (error) {
        console.log("error : ", error);
        return Response.errorResponseWithoutData(
          res,
          res.__("Something went wrong")
        );
      }
    }
  },

  getAllAvailableMeetingOptions: async (req, res) => {
    const { page, sortBy, name } = req.query;

    let limit = 0;
    if (page) limit = PER_PAGE_LIMIT;
    const pageNo = page && page > 0 ? parseInt(page, 10) : 26;

    const offset = (pageNo - 1) * limit;
    let sorting = [["name", sortBy ? sortBy : "ASC"]];

    let options = {
      where: {},
      order: sorting,
      offset: offset,
    };

    if (limit) options["limit"] = limit;

    if (name) {
      options["where"]["name"] = {
        [Op.like]: `%${name}%`,
      };
    }

    try {
      let data = await MeetOptions.findAndCountAll(options);
      if (data.rows.length > 0) {
        return Response.successResponseData(
          res,
          data,
          res.locals.__("Success")
        );
      } else {
        return Response.errorResponseData(
          res,
          res.locals.__("No Meeting Options found"),
          data,
          NOT_FOUND
        );
      }
    } catch (error) {
      console.log(": error ", error);
      return Response.errorResponseWithoutData(
        res,
        res.__("Something went wrong"),
        INTERNAL_SERVER
      );
    }
  },

  userSelectMeetingOptions: async (req, res) => {
    const { authUserId } = req;

    const reqParam = req.body;

    reqParam.meet_option_id = [...new Set(reqParam.meet_option_id)];

    const reqObj = {
      meet_option_id: Joi.array()
        .items(Joi.number().integer())
        .min(1)
        .required()
        .label("Meeting Option"),
    };

    // bad request error generation
    const schema = Joi.object(reqObj);
    const { error } = schema.validate(reqParam);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(`${error.details[0].message}`)
      );
    }

    let userMeetOptionsObj = [];
    reqParam.meet_option_id.forEach((interestId) => {
      userMeetOptionsObj.push({
        user_id: authUserId,
        meet_option_id: interestId,
      });
    });

    try {
      await UserMeetOptions.bulkCreate(userMeetOptionsObj, {
        updateOnDuplicate: ["user_id", "meet_option_id"],
      });
      return Response.successResponseWithoutData(
        res,
        res.__("User Meting options added successfully")
      );
    } catch (error) {
      console.log("eerr", err);
      return Response.errorResponseWithoutData(
        res,
        res.__("Something went wrong"),
        INTERNAL_SERVER
      );
    }
  },

  sendOtp: async (req, res) => {
    const reqParam = req.body;
    const { authUserId } = req;

    const isEmailExist = await User.findOne({
      where: {
        id: authUserId,
        status: {
          [Op.not]: BLOCKED,
        },
      },
    });

    if (isEmailExist) {
      const minutesLater = new Date();
      const otp =
        process.env.OTP_TESTING == "1" ? 111111 : Helper.makeRandomNumber(6);

      //Otp will expire after 1 day
      const verifyTokenExpire = minutesLater.setMinutes(
        minutesLater.getMinutes() + 1440
      );
      const updatedUser = {
        otp: otp,
        otp_type: OTP_TYPE.EMAIL,
        otp_expiry: verifyTokenExpire,
        email: isEmailExist.email,
        user_id: isEmailExist.id,
      };
      await UserOtp.create(updatedUser).then(
        async (otpData) => {
          if (!otpData) {
            Response.errorResponseData(
              res,
              res.locals.__("Something went wrong")
            );
          } else {
            const UserData = await User.findByPk(isEmailExist.id);
            const locals = {
              username: UserData.name,
              appName: Helper.AppName,
              otp,
            };
            try {
              const mail = await Mailer.sendMail(
                isEmailExist.email,
                MAIL_SUBJECT.EMAIL_VERIFICATION,
                Helper.sendMailVerificationCode,
                locals
              );
              if (mail) {
                return Response.successResponseWithoutData(
                  res,
                  res.locals.__("Otp sent successfully"),
                  200
                );
              } else {
                return Response.errorResponseWithoutData(
                  res,
                  res.locals.__("Something went wrong")
                );
              }
            } catch (e) {
              console.log(":: error : ", e);
              return Response.errorResponseWithoutData(
                res,
                res.locals.__("Something went wrong")
              );
            }
          }
        },
        (e) => {
          console.log(":: error : ", e);
          return Response.errorResponseWithoutData(
            res,
            res.__("Something went wrong"),
            INTERNAL_SERVER
          );
        }
      );
    } else {
      return Response.errorResponseWithoutData(
        res,
        res.locals.__("Email does not exist"),
        NOT_FOUND
      );
    }
  },

  // verifyEmail: async (req, res) => {
  //   const { authUserId } = req;

  //   const reqParam = req.body;
  //   const reqObj = {
  //     otp: Joi.string().required(),
  //   };

  //   const schema = Joi.object(reqObj);
  //   const { error } = schema.validate(reqParam);
  //   if (error) {
  //     return Response.validationErrorResponseData(
  //       res,
  //       res.__(`${error.details[0].message}`)
  //     );
  //   } else {
  //     let userDetails = await User.findByPk(authUserId);
  //     const isOtpExist = await UserOtp.findOne({
  //       where: {
  //         email: userDetails.email,
  //       },
  //       order: [["createdAt", "DESC"]],
  //     });

  //     console.log("userDetails", isOtpExist.otp);

  //     if (isOtpExist) {
  //       // return res.json(isOtpExist);
  //       if (userDetails && isOtpExist.otp === parseInt(reqParam.otp)) {
  //         await User.update(
  //           { email_verified: YES },
  //           {
  //             where: {
  //               id: userDetails.id,
  //             },
  //           }
  //         )
  //           .then(async (result) => {
  //             if (result) {
  //               return Response.successResponseWithoutData(
  //                 res,
  //                 res.locals.__("User verified successfully"),
  //                 SUCCESS
  //               );
  //             }
  //           })
  //           .catch(() => {
  //             return Response.errorResponseWithoutData(
  //               res,
  //               res.__("Something went wrong")
  //             );
  //           });
  //       } else {
  //         return Response.errorResponseWithoutData(
  //           res,
  //           res.__("Email not exist"),
  //           NOT_FOUND
  //         );
  //       }
  //     } else {
  //       return Response.errorResponseWithoutData(
  //         res,
  //         res.locals.__("Invalid otp")
  //       );
  //     }
  //   }
  // },

  verifyEmail: async (req, res) => {
    try {
      const { authUserId } = req;

      const reqParam = req.body;
      const reqObj = {
        otp: Joi.string().required(),
      };

      const schema = Joi.object(reqObj);
      const { error } = schema.validate(reqParam);

      if (error) {
        return Response.validationErrorResponseData(
          res,
          res.__(`${error.details[0].message}`)
        );
      }

      let userDetails = await User.findByPk(authUserId);

      //check if email is already verified
      if (userDetails["email_verified"] === "Y") {
        return Response.errorResponseWithoutData(
          res,
          "Email is already verified"
        );
      }

      const isOtpExist = await UserOtp.findOne({
        where: {
          email: userDetails.email,
        },
        order: [["createdAt", "DESC"]],
      });

      if (!isOtpExist) {
        return Response.errorResponseWithoutData(
          res,
          res.__("Otp not found"),
          NOT_FOUND
        );
      }

      if (isOtpExist["otp"] !== parseInt(reqParam.otp)) {
        console.log("incorrectotp");
        return Response.errorResponseWithoutData(
          res,
          res.__("Otp is incorrect")
        );
      }

      if (isOtpExist.otp_expiry < Date.now()) {
        console.log("otpexpired");
        return Response.errorResponseWithoutData(res, res.__("Otp is expired"));
      }

      await User.update(
        { email_verified: YES },
        {
          where: {
            id: userDetails.id,
          },
        }
      );

      return Response.successResponseWithoutData(
        res,
        res.locals.__("User verified successfully"),
        SUCCESS
      );
    } catch (error) {
      return Response.errorResponseWithoutData(
        res,
        res.__("Something went wrong")
      );
    }
  },

  getAllAvailableOrientations: async (req, res) => {
    const { page, sortBy, name } = req.query;

    let limit = 0;
    if (page) limit = PER_PAGE_LIMIT;
    const pageNo = page && page > 0 ? parseInt(page, 10) : 26;

    const offset = (pageNo - 1) * limit;
    // let sorting = [["name", sortBy ? sortBy : "ASC"]];
    // let sorting = [
    //   [
    //     sequelize.literal(`(
    //       CASE
    //         WHEN name = 'Female' THEN 1
    //         WHEN name = 'Male' THEN 2
    //         ELSE 3 + ROW_NUMBER() OVER (ORDER BY name)
    //       END
    //     )`),
    //     'ASC'
    //   ]
    // ];

    if (
      sortBy &&
      (sortBy.toUpperCase() === "ASC" || sortBy.toUpperCase() === "DESC")
    ) {
      sorting = [["name", sortBy.toUpperCase()]];
    }

    let options = {
      where: {},
      // order: sorting,
      offset: offset,
    };

    if (limit) options["limit"] = limit;

    if (name) {
      options["where"]["name"] = {
        [Op.like]: `%${name}%`,
      };
    }

    try {
      let data = await SexualOrientation.findAndCountAll(options);
      if (data.rows.length > 0) {
        return Response.successResponseData(
          res,
          data,
          res.locals.__("Orientation Options found successfully")
        );
      } else {
        return Response.errorResponseData(
          res,
          res.locals.__("No Orientation Options found"),
          data,
          NOT_FOUND
        );
      }
    } catch (error) {
      console.log("errorencountered=>", error);
      return Response.errorResponseWithoutData(
        res,
        res.__("Something went wrong"),
        INTERNAL_SERVER
      );
    }
  },

  changeMeetForCoffeeStatus: async (req, res) => {
    const { authUserId } = req;

    let userDetails = await User.findByPk(authUserId);

    if (userDetails.meet_for_coffee) {
      userDetails.meet_for_coffee = false;
      userDetails.meet_for_coffee_updatedAt = moment().format(
        "YYYY-MM-DD hh:mm:ss"
      );
      await userDetails.save();
      return Response.successResponseWithoutData(
        res,
        res.__("Meet for coffee turned off")
      );
    } else {
      userDetails.meet_for_coffee = true;
      userDetails.meet_for_coffee_updatedAt = moment().format(
        "YYYY-MM-DD hh:mm:ss"
      );
      await userDetails.save();
      return Response.successResponseWithoutData(
        res,
        res.__("Meet for coffee turned on")
      );
    }
  },

  getAllAvailableAgeGroups: async (req, res) => {
    try {
      let data = await AgeGroup.findAndCountAll();
      if (data.rows.length > 0) {
        return Response.successResponseData(
          res,
          data,
          res.locals.__("Age group options found successfully")
        );
      } else {
        return Response.errorResponseData(
          res,
          res.locals.__("No Age group Options found"),
          data,
          NOT_FOUND
        );
      }
    } catch (error) {
      console.log(": error ", error);
      return Response.errorResponseWithoutData(
        res,
        res.__("Something went wrong"),
        INTERNAL_SERVER
      );
    }
  },

  userSelectAgeGroups: async (req, res) => {
    const { authUserId } = req;

    const reqParam = req.body;

    const reqObj = {
      age_group_id: Joi.number().integer().required().label("Age group"),
    };

    // bad request error generation
    const schema = Joi.object(reqObj);
    const { error } = schema.validate(reqParam);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(`${error.details[0].message}`)
      );
    }

    let alreadyAddedAge = await UserAgeGroup.findOne({
      where: {
        user_id: authUserId,
      },
    });

    // if exists then update
    if (alreadyAddedAge) {
      alreadyAddedAge.age_group_id = reqParam.age_group_id;
      await alreadyAddedAge.save();

      return Response.successResponseWithoutData(
        res,
        res.__("Age group updated successfully")
      );
    }

    try {
      await UserAgeGroup.create({
        user_id: authUserId,
        age_group_id: reqParam.age_group_id,
      });

      return Response.successResponseWithoutData(
        res,
        res.__("Age group added successfully")
      );
    } catch (error) {
      console.log("eerr", err);
      return Response.errorResponseWithoutData(
        res,
        res.__("Something went wrong"),
        INTERNAL_SERVER
      );
    }
  },

  changeLatitudeLongitude: async (req, res) => {
    const { authUserId } = req;

    const reqParam = req.body;
    const reqObj = {
      latitude: Joi.string().required(),
      longitude: Joi.string().required(),
    };

    const schema = Joi.object(reqObj);
    const { error } = schema.validate(reqParam);
    if (error) {
      console.log(error);
      return Response.validationErrorResponseData(
        res,
        res.__(`${error.details[0].message}`)
      );
    }

    let userDetails = await User.findByPk(authUserId);
    userDetails.latitude = reqParam.latitude;
    userDetails.longitude = reqParam.longitude;
    await userDetails.save();
    return Response.successResponseWithoutData(
      res,
      res.__("Geolocation coordinates updated successfully")
    );
  },

  constantsList: async (req, res) => {
    let constants = require("../../services/Constant");

    if (constants && constants != {}) {
      return Response.successResponseData(
        res,
        constants,
        res.locals.__("All constants fetched successfully")
      );
    } else {
      return Response.errorResponseWithoutData(
        res,
        res.locals.__("No data found"),
        NOT_FOUND
      );
    }
  },

  checkDomainExistence: async (req, res) => {
    const reqParam = req.body;
    const reqObj = {
      domain: Joi.string().required(),
    };

    const schema = Joi.object(reqObj);
    const { error } = schema.validate(reqParam);
    if (error) {
      console.log(error);
      return Response.validationErrorResponseData(
        res,
        res.__(`${error.details[0].message}`)
      );
    }

    let userDetails = await User.findOne({
      where: {
        role: USER_ROLES.CORPORATE,
        company_domain: reqParam.domain,
      },
    });

    try {
      if (!userDetails) {
        return Response.successResponseData(
          res,
          { existence: false },
          res.__(
            "Domain does not exist you will be signed up as a corporate admin"
          )
        );
      }

      return Response.successResponseData(
        res,
        { existence: true },
        res.__(
          'Domain already exist"s you will be signed up as a corporate user'
        )
      );
    } catch (error) {
      console.log("err :: ", error);
      return Response.errorResponseData(res, res.__("Something went wrong"));
    }
  },

  staticImages: async (req, res) => {
    let imageData = await StaticData.findAll({
      where: {
        key: STATIC_DATA_KEYS.SAMPLE_IMAGES,
      },
    });

    return Response.successResponseData(
      res,
      imageData,
      res.__("Sample images found successfully")
    );
  },

  getAllUsers: async (req, res) => {
    try {
      const { page, sortBy, name, email } = req.query;

      let limit = 0;
      if (page) limit = PER_PAGE_LIMIT;
      const pageNo = page && page > 0 ? parseInt(page, 10) : 1;

      const offset = (pageNo - 1) * limit;
      let sorting = [["id", sortBy ? sortBy : "desc"]];

      let whereOptions = {
        attributes:
          // [literal(`(Select FLOOR(DATEDIFF(NOW(), dob) / 365.25))`),'age']
          ["id", "first_name", "last_name", "profile_picture"],
        where: {
          role: USER_ROLES.USER,
          status: ACTIVE,
        },
        include: [
          {
            model: UserFollower,
            as: "followers",
            include: {
              model: User,
              as: "followed_by",
            },
          },
        ],
        offset: offset,
        distinct: true,
        order: sorting,
      };

      if (limit) whereOptions["limit"] = limit;

      if (name) {
        whereOptions["where"]["first_name"] = {
          [Op.like]: `%${name}%`,
        };
      }

      if (email) {
        whereOptions["where"]["email"] = {
          [Op.like]: `%${email}%`,
        };
      }

      const activeUsers = await User.findAndCountAll(whereOptions);

      // console.log("activeUsers", activeUsers);

      if (activeUsers.length === 0) {
        return Response.errorResponseWithoutData(
          res,
          res.locals.__("No Users found"),
          NOT_FOUND
        );
      } else {
        return Response.successResponseData(
          res,
          activeUsers,
          res.locals.__("Success"),
          SUCCESS
        );
      }
    } catch (error) {
      console.log("error=>", error);
      return Response.errorResponseData(res, res.__("Something went wrong"));
    }
  },

  getUserNotifications: async (req, res) => {
    try {
      const { authUserId } = req;
      const { page, sortBy } = req.query;

      let limit = 0;
      if (page) limit = PER_PAGE_LIMIT;
      const pageNo = page && page > 0 ? parseInt(page, 10) : 1;

      const offset = (pageNo - 1) * limit;
      let sorting = [["id", sortBy ? sortBy : "desc"]];

      let whereOptions = {
        attributes: [
          "id",
          "title",
          "content",
          "user_id",
          "image",
          "json_data",
          "createdAt",
          "updatedAt",
        ],
        where: {
          user_id: authUserId,
        },
        offset: offset,
        order: sorting,
      };

      if (limit) whereOptions["limit"] = limit;

      const userNotification = await Notification.findAndCountAll(whereOptions);

      if (userNotification.length === 0) {
        return Response.errorResponseWithoutData(
          res,
          res.locals.__("No Users found"),
          NOT_FOUND
        );
      } else {
        await Notification.update(
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
          userNotification,
          res.locals.__("Success"),
          SUCCESS
        );
      }
    } catch (error) {
      console.log("error=>", error);
      return Response.errorResponseData(res, res.__("Something went wrong"));
    }
  },

  markNotificationRead: async (req, res) => {
    try {
      const { authUserId } = req;
      const reqParam = req.body;

      const reqObj = {
        notificationId: Joi.number().integer().required(),
      };

      const schema = Joi.object(reqObj);

      const { error } = schema.validate(reqParam);

      if (error) {
        console.log(error);
        return Response.validationErrorResponseData(
          res,
          res.__(`${error.details[0].message}`)
        );
      }

      const userNotification = await Notification.findOne({
        where: {
          id: reqParam.notificationId,
          user_id: authUserId,
        },
      });

      if (!userNotification) {
        return Response.errorResponseWithoutData(
          res,
          res.locals.__("Notification do not exist")
        );
      }

      // if (userNotification['user_id'] !== authUserId){
      //   return Response.errorResponseWithoutData(
      //     res,
      //     res.locals.__("Notification does not belong to you")
      //     );
      // }

      if (userNotification["is_read"] === true) {
        return Response.errorResponseWithoutData(
          res,
          res.locals.__("Notification already read")
        );
      }

      userNotification.is_read = true;
      await userNotification.save();

      return Response.successResponseData(
        res,
        userNotification,
        res.__("Notification read successfully")
      );
    } catch (error) {
      console.log("error=>", error);
      return Response.errorResponseData(res, res.__("Something went wrong"));
    }
  },

  unreadNotificationCount: async (req, res) => {
    try {
      const { authUserId } = req;

      const unreadNotification = await Notification.count({
        where: {
          user_id: authUserId,
          is_read: false,
        },
      });

      return Response.successResponseData(
        res,
        unreadNotification,
        res.__("Unread Notifications")
      );
    } catch (error) {
      console.log("error=>", error);
      return Response.errorResponseData(res, res.__("Something went wrong"));
    }
  },

  shootNotification: async (req, res) => {
    try {
      let notification = {
        title: "Test notf",
        message: "Testing chalu",
      };

      let firebaseToken =
        "eWNJmsd0RPW-ngSHWwAt_S:APA91bG6qSwrGmeaSLcnSZUMNEYxwR-XGMiJHaBX60tV7oy_QXGYHAh48VNBGdeJUpe3eZgOeHEn_yTsqrX61zXpWajOyaMCJX-aof1J7sxsbhI8JgHHe0Xn35YiUYqzyUzHm6qg729f";

      Helper.pushNotification(notification, firebaseToken);

      return res.status(200).json({ notification });
    } catch (error) {
      console.log("error=>", error);
      return Response.errorResponseData(res, res.__("Something went wrong"));
    }
  },

  pauseVenue: async (req, res) => {
    console.log("hiii");
    try {
      const { authUserId } = req;

      const venue = await User.findOne({
        where: {
          id: authUserId,
        },
      });

      if (
        venue["role"] == USER_ROLES.CORPORATE ||
        venue["role"] == USER_ROLES.CORPORATE_USER
      ) {
        return Response.errorResponseWithoutData(
          res,
          "You are not a user or venue to pause your account"
        );
      }

      if (venue["status"] == INACTIVE) {
        return Response.errorResponseWithoutData(
          res,
          res.__("Your account is already paused")
        );
      }

      venue["status"] = INACTIVE;

      await venue.save();

      return Response.successResponseWithoutData(
        res,
        res.__(`User account paused successfully !`)
      );
    } catch (error) {
      console.log("error=>", error);
      return Response.errorResponseWithoutData(
        res,
        res.__("Something went wrong"),
        INTERNAL_SERVER
      );
    }
  },

  getSubscriptionInfo: async (req, res) => {
    try {
      let { authUserId } = req;

      let userSubscriptionDetails = await SubscribedUser.findOne({
        where: {
          user_id: authUserId,
          active: YES,
        },
        order: [["id", "desc"]],
      });

      if (userSubscriptionDetails) {
        const expiryDate = moment(userSubscriptionDetails.expiry_date).add(
          userSubscriptionDetails.extended_days,
          "days"
        );

        if (expiryDate.isAfter(moment())) {
          return Response.successResponseData(res, {
            message: res.locals.__("Subscription exists"),
            is_subscription_expired: false,
          });
        } else {
          console.log("subscriptionexpired");
          return Response.errorResponseWithoutData(res, {
            message: res.locals.__("Your subscription has been expired."),
            is_subscription_expired: true,
          });
        }
      } else {
        console.log("subscriptionisnotthere");
        return Response.errorResponseWithoutData(res, {
          message: res.locals.__(
            "Kindly purchase a subscription to proceed further."
          ),
          is_subscription_expired: true,
        });
      }
    } catch (error) {
      console.log("error=>", error);
      return Response.errorResponseWithoutData(
        res,
        res.__("Something went wrong"),
        INTERNAL_SERVER
      );
    }
  },

  createSampleImage: async (req, res) => {
    console.log("done");
    try {
      const reqParam = req.body;

      const reqObj = {
        key: Joi.string().required(),
        value: Joi.string().required(),
        label: Joi.string().required(),
      };

      const schema = Joi.object(reqObj);

      const { error } = schema.validate(reqParam);

      if (error) {
        return Response.validationErrorResponseData(
          res,
          res.__(`${error.details[0].message}`)
        );
      }

      const createSampleImage = await StaticData.create({
        key: reqParam.key,
        label: reqParam.label,
        value: reqParam.value,
      });

      return Response.successResponseData(
        res,
        createSampleImage,
        res.__(`Sample Image created sucessfully !`)
      );
    } catch (error) {
      console.log("error=>", error);
      return Response.errorResponseWithoutData(
        res,
        res.__("Something went wrong"),
        INTERNAL_SERVER
      );
    }
  },

  // Constant : require("../../services/Constant")
};
