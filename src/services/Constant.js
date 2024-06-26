module.exports = {
    
    STATUS_CODES : {
        ACCESS_DENIED: 401,
        BAD_REQUEST: 400,
        OK: 200,
    },

    ACTIVE: 1,
    BLOCK: 2,
    PAUSE: 3,
    DELETE: 4,

    MATCH_DISTANCE: 60,


    ACTIVE_STATUS: {
        ACTIVE: true,
        NOT_ACTIVE: false
    },

    ADMIN_TYPE: 1,
    SUBADMIN_TYPE: 2,

    USER_ROLES : {
        ADMIN: "Admin",
        CUSTOMER: "Customer",
        SELLER: "Seller",
        SUBADMIN: "SubAdmin",
        USER: "User",
        MODARATER : "MODARATER"
    },
    
    EMAIL_PATH: "src/views/emails",
    PAGE_PER_LIMIT: 10,
    PAGE_PER_LIMIT_ADMIN: 50,

    MAIL_SUBJECT : {
        DOCUMENT_APPROVED: "Your document Verified at OCANDO",
        DOCUMENT_REJECTED : "Your document rejected at OCANDO",
        EMAIL_VERIFICATION: "Email verification",
        FORGET_PASSWORD : 'Forget Password!',
        LOGIN_CREDS : "Ocando login credentials",
        UPDATE_CREDS : "Ocando update credentials",
        SUPPORT_REQUEST: "Support Request"
    },

    URI_PREFIX : {
        development: "",
        test: "",
        production: "/ocando-nodejs-prod"
    },
    
    ERROR_MESSAGES: {
        ID_REQUIRED: "id is required",
        AD_ID_REQUIRED: "Ad id is required",
        AD_NOT_FOUND: "Ad listing not found",
        AD_LISTING_ALREADY_DELETED: "Ad Listing already deleted",
        AD_TYPE_REQUIRED: "Ad type is required",
        ABOUT_US_NOT_FOUND: "About us not found",
        BAD_LATITUDE_LONGITUDE_VALUES: "Bad values for latitude and longitude are seen",
        BANK_DETAILS_EXISTS:"Bank Details already exist",
        BANK_DETAILS_NOT_EXISTS:"Bank Details not exist",
        BUSINESS_AD_ID_REQUIRED: "Business ad id is required",
        BUSINESS_AD_NOT_FOUND: "Business ad not found",
        BUSINESS_ALREADY_DELETED: "Business already deleted",
        BUSINESS_NAME_EXIST: "Business with this name already exists",
        BUSINESS_ID_REQUIRED: "Business Id is required",
        BUSINESS_NOT_FOUND: "No business found",
        BUSINESS_REVIEW_EXIST: "You have already reviewed this business",
        CATEGORY_ALREADY_DELETED: "Category already deleted",
        CATEGORY_ID_REQUIRED: "Category Id is required",
        CATEGORY_EXISTS: "Category name already exist",
        CATEGORY_NOT_FOUND: "Category does not exist",
        CERTIFICATE_NOT_REMOVE: "You cannot remove certicate",
        CLIENT_ERROR: "Something went wrong",
        CHAT_CHANNEL_ID_REQUIRED: "Chat channel id is required",
        CHAT_CHANNEL_NOT_FOUND: "Chat channel does not exist",
        CHAT_MESSAGE_NOT_FOUND: "Chat message does not exist",
        CORE_BUSINESS_ID_REQURIED: "Core business id is required",
        CORE_BUSINESS_EXIST: "You already have a core business",
        CUISINE_ALREADY_DELETED: "Cuisine already deleted",
        CUISINE_EXIST: "Cuisine with this name already exist",
        CUISINE_ID_REQUIRED: "Cuisine id is requried",
        CUISINE_NOT_FOUND: "Cuisine does not exist",
        DONATE_ID_REQUIRED: "Donate id is required",
        DONATE_NOT_FOUND: "Donate does not exist",
        DOCUMENT_NOT_FOUND:"Document does not exist",
        DOCUMENT_REVIEW_PENDING: "Your document is still pending wait until admin approves it",
        DOCUMENR_ALREADY_VERIFIED: "Your document is already verified",
        EMAIL_NOT_FOUND: "Email does not exist",
        EMAIL_NOT_FOUND_SIGN_UP: "Oops! email address is not associated. Please sign up on our platform",
        EMAIL_EXIST: "Email already exist",
        EMAIL_FAILED: "Failed to send mail please try after some time",
        EVENY_NOT_FOUND: "Event does not exist",
        EXPIRED_OPT: "Otp expired",
        EXPIRED_LISTING_UPDATION: "Expired listing cannot be updated",
        FAQS_NOT_FOUND:"FAQs does not exist",
        FRONT_BACK_PIC_REQUIRED: "Front pic and back pic is required",
        INVALID_AD_IDS: "Invalid ads ids are not allowed",
        INVALID_CHAT_MEMBER: "You are not a valid member in this chat",
        IEAT_LISTINGS_NOT_REMOVED: "To delete a menu category you have to remove it from all active i eat listings",
        IEAT_AD_NOT_FOUND: "IEat Ad listing not found",
        IEAT_CORE_BUSINESS_NOT_FOUND: "IEat Core Business listing not found",
        INACTIVE_USER_REVIEW: 'Only active users can review a listing',
        INCORRECT_OTP: "Otp is incorrect",
        INVALID_CREDS: "Invalid Credentials!!",
        INVALID_TABLE_NAME: "Invalid table name",
        INVOICE_EXIST: "Invoice already exist",
        INVOICE_ID_REQUIRED: "Invoice id is required",
        INVOICE_TYPE_REQUIRED: "Invoice Type is required",
        INVOICE_NOT_FOUND: "Invoice does not exist",
        IS_ALREADY_SPOTLIGHT: "Is already spotlight",
        LICENSE_EXIST: "License Id already exists",
        LISTING_ALREADY_DELETED: "Listing already deleted",
        LISTING_EXISTS: "Listing name already exist", 
        LISTING_ID_REQUIRED: "Listing Id is required",
        LISTING_NOT_FOUND: "Listing does not exist",
        MAIL_NOT_SENT: "Failed to sent mail please try after some time",
        MANUFACTURER_EXIST: "Manufacturer with this name already exists",
        MANUFACTURER_ID_REQUIRED: "Manufacturer id is required",
        MANUFACTURER_NOT_FOUND: "Manufacturer does not exists",
        MANUFACTURER_ALREADY_DELETED: "Manufacturer already deleted",
        MODEL_EXIST: "Model with this name already exists",
        MODEL_ID_REQUIRED: "Model id is required",
        MODEL_NOT_FOUND: "Model does not exists",
        MODEL_ALREADY_DELETED: "Model already deleted",
        MOBILE_EXIST: "Mobile number already exists",
        MOBILE_NOT_FOUND: "Mobile number does not exists",
        MODIFIER_EXIST: "Your business already have a modifier with this name",
        MODIFIER_NOT_FOUND: "Modifier does not exist",
        MODARATER_ID_REQUIRED: "Modarater Id is required",
        MODARATER_NOT_FOUND: "Modarater does not exist",
        MENU_CATEGORY_EXIST: "Your business already have a menu category with this name",
        MENU_CATEGORY_NOT_FOUND: "Menu category does not exist",
        ONLY_IMAGES_ALLOWED: "Only images are accepted",
        OTP_CREATION_FAILED: "Failed to create otp",
        ORDER_ID_REQUIRED: "Order id is required",
        ORDER_NOT_FOUND: "Order does not exist",
        PROFESSION_ALREADY_DELETED: "Profession already deleted",
        PROFESSION_ID_REQUIRED: "Profession Id is required",
        PROFESSION_EXISTS: "Profession name already exist",
        PROFESSION_NOT_FOUND: "Profession does not exist",
        PROVINCE_NOT_FOUND: "Province does not exist",
        PAYOUT_NOT_FOUND: "Payout does not exist",
        PAYOUT_NOT_CANCELLED: "Payout not be cancelled",
        PAYOUT_TYPE_REQUIRED: "Payout Type is required",
        PRIVACY_POLICY_NOT_FOUND: "Privacy Policy does not exist",
        QUOTATION_NOT_FOUND: "Quotation does not exist",
        QUOTATION_ID_REQUIRED: "Quotation id required",
        REVIEW_NOT_FOUND: "Review does not exist",
        RPORT_NOT_FOUND: "Report does not exist",
        RIDER_ACTIVE_LISTING_EXIST: "You already have an active ad listing",
        RIDER_TYPE_CANNOT_BE_CHANGED: "You cannot change the rider type",
        RIDER_TYPE_MISMATCH: "Rider type cannot be changed",
        RIDER_CONNECTING_AHEAD_TIMESLOT: "Only rider connecting ahead can update their time slots",
        RENTAL_CORE_BUSINESS_NOT_FOUND: "Rental Core Business listing not found",
        REFUND_TYPE_REQUIRED: "Refund Type is required",
        SIZE_MISMATCH: "No matching size found",
        SPOTLIGHT_ID_REQUIRED:" Spotlight id required",
        SPOTLIGHT_NOT_FOUND:" Spotlight not found",
        SPOTLIGHT_NOT_CREATED:" Spotlight not created",
        SELLER_ID_REQUIRED: "Seller id is required",
        SUPPORT_NOT_FOUND: "Support not found",
        UNAUTHORIZED_ACCESS_TOKEN: "Invalid access token",
        UNAUTHORIZED_CHANGES: "You are not authorized to make changes",
        UID_NOT_FOUND: "Uid does not exist",
        RECEIVER_ID_REQUIRED: "Receiver id is required",
        REFUND_NOT_FOUND: "Refund not found",
        STRIPE_ERROR: "stripe error",
        SELF_ORDER: "You cannot order your own ad listing",
        SELF_QUOTATION: "You cannot give quote to your own business",
        TIME_SLOT_UPDATION: "No time slots to update",
        TYPE_NOT_FOUND: "Business type does not exist",
        TEST_CASE_NOT_FOUND: "Invalid action",
        TERMS_AND_CONDITION_NOT_FOUND: "Terms & Conditon not found",
        UNAUTHORIZED_LOGIN: "You are not allowed to login",
        USER_ALREADY_DELETED: "User already deleted",
        USER_ALREADY_BLOCKED: "User already Blocked",
        USER_ID_REQUIRED: "User Id is required",
        DOCUMENT_ID_REQUIRED:"Document Id is required",
        USER_NOT_CUSTOMER: "User not found or not a customer",
        USER_NOT_FOUND: "User does not exist",
        USER_NOT_SELLER: "User not found or not a seller",
        VEHICLE_NOT_FOUND: "Vehicle does not exist",
        WISHLIST_ID: "Wishlist id is required",
        WISHLIST_ALREADY_ADD: "Already added to wishlist",
        WISHLIST_NOT_FOUND: "Wishlist does not exist",
        YEAR_REQUIRED: "Year is required"
    },
    
    SUCCESS_MESSAGES: {
        AD_CREATION: "Ad listing created successfully",
        AD_DELETION: "Ad listing deleted successfully",
        AD_FETCH: "Ad listings fetched successfully",
        SINGLE_AD_FETCH: "Ad listing fetched successfully",
        AD_UPDATION: "Ad listing updated successfully",
        ABOUT_US_FETCH: "About us fetched successfully",
        ABOUT_US_UPDATE: "About us update successfully",
        ABOUT_US_CREATE: "About us create successfully",
        BANK_DETAILS: "Bank Detail created successfully",
        BANK_DETAILS_UPDATION: "Bank Detail updated successfully",
        BANK_FETCH: "Bank Detail fetched successfully",
        BUSINESS_CREATION: "Business created successfully",
        BUSINESS_DELETION: "Business deleted successfully",
        BUSINESS_FETCH: "Business fetched successfully",
        BUSINESS_UPDATION: "Business updated successfully",
        BUSINESS_LISTING_CREATION: "Business listing created successfully",
        BUSINESS_CATEGORY_FETCH: "Business categories fetched successfully",
        BUSINESS_LISTING_UPDATION: "Business listing updated successfully",
        BUSINESS_TYPE_FETCH: "Business types fetched successfully",
        CSV_FILE_DOWNLOAD_SUCCESSFULLY: "Csv file download successfully",
        CATEGORY_CREATION: "Category created successfully",
        CATEGORY_DELETION: "Category deleted successfully",
        CATEGORY_FETCH: "Categories fetched successfully",
        CATEGORY_UPDATION: "Category updated successfully",
        CARMODEL_FETCH: "Car models fethched successfully",
        CHAT_CHANNEL_CREATED: "Chat channel created",
        CHAT_CHANNEL_EXIST: "Chat channel found",
        CHAT_CHANNEL_NOT_FOUND: "Chat channel not found",
        CHAT_CHANNEL_FETCH: "Chat channels fetched successfully",
        CHAT_MESSAGE_CREATION: "Chat message created successfully",
        CHAT_MESSAGE_FETCH: "Chat messages fetched successfully",
        CORE_BUSINESS_CREATION: "Core business created successfully",
        CORE_BUSINESS_DELETION: "Core business deleted successfully",
        CORE_BUSINESS_FETCH: "Core business fetched successfully",
        CORE_BUSINESS_UPDATION: "Core business updated successfully",
        CUISINE_CREATION: "Cuisines created successfully",
        CUISINE_FETCH: "Cuisines fetched successfully",
        CUISINE_DELETION: "Cuisines deleted successfully",
        CUISINE_UPDATION: "Cuisines updated successfully",
        CUSTOMER_CREATION: "Customer created successfully",
        DOCUMENT_REJECTED: "Document rejected successfully",
        DOCUMENT_APPROVED: "Document approved successfully",
        DOCUMENT_SUBMITTED: "Documents submitted wait for admin approval",
        DISTANCE_FEE_CALCULATED: "Distance fee calculated successfully",
        DONATE_THANKS_CREATION: "Please make the payment to continue",
        DONATE_THANKS_FETCH: "Donate Thanks  fetch successfully",
        DONATE_THANKS_UPDATE: "Donate Thanks Update successfully",
        DONATE_THANKS_DELETED: "Donate Thanks  deleted successfully",
        DISPUTED_UPDATED: "Dispute Update successfully",
        EMAIL_VERIFICATION: "Email verified successfully",
        EVENT_CATEGORY_FETCH: "Event categories fetched successfully",
        EVENT_CREATION: "Event created successfully",
        EVENT_FETCH: "Events fetched successfully",
        EVENT_DELETION: "Event deleted successfully",
        EVENT_UPDATION: "Event updated successfully",
        FCM_TOKEN_ADDED: "Fcm token updated successfully",
        FAQS_CREATION: "FAQs create successfully",
        FAQS_DELETION: "FAQs deleted successfully",
        FAQS_UPDATE: "FAQs update successfully",
        FAQS_FETCH: "FAQs fetch successfully",
        FEEDBACK_CREATION: "Feedback create successfully",
        FEEDBACK_DELETION: "Feedback delete successfully",
        IDENTITY_VERIFICATION_STATUS: "Identity verification status fetched successfully",
        INVOICE_CREATION: "Invoice created successfully",
        INVOICE_FETCH: "Invoice fetched successfully",
        INVOICE_DELETION: "Invoice deleted successfully",
        INVOICE_UPDATION: "Invoice updated successfully",
        LISTING_CREATION: "Listing created successfully",
        LISTING_FETCH: "Listings fetched successfully",
        LISTING_DELETION: "Listing deleted successfully",
        LISTING_UPDATION: "Listing updated successfully",
        LOGIN_SUCCESS: "Logged in successfully",
        LOGOUT_SUCCESS: "Logged out successfully",
        LISTING_MODARATE: "Listing Modarate successfully",
        MANUFACTURER_CREATION: "Manufacturer created successfully",
        MANUFACTURERS_FETCH: "Manufacturers fetched successfully",
        MANUFACTURER__UPDATION: "Manufacturer updated successfully",
        MANUFACTURER_DELETION: "Manufacturer deleted successfully",
        MENU_CATEGORY_CREATION: "Menu category created successfully",
        MENU_CATEGORY_FETCH: "Menu categories fetched successfully",
        MENU_CATEGORY_UPDATION: "Menu category updated successfully",
        MENU_CATEGORY_DELETION: "Menu category deleted successfully",
        MODEL_CREATION: "Model created successfully",
        MODEL_FETCH: "Model fetched successfully",
        MODEL_UPDATION: "Model updated successfully",
        MODEL_DELETION: "Model deleted successfully",
        MODIFIER_CREATION: "Modifier created successfully",
        MODIFIER_FETCH: "Modifiers fetched successfully",
        MODIFIER_UPDATION: "Modifier updated successfully",
        MODIFIER_DELETION: "Modifier deleted successfully",
        MOBILE_VERIFIED: "Congratulations your mobile is verified on our platfrom",
        MODARATER_CREATION: "Modarater created successfully",
        MODARATER_DELETION: "Modarater deleted successfully",
        MODARATER_UPDATION: "Modarater Updated successfully",
        NOTIFICATION_FETCH: "Notification fetch successfully",
        NOTIFICATION_COUNT: "Notification count successfully",
        OTP_SENT: "Otp sent successfully",
        OTP_VERIFIED: "Otp verified successfully",
        ORDER_CREATION: "Order created successfully",
        ORDER_FETCH: "Orders fetched successfully",
        ORDER_STATUS_UPDATE: "Order status updated successfully",
        ORDER_DELETION: "Order deleted successfully",
        PLACED_FETCH_SUCCESS: "Places fetched successfully",
        PROFESSION_CREATION: "Profession created successfully",
        PROFESSION_DELETION: "Profession deleted successfully",
        PROFESSION_FETCH: "Professions fetched successfully",
        PROFESSION_UPDATION: "Profession updated successfully",
        PAYMENT_CANCELLED_SUCCESS: "Payment canceled successfully",
        PAYOUT_SUCCESS: "Payout successfully",
        PAYOUT_FETCH_SUCCESS: "Payout fetch successfully",
        PENDING_PAYOUT_FETCH_SUCCESS: "Pending Payout fetch successfully",
        PAYOUT_UPDATE_SUCCESS: "Payout Status Update successfully",
        PRIVACY_POLICY_UPDATE_SUCCESS:"Privacy Policy Update successfully",
        PRIVACY_POLICY_CREATE_SUCCESS:"Privacy Policy Create successfully",
        PRIVACY_POLICY_FETCH_SUCCESS:"Privacy Policy fetch successfully",
        PENDINGG_REFUND_FETCH_SUCCESS: "Pending Refund fetch successfully",
        QUOTATION_CREATION: "Quotation created successfully",
        QUOTATION_FETCH: "Quotation fetched successfully",
        QUOTATIONS_FETCH: "Quotations fetched successfully",
        QUOTATION_UPDATION: "Quotation updated successfully",
        REVIEW_CREATION: "Review created successfully",
        REPORT_CREATION: "Report created successfully",
        REPORT_DELETION: "Report deleted successfully",
        REVIEW_DELETION: "Review deleted successfully",
        REVIEW_FETCH: "Reviews fetched successfully",
        REVIEW_FILTERS_FETCH: "Review filters fetched successfully",
        REVIEW_UPDATION: "Review updated successfully",
        REFUND_CREATED: "Refund Created successfully",
        REFUND_STATUS_UPDATED: "Refund Status Update successfully",
        REFUND_UPDATED: "Refund Update successfully",
        REFUND_FETCH_SUCCESS: "Refund fetch successfully",
        SELLER_CREATION: "Seller created successfully",
        SINGLE_ORDER_FETCH: "Single order fetched successfully",
        SHAREABLE_LINK_FETCH: "Shareable Link fetched successfully",
        SPOTLIGHT_CREATION: "SpotLight  created successfully",
        SPOTLIGHT_FETCH: "SpotLight  fetch successfully",
        SPOTLIGHT_UPDATE: "SpotLight Update successfully",
        SPOTLIGHT_DELETED: "SpotLight Deleted successfully",
        SUPPORT_REQUEST_CREATION: "Support request created successfully",
        SUPPORT_CREATE:"Support Ticket Raise Successfully",
        SUPPORT_REPLY: "Replied Successfully",
        SUPPORT_DELETED:"Support Ticket Deleted Successfully",
        SUPPORT_THANKS_MESSAGE:"Thank you for Contacting",
        SUPPORT_MESSAGE:"We Will Conatact shortly",
        PASSWORD_RESET: "Password reset successfully",
        TIME_SLOT_DELETION: "Time slots deleted successfully",
        TERMS_AND_CONDITION_FETCH: "Terms & condition fetched successfully",
        TERMS_AND_CONDITION_UPDATE: "Terms & condition update successfully",
        TERMS_AND_CONDITION_CREATE: "Terms & condition create successfully",
        VERIFIED_PAYMENT_INTENT: "Payment intent verified successfully",
        USER_CREATION: "Registration successful! Verify your email sent to you.",
        USER_FOUND: "User found successfully",
        USER_DELETION: "User deleted successfully",
        USER_BLOCKED: "User Blocked successfully",
        USER_LOGOUT: "User logged out successfully",
        USER_UPDATION: "User details updated successfully",
        TIME_SLOT_FETCH: "Time slots fetched successfully",
        VEHICLES_FETCHED: "Vehicles fetched successfully",
        WISHLIST_CREATION: "Added to wishlist successfully",
        WISHLIST_FETCH: "Wishlist fetched successfully",
        WISHLIST_DELETED: "Wishlist item deleted successfully",
    },

    TABLE_NAMES: {
        PROS_CORE_BUSINESS: 'pros_core_business',
        TASKER_CORE_BUSINESS: 'tasker_core_business',
        I_EAT_CORE_BUSINESS: 'i_eat_core_business',
        CARPOOL_CORE_BUSINESS: 'carpool_core_business',
        RENTAL_CORE_BUSINESS: 'rental_core_business',
        PROS_AD: 'pros_ad',
        TASKER_AD: 'tasker_ad',
        I_EAT_AD: 'i_eat_ad',
        CARPOOL_AD: 'carpool_ad',
        JOB_AD: 'job_ad',
        RENTAL_AD: 'rental_ad',
    },

    DOC_STATUS: {
        PENDING: 'pending',
        REJECTED: 'rejected',
        VERIFIED: 'verified'
    },

    SITUATION_DESCRIPTIONS: {
        BUYER_CANCELLED_THE_ORDER_BEFORE_IT_WAS_ACCEPTED_BY_SELLER: "Buyer cancelled the order before it was accepted by seller so he needs to be refunded",
        BUYER_CANCELLED_THE_ORDER_AFTER_IT_WAS_ACCEPTED_BY_SELLER: "Buyer cancelled the order after it was accepted by seller so he needs to be refunded",
        PASSENGER_CANCELLED_THE_RIDE_BEFORE_IT_WAS_ACCEPTED_BY_DRIVER_SO_HE_NEEDS_TO_BE_REFUNDED: "Passenger cancelled the ride before it was accepted by driver so he needs to be refunded",
        SELLER_CANCELLED_THE_ORDER_WITHOUT_ACCEPTING_IT: 'Seller cancelled the order without accepting it so buyer needs to be refunded',
        SELLER_ACCEPTED_THE_ORDER_BUT_BUYER_DIDNT_SHOWED_UP: "Seller accepted the order but buyer did'nt showed up",
        ORDER_WAS_SUCCESSFULLY_COMPLETED_BY_BUYER: "Order was successfully completed by buyer",
        SELLER_DID_NOT_SHOW_UP_AFTER_ACCEPTING_THE_ORDER_SO_BUYER_NEEDS_TO_BE_REFUNDED: "Seller did not show up after accepting the order so buyer needs to be refunded",
        SELLER_DID_NOT_SHOW_UP_AFTER_COMPLETING_THE_ORDER_SO_BUYER_NEEDS_TO_BE_REFUNDED: "Seller did not show up after completing the order so buyer needs to be refunded",
        SELLER_COMPLETED_THE_ORDER_BUT_BUYER_RAISED_DISPUTE: "Seller completed the order but buyer raised dispute",
        SELLER_COMPLETED_THE_ORDER_BUT_RAISED_DISPUTE: "Seller completed the order but a dispute",
        PASSENGER_CANCELED_THE_RIDE_WITHIN_24_HOURS_OF_SCHEDULED_DATE_AND_TIME_AFTER_IT_WAS_ACCEPTED_BY_THE_DRIVER: "Passenger cancelled the ride within 24 hours of scheduled date and time after it was accepted by the driver",
        PASSENGER_CANCELED_THE_RIDE_MORE_THAN_24_HOURS_OF_SCHEDULED_DATE_AND_TIME_AFTER_IT_WAS_ACCEPTED_BY_THE_DRIVER: "Passenger canceled the ride more than 24 hours of scheduled date and time after it was accepted by the driver",
        DRIVER_DID_NOT_SHOW_UP_AFTER_ACCEPTING_THE_RIDE_SO_PASSENGER_NEEDS_TO_BE_REFUNDED: "Driver did not show up after accepting the ride so passenger needs to be refunded",
        PASSENGER_SUCCESSFULLY_COMPLETED_THE_RIDE: "Passenger successfully completed the ride",
        DRIVER_COMPLETED_THE_RIDE_BUT_PASSENGER_REPORTED_HIM_AS_A_NO_SHOW: "Driver completed the ride but passenger reported him as a no show",
        DRIVER_COMPLETED_THE_RIDE_BUT_PASSENGER_RAISED_A_DISPUTE: "Driver completed the ride but passenger raised a dispute",
        SELLER_ACCEPTED_THE_ORDER: "Seller accepted the order",
        SELLER_COMPLETED_THE_ORDER: "Seller completed the order",
        SELLER_CANCELLED_THE_ORDER_AFTER_ACCEPTING_IT_SO_HE_NEEDS_TO_BE_FINED_AND_BUYER_NEEDS_TO_BE_REFUNDED: "Seller cancelled the order after accepting it so he needs to be fined and buyer needs to be refunded",
        SELLER_COMPLETED_THE_ORDER_BUT_THE_BUYER_DIDNT_SHOW_UP: "Seller completed the order but the buyer didn't show up",
        BUYER_COMPLETED_THE_ORDER_BUT_SELLER_RAISED_DISPUTE: "Buyer completed the order but seller raised dispute",
        DRIVER_ACCEPTED_THE_RIDE: "Driver accepted the ride",
        DRIVER_CANCELLED_THE_RIDE_WITHOUT_ACCEPTING_IT_AND_PASSENGER_NEEDS_TO_BE_REFUNDED: "Driver cancelled the ride without accepting it and passenger needs to be refunded",
        DRIVER_COMPLETED_THE_RIDE: "Driver completed the ride",
        DRIVER_ACCEPTED_THE_RIDE_AND_THEN_CANCELLED_IT_SO_PASSENGER_NEEDS_TO_BE_REFUNDED_AND_SELLER_NEEDS_TO_BE_FINED: "Driver accepted the ride and then cancelled it so passenger needs to be refunded and seller needs to be fined",
        DRIVER_WAS_AT_DESTINATION_AND_THE_BUYER_DID_NOT_SHOW_UP: "Driver was at destination and the buyer did not show up",
        PASSENGER_COMPLETED_THE_RIDE_BUT_DRIVER_RAISED_DISPUTE: "Passenger completed the ride but driver raised dispute"
    },

    REFUND_STATUS: {
        PENDING: "pending",
        PENDING_50: "pending_50",
        SUCCEEDED: "succeeded",
        FAILED: "failed"
    },
    
    OPT_TYPE: {
        FORGETPASSWORD: "FORGETPASSWORD",
        VERIFYEMAIL: "VERIFYEMAIL",
        VERIFYMOBILE: "VERIFYMOBILE"
    }
}