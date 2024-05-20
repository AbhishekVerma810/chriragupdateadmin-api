const path = require("path");
const fs = require("fs-extra");
const { StaticData } = require('../models')
const { FirebaseDynamicLinks} = require('firebase-dynamic-links');
const firebaseDynamicLinks = new FirebaseDynamicLinks(
    process.env.firebaseWebApiKey
  );

const FCM = require("fcm-node"); 
var fcm = new FCM(process.env.SERVER_KEY);


const {ASSETS_PATH,USER_IMAGE_PATH,INTERNAL_SERVER} = require("./Constant");
const { User } = require('../models');
const Response = require("./Response");

// to be used in refercode
const adjectives = ['bold', 'calm', 'cool', 'dark', 'dear', 'deep', 'fair', 'fine', 'firm', 'free','kind', 'lean', 'ligh', 'love', 'lush', 'neat', 'nice', 'nova', 'open', 'pale','yell','pool','move','wind','mind','seat','bill','mean','keen','oops','hand'];

module.exports = {

    AppName :'Coffee Twist ',
    eventAttendanceStatus: 'eventAttendance',
    eventInvite: 'eventInvite',
    eventStatus: 'eventStatus',
    forgotPassword : 'forgotPassword',
    matchFound: 'matchFound',
    newFollower: 'newFollower',
    ambassadorAcceptedMail:"ambassadorAcceptedMail",
    ambassadorRejectedMail:"ambassadorRejectedMail",
    sendMailVerificationCode : 'sendMailVerificationCode',
    sendLoginCreds: 'sendLoginCreds',
    companyEmail :  process.env.COMPANY_EMAIL ,

    generateReferralCode : async() =>{
        const randomChars = Math.random().toString(36).substr(2,2).toUpperCase(); // generates 2-3 random alphanumeric characters
        const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
        const randomNumber = Math.floor(Math.random() * 90) + 10; // generates random number between 10 and 99
        const referralCode = randomChars + adjective + randomNumber;
        // check if it is unique
       await module.exports.checkIfTheReferCodeIsUninque(referralCode)
       return referralCode
    },
    GET_STATIC_DATA :  async(key) =>{
        // console.log("key",key);
        let data = await StaticData.findOne({where:{key}})
        // console.log("GET_STATIC_DATA",data.value);
        return data.value
    },

    // check if the generated code is unique
    checkIfTheReferCodeIsUninque : async(referCode)=>{
       let data = await User.findOne({where : {
             referral_code : referCode
       }});
       if(data) module.exports.generateReferralCode()
       else return
    },

    ImageUpload: async (reqImgPath, res, imageName , folder = USER_IMAGE_PATH , AssetPath) => {
        const oldPath = reqImgPath;
        const newPath = `${path.join(__dirname,folder)}/${imageName}`;
        const rawData = fs.readFileSync(oldPath);

        // eslint-disable-next-line consistent-return
        let link = await new Promise( async (resolve, reject) => {
            fs.writeFile(newPath, rawData, err => {
                if (err) {
                    console.log(": err", err);
                    reject(
                        Response.errorResponseWithoutData(
                            res,
                            res.__("Image upload failed"),
                            INTERNAL_SERVER
                        )
                    )
                    return
                }else{
                    if(AssetPath){
                        resolve(`${AssetPath}${imageName}`);
                    }else{
                        console.log("else");
                        resolve(`${ASSETS_PATH}${imageName}`);
                    }
                }
            });
        })
        console.log(": link :: ", link);
        return link
    },

    RemoveImage: (res, imageName) => {
        const ImagePath = `${path.join(__dirname,'../public')}${imageName}`;
        // eslint-disable-next-line consistent-return
        fs.unlink(ImagePath, err => {
            if (err) {
                console.log("error on image removal :: ", err);
                return Response.errorResponseData(
                    res,
                    res.__("Something went wrong"),
                    500
                );
            }else return
        });
    },

    toUpperCase: str => {
        if (str.length > 0) {
            const newStr = str
                .toLowerCase()
                .replace(/_([a-z])/, m => m.toUpperCase())
                .replace(/_/, "");
            return str.charAt(0).toUpperCase() + newStr.slice(1);
        }
        return "";
    },

    validationMessageKey: (apiTag, error) => {

        let key = module.exports.toUpperCase(error.details[0].context.key);
        let type = error.details[0].type.split(".");
        type = module.exports.toUpperCase(type[1]);
        key = apiTag + " " + key + " " + type;
        return key;
    },

    makeRandomNumber: length => {
        let result = "";
        const characters = "123456789";
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(
                Math.floor(Math.random() * charactersLength)
            );
        }
        return result;
    },

    createListingLink : async(eventId) =>{
        return `${process.env.DOMAIN}/event/${eventId}`
    },


    createDynamicLink: async function(info) {
        console.log("info", info);
        // console.log( " :: process.env.domainUriPrefix :: ", process.env.domainUriPrefix);
        const { shortLink, previewLink } =
        await firebaseDynamicLinks.createLink({
            dynamicLinkInfo: {
                domainUriPrefix:process.env.domainUriPrefix,
                androidInfo: {
                    androidPackageName: process.env.androidPackageName,
                },
                link: `${info.link}?event_id=${info.id}`,
                iosInfo: {
                    iosBundleId: process.env.iosBundleId,
                },
                socialMetaTagInfo: {
                    socialTitle: info.name,
                    socialDescription: info.id,
                }
            },
            
        });
        return shortLink;
    },


    pushNotification(notification, firebaseToken) {
        // console.log("notification", notification, "firebaseToken", firebaseToken);
        let message;
        if (Array.isArray(firebaseToken)) {
            console.log("arrayOfTokensrecieved");
            const firebaseTokenSet = new Set(firebaseToken)
            const firebaseTokenArray = Array.from(firebaseTokenSet)
            message = {
                //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                registration_ids: firebaseTokenArray,
                // collapse_key: 'your_collapse_key',

                notification: {
                    title: notification.title,
                    message : notification.message
                },

                data: {
                    channelKey: "high_importance_channel",
                    body: notification.message
                }
            };

        } else {
            console.log("singleTokenrecieved");
            message = {
                //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                to: firebaseToken,
                // collapse_key: 'your_collapse_key',
                notification: { 
                    title: notification.title,
                    body : notification.message,
                    click_action: "FLUTTER_NOTIFICATION_CLICK",
                },
                data: {
                profile_id: notification.user_id,
                notification_type: notification.notification_type
                },
                priority:1
            };
        }

        if (message) {
            fcm.send(message, function(err, response) {
                if (err) {
                    console.log("Something has gone wrong!", err);
                } else {
                    console.log("Successfully sent with response: ", response);
                }
            });
        }
    },

}