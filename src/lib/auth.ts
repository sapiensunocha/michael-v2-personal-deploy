import jwt, { JwtPayload } from "jsonwebtoken";

// Generate Access Token (short-lived)
export function generateAccessToken(userId: string) {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: "7d" }); 
}

// Generate Refresh Token (long-lived)
export function generateRefreshToken(userId: string) {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: "7d" }); // 7 days
}

// Verify Access Token
export function verifyAccessToken(token: string): JwtPayload | null {
  try {
    if (!token) {
      return null;
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, { ignoreExpiration: true }) as JwtPayload;
    if (!decoded) {
      return null;
    }
    return decoded;
  } catch (error:any) {
    console.error("Invalid access token:", error.message);
    return null;
  }
}

// Verify Refresh Token
export function verifyRefreshToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as JwtPayload;
  } catch (error:any) {
    console.error("Invalid or expired refresh token:", error.message);
    return null;
  }
}
