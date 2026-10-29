import { authenticator } from "otplib";
import QRCode from "qrcode";

const ISSUER = "Team Bahrain Admin";

export function generateTotpSecret() {
  return authenticator.generateSecret();
}

export function verifyTotp(secret: string, token: string) {
  try {
    return authenticator.verify({ token, secret });
  } catch {
    return false;
  }
}

export async function totpQrDataUrl(username: string, secret: string) {
  const uri = authenticator.keyuri(username, ISSUER, secret);
  return QRCode.toDataURL(uri);
}
