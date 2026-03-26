import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT || 5001,
  jwtSecret: process.env.JWT_SECRET || "change-this-secret",
  clientUrls: (process.env.CLIENT_URLS || process.env.CLIENT_URL || "http://127.0.0.1:5173,http://127.0.0.1:5174,http://localhost:5173,http://localhost:5174")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean),
  mongodbUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/lms",
  schoolName: process.env.SCHOOL_NAME || "EduCore",
  schoolAddress: process.env.SCHOOL_ADDRESS || "School Address",
  appBaseUrl: process.env.APP_BASE_URL || "http://127.0.0.1:5174",
  supportEmail: process.env.SUPPORT_EMAIL || "support@educore.app",
  supportPhone: process.env.SUPPORT_PHONE || "",
  paymentGateway: process.env.PAYMENT_GATEWAY || "manual",
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || "",
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || "",
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
  payuMerchantKey: process.env.PAYU_MERCHANT_KEY || "",
  payuSalt: process.env.PAYU_SALT || "",
  smsProvider: process.env.SMS_PROVIDER || "disabled",
  smsApiKey: process.env.SMS_API_KEY || "",
  smsSenderId: process.env.SMS_SENDER_ID || "",
  smsBaseUrl: process.env.SMS_BASE_URL || "",
  otpProvider: process.env.OTP_PROVIDER || "disabled",
  otpApiKey: process.env.OTP_API_KEY || "",
  otpTemplateId: process.env.OTP_TEMPLATE_ID || "",
  gpsProvider: process.env.GPS_PROVIDER || "disabled",
  gpsApiKey: process.env.GPS_API_KEY || "",
  gpsBaseUrl: process.env.GPS_BASE_URL || "",
  gpsDeviceToken: process.env.GPS_DEVICE_TOKEN || "",
  storageProvider: process.env.STORAGE_PROVIDER || "local",
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || "",
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || "",
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  awsRegion: process.env.AWS_REGION || "",
  awsBucketName: process.env.AWS_BUCKET_NAME || "",
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID || "",
  firebaseClientEmail: process.env.FIREBASE_CLIENT_EMAIL || "",
  firebasePrivateKey: process.env.FIREBASE_PRIVATE_KEY || ""
};
