import jwt from "jsonwebtoken"

export default function generateToken(user: object, expiresIn: string = "15m") {
  return {
    auth: jwt.sign(user, process.env.AUTH_TOKEN_SECRET as string, { expiresIn }),
    refresh: jwt.sign(user, process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: "7d" }),
  }
}