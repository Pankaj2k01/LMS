import { env } from "./env.js";

export const providerConfig = {
  app: {
    schoolName: env.schoolName,
    schoolAddress: env.schoolAddress,
    appBaseUrl: env.appBaseUrl,
    supportEmail: env.supportEmail,
    supportPhone: env.supportPhone
  },
  payments: {
    activeProvider: env.paymentGateway,
    razorpay: {
      keyId: env.razorpayKeyId,
      keySecret: env.razorpayKeySecret
    },
    stripe: {
      secretKey: env.stripeSecretKey,
      webhookSecret: env.stripeWebhookSecret
    },
    payu: {
      merchantKey: env.payuMerchantKey,
      salt: env.payuSalt
    }
  },
  sms: {
    activeProvider: env.smsProvider,
    apiKey: env.smsApiKey,
    senderId: env.smsSenderId,
    baseUrl: env.smsBaseUrl
  },
  otp: {
    activeProvider: env.otpProvider,
    apiKey: env.otpApiKey,
    templateId: env.otpTemplateId
  },
  gps: {
    activeProvider: env.gpsProvider,
    apiKey: env.gpsApiKey,
    baseUrl: env.gpsBaseUrl,
    deviceToken: env.gpsDeviceToken
  },
  storage: {
    activeProvider: env.storageProvider,
    cloudinary: {
      cloudName: env.cloudinaryCloudName,
      apiKey: env.cloudinaryApiKey,
      apiSecret: env.cloudinaryApiSecret
    },
    aws: {
      accessKeyId: env.awsAccessKeyId,
      secretAccessKey: env.awsSecretAccessKey,
      region: env.awsRegion,
      bucketName: env.awsBucketName
    }
  },
  firebase: {
    projectId: env.firebaseProjectId,
    clientEmail: env.firebaseClientEmail,
    privateKey: env.firebasePrivateKey
  }
};

export const integrationSummary = {
  payments: [
    `Active Provider: ${providerConfig.payments.activeProvider || "Not configured"}`,
    "Razorpay",
    "Stripe",
    "PayU"
  ],
  notifications: [
    `SMS Provider: ${providerConfig.sms.activeProvider || "Not configured"}`,
    `OTP Provider: ${providerConfig.otp.activeProvider || "Not configured"}`,
    "Firebase Notifications"
  ],
  storage: [
    `Storage Provider: ${providerConfig.storage.activeProvider || "Not configured"}`,
    "Cloudinary",
    "AWS S3"
  ],
  auth: ["JWT", "Username Login", "Email Login", "OTP Ready"]
};
