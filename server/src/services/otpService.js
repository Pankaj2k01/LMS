import { env } from "../config/env.js";

function maskDestination(value) {
  const text = String(value || "");
  if (!text) {
    return "your registered account";
  }
  if (text.includes("@")) {
    const [name, domain] = text.split("@");
    return `${name.slice(0, 2)}***@${domain}`;
  }
  return `${text.slice(0, 2)}******${text.slice(-2)}`;
}

export async function sendPasswordResetOtp({ user }) {
  const provider = env.otpProvider || env.smsProvider || "disabled";
  const destination = user.email || user.username || user.phone || "";

  if (provider === "disabled") {
    return {
      sent: false,
      provider,
      message: `OTP provider is not configured yet. Add OTP credentials in server/.env to enable password reset delivery for ${maskDestination(destination)}.`
    };
  }

  return {
    sent: true,
    provider,
    message: `Password reset request created. An OTP will be sent through ${provider} to ${maskDestination(destination)} once provider credentials are active.`
  };
}
