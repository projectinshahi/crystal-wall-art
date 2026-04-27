import { db } from "./db";

export async function sendOTP(mobile: string) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  db.otps.push({
    mobile,
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000,
  });

  console.log("OTP:", otp);
}