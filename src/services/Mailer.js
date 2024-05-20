var nodemailer = require("nodemailer");
var Email = require("email-templates");
const { EMAIL_PATH } = require("./Constant");

const Helper = require('./Helper')

module.exports = {

	sendMail: async (toEmail, mailSubject, templateName, locale) => {
		console.log("maildata", toEmail, mailSubject, templateName, locale);

		try {

			locale = { ...locale, companyEmail: Helper.companyEmail }

			if (process.env.SEND_EMAIL === "true") {
				const configOption = {
					host: process.env.SMTP_HOST,
					port: process.env.SMTP_PORT,
					secure: false,
					auth: {
						user: process.env.SMTP_USER,
						pass: process.env.SMTP_PASSWORD,
					},
				};
				const viewPath = EMAIL_PATH;
				const transporter = nodemailer.createTransport(configOption);
				const email = new Email({
					transport: transporter,
					send: true,
					preview: false,
					views: {
						options: {
							extension: "ejs",
						},
						root: viewPath,
					},
				});

				let info;
				// send mail with defined transport object
				info = await email.send({
					template: templateName,
					message: {
						from: process.env.COMPANY_EMAIL,
						to: toEmail,
						subject: mailSubject,
					},
					locals: locale,
				});

				if (info) {
					console.log("Message sent: %s", info.messageId);
				}
				return info;
			} else {
				return true;
			}
		} catch (error) {
			console.log("errorOccured", error);
		}
	},

};

